from app.core.database import engine 
from sqlalchemy import text 
 
try: 
    with engine.connect() as conn: 
        conn.execute(text("ALTER TABLE family_members DROP COLUMN IF EXISTS relationship")) 
        conn.commit() 
        print("Column 'relationship' dropped successfully") 
except Exception as e: 
    print(f"Error: {e}") 
