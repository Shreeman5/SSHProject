import psycopg2
import json

DB_CONFIG = {
    'host': 'localhost',
    'database': 'my_data_db',
    'user': 'myuser',
    'password': 'mypassword123',
    'port': 5432
}

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

print("Loading ipinfo.json...")
with open('ipinfo.json', 'r') as f:
    data = json.load(f)

print(f"Loaded {len(data):,} IPs")
print("Updating geolocation...")

updated = 0
for i, (ip, geo_data) in enumerate(data.items()):
    if i % 100 == 0:
        conn.commit()
        print(f"  {i:,}/{len(data):,} ({i/len(data)*100:.1f}%)...", end="\r")
    
    try:
        cursor.execute("""
            UPDATE user_data
            SET country = %s,
                country_code = %s,
                continent = %s,
                latitude = %s,
                longitude = %s,
                asn_number = %s,
                asn_name = %s,
                asn_domain = %s,
                asn_type = %s
            WHERE ip_address = %s
        """, (
            geo_data.get('cn'),
            geo_data.get('cc'),
            geo_data.get('cntn'),
            float(geo_data.get('lat')) if geo_data.get('lat') else None,
            float(geo_data.get('lng')) if geo_data.get('lng') else None,
            geo_data.get('asn', {}).get('asn'),
            geo_data.get('asn', {}).get('name'),
            geo_data.get('asn', {}).get('domain'),
            geo_data.get('asn', {}).get('type'),
            ip
        ))
        updated += cursor.rowcount
    except:
        continue

conn.commit()
print(f"\n✅ Updated {updated:,} records")

cursor.close()
conn.close()
