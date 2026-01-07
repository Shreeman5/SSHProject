import psycopg2
import pandas as pd
import json
import os
from pathlib import Path

class DataImporter:
    def __init__(self, db_config):
        """Initialize database connection"""
        self.conn = psycopg2.connect(**db_config)
        self.cursor = self.conn.cursor()
    
    def create_tables(self):
        """Create database tables"""
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_data (
                id SERIAL PRIMARY KEY,
                ip_address VARCHAR(45) NOT NULL,
                date VARCHAR(20),
                time VARCHAR(20),
                node VARCHAR(255),
                port INTEGER,
                pid VARCHAR(50),
                username VARCHAR(255),
                tag VARCHAR(255),
                message TEXT,
                country VARCHAR(100),
                country_code VARCHAR(10),
                continent VARCHAR(50),
                latitude DECIMAL(10, 7),
                longitude DECIMAL(10, 7),
                asn_number VARCHAR(50),
                asn_name VARCHAR(255),
                asn_domain VARCHAR(255),
                asn_type VARCHAR(50),
                import_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                source_file VARCHAR(255),
                source_folder VARCHAR(100)
            );
        """)
        
        self.cursor.execute("CREATE INDEX IF NOT EXISTS idx_ip_address ON user_data(ip_address);")
        self.cursor.execute("CREATE INDEX IF NOT EXISTS idx_username ON user_data(username);")
        self.cursor.execute("CREATE INDEX IF NOT EXISTS idx_country ON user_data(country);")
        self.cursor.execute("CREATE INDEX IF NOT EXISTS idx_date ON user_data(date);")
        self.cursor.execute("CREATE INDEX IF NOT EXISTS idx_source_folder ON user_data(source_folder);")
        
        self.conn.commit()
        print("✓ Tables created successfully")
    
    def import_csv_files(self, csv_directory):
        """Import all CSV files from directory and subdirectories"""
        csv_files = list(Path(csv_directory).rglob('*.csv'))
        
        if not csv_files:
            print(f"⚠ No CSV files found in {csv_directory}")
            return
        
        print(f"Found {len(csv_files)} CSV file(s)")
        
        by_folder = {}
        for csv_file in csv_files:
            folder_name = csv_file.parent.name
            if folder_name not in by_folder:
                by_folder[folder_name] = []
            by_folder[folder_name].append(csv_file)
        
        print(f"Folders: {', '.join(by_folder.keys())}")
        
        total_imported = 0
        
        for folder_name, files in by_folder.items():
            print(f"\n📁 {folder_name}: {len(files)} files")
            
            for csv_file in files:
                try:
                    print(f"  {csv_file.name}...", end=" ")
                    df = pd.read_csv(csv_file)
                    
                    column_mapping = {
                        'IP': 'ip_address',
                        'Date': 'date',
                        'Time': 'time',
                        'Node': 'node',
                        'Port': 'port',
                        'PID': 'pid',
                        'Username': 'username',
                        'Tag': 'tag',
                        'Message': 'message'
                    }
                    
                    df.rename(columns=column_mapping, inplace=True)
                    
                    batch_size = 1000
                    records_imported = 0
                    
                    for i in range(0, len(df), batch_size):
                        batch = df.iloc[i:i+batch_size]
                        
                        for _, row in batch.iterrows():
                            ip = row.get('ip_address')
                            if pd.notna(ip):
                                self.cursor.execute("""
                                    INSERT INTO user_data 
                                    (ip_address, date, time, node, port, pid, username, tag, message, source_file, source_folder)
                                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                """, (
                                    str(ip),
                                    str(row.get('date')) if pd.notna(row.get('date')) else None,
                                    str(row.get('time')) if pd.notna(row.get('time')) else None,
                                    str(row.get('node')) if pd.notna(row.get('node')) else None,
                                    int(row.get('port')) if pd.notna(row.get('port')) else None,
                                    str(row.get('pid')) if pd.notna(row.get('pid')) else None,
                                    str(row.get('username')) if pd.notna(row.get('username')) else None,
                                    str(row.get('tag')) if pd.notna(row.get('tag')) else None,
                                    str(row.get('message')) if pd.notna(row.get('message')) else None,
                                    csv_file.name,
                                    folder_name
                                ))
                                records_imported += 1
                        
                        self.conn.commit()
                    
                    total_imported += records_imported
                    print(f"✓ {records_imported:,}")
                    
                except Exception as e:
                    print(f"✗ {str(e)}")
                    self.conn.rollback()
        
        print(f"\n✅ Total: {total_imported:,} records from {len(csv_files)} files")
    
    def import_json_and_update_countries(self, json_file_path):
        """Import JSON with geolocation data"""
        try:
            file_size_mb = os.path.getsize(json_file_path) / 1024 / 1024
            print(f"Loading JSON ({file_size_mb:.1f} MB)...", end=" ")
            
            with open(json_file_path, 'r') as f:
                data = json.load(f)
            
            print(f"✓ {len(data):,} IPs loaded")
            print("Updating geolocation...")
            
            updated = 0
            batch_size = 100
            
            for i, (ip, geo_data) in enumerate(data.items()):
                if i % batch_size == 0 and i > 0:
                    self.conn.commit()
                    print(f"  {i:,}/{len(data):,} ({i/len(data)*100:.1f}%)...", end="\r")
                
                try:
                    country = geo_data.get('cn')
                    country_code = geo_data.get('cc')
                    continent = geo_data.get('cntn')
                    latitude = geo_data.get('lat')
                    longitude = geo_data.get('lng')
                    
                    asn_data = geo_data.get('asn', {})
                    asn_number = asn_data.get('asn')
                    asn_name = asn_data.get('name')
                    asn_domain = asn_data.get('domain')
                    asn_type = asn_data.get('type')
                    
                    self.cursor.execute("""
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
                        country, country_code, continent,
                        float(latitude) if latitude else None,
                        float(longitude) if longitude else None,
                        asn_number, asn_name, asn_domain, asn_type,
                        ip
                    ))
                    
                    updated += self.cursor.rowcount
                    
                except:
                    continue
            
            self.conn.commit()
            print(f"\n✓ Updated {updated:,} records with geolocation")
            
        except Exception as e:
            print(f"\n✗ Error: {str(e)}")
            self.conn.rollback()
    
    def get_stats(self):
        """Display statistics"""
        self.cursor.execute("SELECT COUNT(*) FROM user_data")
        total = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT COUNT(DISTINCT ip_address) FROM user_data")
        unique_ips = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT COUNT(DISTINCT username) FROM user_data WHERE username IS NOT NULL")
        unique_users = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT COUNT(*) FROM user_data WHERE country IS NOT NULL")
        with_geo = self.cursor.fetchone()[0]
        
        self.cursor.execute("""
            SELECT source_folder, COUNT(*) as count 
            FROM user_data 
            GROUP BY source_folder 
            ORDER BY source_folder
        """)
        by_folder = self.cursor.fetchall()
        
        print(f"\n📊 Statistics:")
        print(f"  Total records: {total:,}")
        print(f"  Unique IPs: {unique_ips:,}")
        print(f"  Unique users: {unique_users:,}")
        print(f"  With geolocation: {with_geo:,} ({with_geo/total*100 if total > 0 else 0:.1f}%)")
        print(f"\n  By folder:")
        for folder, count in by_folder:
            print(f"    {folder}: {count:,}")
    
    def close(self):
        """Close connection"""
        self.cursor.close()
        self.conn.close()


if __name__ == "__main__":
    DB_CONFIG = {
        'host': 'localhost',
        'database': 'my_data_db',
        'user': 'myuser',
        'password': 'mypassword123',
        'port': 5432
    }
    
    CSV_DIRECTORY = './csv_files'
    JSON_FILE = './ip_country_mapping.json'
    
    print("🚀 Starting import...\n")
    
    importer = DataImporter(DB_CONFIG)
    importer.create_tables()
    
    print("\n📁 Importing CSVs...")
    importer.import_csv_files(CSV_DIRECTORY)
    
    print("\n🌍 Importing geolocation...")
    if os.path.exists(JSON_FILE):
        importer.import_json_and_update_countries(JSON_FILE)
    else:
        print(f"⚠ JSON file not found: {JSON_FILE}")
    
    importer.get_stats()
    importer.close()
    
    print("\n✅ Import complete!")
