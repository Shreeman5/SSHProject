from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    'host': 'localhost',
    'database': 'my_data_db',
    'user': 'myuser',
    'password': 'mypassword123',
    'port': 5432
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)

def build_filter_query(filters):
    """Build WHERE clause from filters"""
    conditions = []
    params = []
    
    if filters.get('countries'):
        countries = filters['countries']
        placeholders = ','.join(['%s'] * len(countries))
        conditions.append(f"country IN ({placeholders})")
        params.extend(countries)
    
    if filters.get('usernames'):
        usernames = filters['usernames']
        placeholders = ','.join(['%s'] * len(usernames))
        conditions.append(f"username IN ({placeholders})")
        params.extend(usernames)
    
    if filters.get('asns'):
        asns = filters['asns']
        placeholders = ','.join(['%s'] * len(asns))
        conditions.append(f"asn_name IN ({placeholders})")
        params.extend(asns)
    
    if filters.get('date_from'):
        conditions.append("date >= %s")
        params.append(filters['date_from'])
    
    if filters.get('date_to'):
        conditions.append("date <= %s")
        params.append(filters['date_to'])
    
    where_clause = " AND ".join(conditions) if conditions else "1=1"
    return where_clause, params

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/api/stats', methods=['POST'])
def get_stats():
    """Get overall stats with optional filters"""
    try:
        filters = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        
        where_clause, params = build_filter_query(filters)
        
        cursor.execute(f"SELECT COUNT(*) as total FROM user_data WHERE {where_clause}", params)
        total = cursor.fetchone()['total']
        
        cursor.execute(f"SELECT COUNT(DISTINCT ip_address) as unique_ips FROM user_data WHERE {where_clause}", params)
        unique_ips = cursor.fetchone()['unique_ips']
        
        cursor.execute(f"SELECT COUNT(DISTINCT username) as unique_users FROM user_data WHERE {where_clause} AND username IS NOT NULL", params)
        unique_users = cursor.fetchone()['unique_users']
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_records': total,
                'unique_ips': unique_ips,
                'unique_users': unique_users
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/charts/country', methods=['POST'])
def get_country_chart():
    """Get top 10 countries over time"""
    try:
        filters = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        
        where_clause, params = build_filter_query(filters)
        
        cursor.execute(f"""
            SELECT country, COUNT(*) as count 
            FROM user_data 
            WHERE {where_clause} AND country IS NOT NULL
            GROUP BY country 
            ORDER BY count DESC 
            LIMIT 10
        """, params)
        top_countries = [row['country'] for row in cursor.fetchall()]
        
        if not top_countries:
            cursor.close()
            conn.close()
            return jsonify({'success': True, 'data': []})
        
        country_placeholders = ','.join(['%s'] * len(top_countries))
        
        if where_clause != "1=1":
            time_where = f"{where_clause} AND country IN ({country_placeholders})"
            time_params = params + top_countries
        else:
            time_where = f"country IN ({country_placeholders})"
            time_params = top_countries
        
        cursor.execute(f"""
            SELECT date, country, COUNT(*) as count 
            FROM user_data 
            WHERE {time_where} AND date IS NOT NULL
            GROUP BY date, country 
            ORDER BY date, country
        """, time_params)
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'data': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/charts/unusual', methods=['POST'])
def get_unusual_chart():
    """Get countries with unusual attack rate changes"""
    try:
        filters = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        
        where_clause, params = build_filter_query(filters)
        
        # Get daily counts for all countries
        cursor.execute(f"""
            SELECT date, country, COUNT(*) as count 
            FROM user_data 
            WHERE {where_clause} AND country IS NOT NULL AND date IS NOT NULL
            GROUP BY date, country 
            ORDER BY country, date
        """, params)
        
        daily_data = cursor.fetchall()
        
        # Organize data by country
        country_data = {}
        for row in daily_data:
            country = row['country']
            if country not in country_data:
                country_data[country] = []
            country_data[country].append({'date': row['date'], 'count': row['count']})
        
        # Calculate rate of change for each country
        rate_changes = []  # List of (country, date, rate_of_change, count)
        
        for country, daily_counts in country_data.items():
            # Sort by date
            daily_counts.sort(key=lambda x: x['date'])
            
            for i in range(1, len(daily_counts)):
                prev_count = daily_counts[i-1]['count']
                curr_count = daily_counts[i]['count']
                curr_date = daily_counts[i]['date']
                
                # If previous day is 0, treat as 1
                if prev_count == 0:
                    prev_count = 1
                
                # Calculate rate of change: (n - (n-1)) / (n-1)
                rate_of_change = (curr_count - prev_count) / prev_count
                
                rate_changes.append({
                    'country': country,
                    'date': curr_date,
                    'rate': rate_of_change,
                    'count': curr_count
                })
        
        # Sort by rate of change (descending) and get top 10
        rate_changes.sort(key=lambda x: x['rate'], reverse=True)
        top_changes = rate_changes[:10]
        
        # Get unique countries from top changes
        unusual_countries = list(set([change['country'] for change in top_changes]))
        
        # If we have fewer than 10 countries, add more
        if len(unusual_countries) < 10:
            # Continue down the list
            for change in rate_changes[10:]:
                if change['country'] not in unusual_countries:
                    unusual_countries.append(change['country'])
                    if len(unusual_countries) == 10:
                        break
        
        # Get time series for these countries
        if not unusual_countries:
            cursor.close()
            conn.close()
            return jsonify({'success': True, 'data': []})
        
        country_placeholders = ','.join(['%s'] * len(unusual_countries))
        
        if where_clause != "1=1":
            time_where = f"{where_clause} AND country IN ({country_placeholders})"
            time_params = params + unusual_countries
        else:
            time_where = f"country IN ({country_placeholders})"
            time_params = unusual_countries
        
        cursor.execute(f"""
            SELECT date, country, COUNT(*) as count 
            FROM user_data 
            WHERE {time_where} AND date IS NOT NULL
            GROUP BY date, country 
            ORDER BY date, country
        """, time_params)
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'data': results})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/charts/asn', methods=['POST'])
def get_asn_chart():
    """Get top 10 ASNs over time"""
    try:
        filters = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        
        where_clause, params = build_filter_query(filters)
        
        cursor.execute(f"""
            SELECT asn_name, COUNT(*) as count 
            FROM user_data 
            WHERE {where_clause} AND asn_name IS NOT NULL
            GROUP BY asn_name 
            ORDER BY count DESC 
            LIMIT 10
        """, params)
        top_asns = [row['asn_name'] for row in cursor.fetchall()]
        
        if not top_asns:
            cursor.close()
            conn.close()
            return jsonify({'success': True, 'data': []})
        
        asn_placeholders = ','.join(['%s'] * len(top_asns))
        
        if where_clause != "1=1":
            time_where = f"{where_clause} AND asn_name IN ({asn_placeholders})"
            time_params = params + top_asns
        else:
            time_where = f"asn_name IN ({asn_placeholders})"
            time_params = top_asns
        
        cursor.execute(f"""
            SELECT date, asn_name, COUNT(*) as count 
            FROM user_data 
            WHERE {time_where} AND date IS NOT NULL
            GROUP BY date, asn_name 
            ORDER BY date, asn_name
        """, time_params)
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'data': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/charts/username', methods=['POST'])
def get_username_chart():
    """Get top 10 usernames over time"""
    try:
        filters = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        
        where_clause, params = build_filter_query(filters)
        
        cursor.execute(f"""
            SELECT username, COUNT(*) as count 
            FROM user_data 
            WHERE {where_clause} AND username IS NOT NULL
            GROUP BY username 
            ORDER BY count DESC 
            LIMIT 10
        """, params)
        top_usernames = [row['username'] for row in cursor.fetchall()]
        
        if not top_usernames:
            cursor.close()
            conn.close()
            return jsonify({'success': True, 'data': []})
        
        username_placeholders = ','.join(['%s'] * len(top_usernames))
        
        if where_clause != "1=1":
            time_where = f"{where_clause} AND username IN ({username_placeholders})"
            time_params = params + top_usernames
        else:
            time_where = f"username IN ({username_placeholders})"
            time_params = top_usernames
        
        cursor.execute(f"""
            SELECT date, username, COUNT(*) as count 
            FROM user_data 
            WHERE {time_where} AND date IS NOT NULL
            GROUP BY date, username 
            ORDER BY date, username
        """, time_params)
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'data': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/charts/ip', methods=['POST'])
def get_ip_chart():
    """Get top 10 IPs over time with country labels"""
    try:
        filters = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        
        where_clause, params = build_filter_query(filters)
        
        cursor.execute(f"""
            SELECT ip_address, 
                   MAX(country) as country,
                   COUNT(*) as count 
            FROM user_data 
            WHERE {where_clause} AND ip_address IS NOT NULL
            GROUP BY ip_address 
            ORDER BY count DESC 
            LIMIT 10
        """, params)
        top_ips_result = cursor.fetchall()
        
        if not top_ips_result:
            cursor.close()
            conn.close()
            return jsonify({'success': True, 'data': [], 'ip_labels': {}})
        
        top_ips = [row['ip_address'] for row in top_ips_result]
        ip_labels = {row['ip_address']: f"{row['ip_address']} -- {row['country'] or 'Unknown'}" 
                     for row in top_ips_result}
        
        ip_placeholders = ','.join(['%s'] * len(top_ips))
        
        if where_clause != "1=1":
            time_where = f"{where_clause} AND ip_address IN ({ip_placeholders})"
            time_params = params + top_ips
        else:
            time_where = f"ip_address IN ({ip_placeholders})"
            time_params = top_ips
        
        cursor.execute(f"""
            SELECT date, ip_address, COUNT(*) as count 
            FROM user_data 
            WHERE {time_where} AND date IS NOT NULL
            GROUP BY date, ip_address 
            ORDER BY date, ip_address
        """, time_params)
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'data': results, 'ip_labels': ip_labels})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/charts/date', methods=['POST'])
def get_date_chart():
    """Get date distribution with country breakdown if multiple countries selected"""
    try:
        filters = request.json or {}
        conn = get_db_connection()
        cursor = conn.cursor()
        
        where_clause, params = build_filter_query(filters)
        
        if filters.get('countries') and len(filters['countries']) > 1:
            cursor.execute(f"""
                SELECT date, country, COUNT(*) as count 
                FROM user_data 
                WHERE {where_clause} AND date IS NOT NULL
                GROUP BY date, country 
                ORDER BY date, country
            """, params)
        else:
            cursor.execute(f"""
                SELECT date, COUNT(*) as count 
                FROM user_data 
                WHERE {where_clause} AND date IS NOT NULL
                GROUP BY date 
                ORDER BY date
            """, params)
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'data': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/filters/countries', methods=['GET'])
def get_countries_list():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT country FROM user_data WHERE country IS NOT NULL ORDER BY country")
        countries = [row['country'] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'data': countries})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/filters/usernames', methods=['GET'])
def get_usernames_list():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT username, COUNT(*) as count
            FROM user_data WHERE username IS NOT NULL 
            GROUP BY username ORDER BY count DESC LIMIT 100
        """)
        usernames = [row['username'] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'data': usernames})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/filters/asns', methods=['GET'])
def get_asns_list():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT asn_name FROM user_data WHERE asn_name IS NOT NULL ORDER BY asn_name")
        asns = [row['asn_name'] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'data': asns})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    os.makedirs('static', exist_ok=True)
    print("🚀 Starting API server with anomaly detection...")
    print("📡 http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
