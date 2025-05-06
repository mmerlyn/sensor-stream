import os
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
app = FastAPI()
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "postgres"),
        database=os.getenv("POSTGRES_DB", "sensor"),
        user=os.getenv("POSTGRES_USER", "sensor_user"),
        password=os.getenv("POSTGRES_PASSWORD", "sensor_pass")
    )
 
@app.get("/latest")
def get_latest():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT temperature, humidity, timestamp FROM sensor_data ORDER BY timestamp DESC LIMIT 1;")
        row = cur.fetchone()
        return row if row else {"message": "No data available"}
    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()