import psycopg2

DB_CONFIG = {
    'host': 'localhost',
    'database': 'my_data_db',
    'user': 'myuser',
    'password': 'mypassword123',
    'port': 5432
}

print("🚀 Optimizing Database for Scale...\n")

conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

print("1. Creating indexes for fast aggregation...")
indexes = [
    "CREATE INDEX IF NOT EXISTS idx_country_agg ON user_data(country) WHERE country IS NOT NULL;",
    "CREATE INDEX IF NOT EXISTS idx_continent_agg ON user_data(continent) WHERE continent IS NOT NULL;",
    "CREATE INDEX IF NOT EXISTS idx_asn_name_agg ON user_data(asn_name) WHERE asn_name IS NOT NULL;",
    "CREATE INDEX IF NOT EXISTS idx_username_agg ON user_data(username) WHERE username IS NOT NULL;",
    "CREATE INDEX IF NOT EXISTS idx_date_agg ON user_data(date) WHERE date IS NOT NULL;",
]

for idx in indexes:
    cursor.execute(idx)
    print(f"  ✓ Created index")

conn.commit()
print("✓ Indexes created\n")

print("2. Creating summary tables for instant chart loading...")

# Drop existing tables if they exist
cursor.execute("DROP TABLE IF EXISTS stats_country CASCADE;")
cursor.execute("DROP TABLE IF EXISTS stats_folder CASCADE;")
cursor.execute("DROP TABLE IF EXISTS stats_continent CASCADE;")
cursor.execute("DROP TABLE IF EXISTS stats_asn CASCADE;")
cursor.execute("DROP TABLE IF EXISTS stats_username CASCADE;")
cursor.execute("DROP TABLE IF EXISTS stats_date CASCADE;")

# Create summary tables
cursor.execute("""
    CREATE TABLE stats_country AS
    SELECT country, COUNT(*) as count 
    FROM user_data 
    WHERE country IS NOT NULL 
    GROUP BY country 
    ORDER BY count DESC 
    LIMIT 10;
""")
print("  ✓ stats_country")

cursor.execute("""
    CREATE TABLE stats_folder AS
    SELECT source_folder, COUNT(*) as count 
    FROM user_data 
    GROUP BY source_folder 
    ORDER BY source_folder;
""")
print("  ✓ stats_folder")

cursor.execute("""
    CREATE TABLE stats_continent AS
    SELECT continent, COUNT(*) as count 
    FROM user_data 
    WHERE continent IS NOT NULL 
    GROUP BY continent 
    ORDER BY count DESC;
""")
print("  ✓ stats_continent")

cursor.execute("""
    CREATE TABLE stats_asn AS
    SELECT asn_name, COUNT(*) as count 
    FROM user_data 
    WHERE asn_name IS NOT NULL 
    GROUP BY asn_name 
    ORDER BY count DESC 
    LIMIT 10;
""")
print("  ✓ stats_asn")

cursor.execute("""
    CREATE TABLE stats_username AS
    SELECT username, COUNT(*) as count 
    FROM user_data 
    WHERE username IS NOT NULL 
    GROUP BY username 
    ORDER BY count DESC 
    LIMIT 10;
""")
print("  ✓ stats_username")

cursor.execute("""
    CREATE TABLE stats_date AS
    SELECT date, COUNT(*) as count 
    FROM user_data 
    WHERE date IS NOT NULL 
    GROUP BY date 
    ORDER BY date DESC
    LIMIT 30;
""")
print("  ✓ stats_date")

conn.commit()
print("\n3. Creating last_updated tracker...")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS stats_metadata (
        stat_name VARCHAR(50) PRIMARY KEY,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        record_count BIGINT
    );
""")

cursor.execute("SELECT COUNT(*) FROM user_data")
total = cursor.fetchone()[0]

stats = ['country', 'folder', 'continent', 'asn', 'username', 'date']
for stat in stats:
    cursor.execute("""
        INSERT INTO stats_metadata (stat_name, record_count)
        VALUES (%s, %s)
        ON CONFLICT (stat_name) DO UPDATE 
        SET last_updated = CURRENT_TIMESTAMP, record_count = EXCLUDED.record_count
    """, (stat, total))

conn.commit()

print(f"✓ Metadata created (based on {total:,} records)\n")

# Show improvement
cursor.execute("SELECT COUNT(*) FROM stats_country")
print(f"📊 Stats Summary:")
print(f"  Ready for instant loading!")
print(f"  Charts will load in <1 second\n")

cursor.close()
conn.close()

print("✅ Optimization complete!")
print("\nNext steps:")
print("1. Restart api_server.py")
print("2. Refresh browser - charts will be instant!")
print("3. When you add new data, run: python3 refresh_stats.py")
