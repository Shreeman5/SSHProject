import psycopg2
import time

DB_CONFIG = {
    'host': 'localhost',
    'database': 'my_data_db',
    'user': 'myuser',
    'password': 'mypassword123',
    'port': 5432
}

print("🔄 Refreshing Statistics...\n")
start = time.time()

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM user_data")
total = cursor.fetchone()[0]

tables = {
    'stats_country': """
        SELECT country, COUNT(*) as count 
        FROM user_data WHERE country IS NOT NULL 
        GROUP BY country ORDER BY count DESC LIMIT 10
    """,
    'stats_folder': """
        SELECT source_folder, COUNT(*) as count 
        FROM user_data 
        GROUP BY source_folder ORDER BY source_folder
    """,
    'stats_continent': """
        SELECT continent, COUNT(*) as count 
        FROM user_data WHERE continent IS NOT NULL 
        GROUP BY continent ORDER BY count DESC
    """,
    'stats_asn': """
        SELECT asn_name, COUNT(*) as count 
        FROM user_data WHERE asn_name IS NOT NULL 
        GROUP BY asn_name ORDER BY count DESC LIMIT 10
    """,
    'stats_username': """
        SELECT username, COUNT(*) as count 
        FROM user_data WHERE username IS NOT NULL 
        GROUP BY username ORDER BY count DESC LIMIT 10
    """,
    'stats_date': """
        SELECT date, COUNT(*) as count 
        FROM user_data WHERE date IS NOT NULL 
        GROUP BY date ORDER BY date DESC LIMIT 30
    """
}

for table, query in tables.items():
    print(f"Refreshing {table}...", end=" ")
    cursor.execute(f"DROP TABLE IF EXISTS {table}")
    cursor.execute(f"CREATE TABLE {table} AS {query}")
    
    cursor.execute(f"""
        INSERT INTO stats_metadata (stat_name, record_count)
        VALUES (%s, %s)
        ON CONFLICT (stat_name) DO UPDATE 
        SET last_updated = CURRENT_TIMESTAMP, record_count = EXCLUDED.record_count
    """, (table.replace('stats_', ''), total))
    
    print("✓")

conn.commit()
cursor.close()
conn.close()

elapsed = time.time() - start
print(f"\n✅ Complete! Refreshed in {elapsed:.1f}s")
print(f"📊 Based on {total:,} records")
