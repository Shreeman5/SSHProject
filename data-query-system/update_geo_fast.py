import psycopg2
import json
import time

DB_CONFIG = {
    'host': 'localhost',
    'database': 'my_data_db',
    'user': 'myuser',
    'password': 'mypassword123',
    'port': 5432
}

def safe_float(value):
    """Safely convert to float"""
    try:
        return float(value) if value else None
    except:
        return None

print("🚀 Fast Geolocation Update\n")

# Load JSON
print("Loading ipinfo.json...")
start = time.time()
with open('ipinfo.json', 'r') as f:
    geo_data = json.load(f)
print(f"✓ Loaded {len(geo_data):,} IPs in {time.time()-start:.1f}s\n")

# Connect to database
conn = psycopg2.connect(**DB_CONFIG)
cursor = conn.cursor()

# Create temporary table for geo data
print("Creating temporary table...")
cursor.execute("""
    CREATE TEMP TABLE temp_geo (
        ip_address VARCHAR(45) PRIMARY KEY,
        country VARCHAR(100),
        country_code VARCHAR(10),
        continent VARCHAR(50),
        latitude DECIMAL(10, 7),
        longitude DECIMAL(10, 7),
        asn_number VARCHAR(50),
        asn_name VARCHAR(255),
        asn_domain VARCHAR(255),
        asn_type VARCHAR(50)
    );
""")
print("✓ Temp table created\n")

# Bulk insert into temp table
print("Inserting geolocation data into temp table...")
batch = []
batch_size = 5000

for i, (ip, data) in enumerate(geo_data.items()):
    if i % 10000 == 0 and i > 0:
        print(f"  Prepared {i:,}/{len(geo_data):,}...", end="\r")
    
    asn_data = data.get('asn', {})
    
    batch.append((
        ip,
        data.get('cn'),
        data.get('cc'),
        data.get('cntn'),
        safe_float(data.get('lat')),
        safe_float(data.get('lng')),
        asn_data.get('asn'),
        asn_data.get('name'),
        asn_data.get('domain'),
        asn_data.get('type')
    ))
    
    if len(batch) >= batch_size:
        cursor.executemany("""
            INSERT INTO temp_geo VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (ip_address) DO NOTHING
        """, batch)
        batch = []

# Insert remaining
if batch:
    cursor.executemany("""
        INSERT INTO temp_geo VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (ip_address) DO NOTHING
    """, batch)

conn.commit()
print(f"\n✓ Temp table populated\n")

# Update main table with JOIN (this is FAST!)
print("Updating user_data with geolocation (this may take 5-10 minutes)...")
start = time.time()

cursor.execute("""
    UPDATE user_data u
    SET 
        country = t.country,
        country_code = t.country_code,
        continent = t.continent,
        latitude = t.latitude,
        longitude = t.longitude,
        asn_number = t.asn_number,
        asn_name = t.asn_name,
        asn_domain = t.asn_domain,
        asn_type = t.asn_type
    FROM temp_geo t
    WHERE u.ip_address = t.ip_address
""")

updated = cursor.rowcount
conn.commit()

elapsed = time.time() - start
print(f"✓ Updated {updated:,} records in {elapsed/60:.1f} minutes\n")

# Show stats
cursor.execute("SELECT COUNT(*) FROM user_data WHERE country IS NOT NULL")
with_country = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM user_data")
total = cursor.fetchone()[0]

print("📊 Final Statistics:")
print(f"  Total records: {total:,}")
print(f"  With geolocation: {with_country:,} ({with_country/total*100:.1f}%)")

cursor.close()
conn.close()

print("\n✅ Geolocation update complete!")
