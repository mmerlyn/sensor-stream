from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
import os

load_dotenv()  # Load .env variables

app = FastAPI()

DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "sensor")
DB_USER = os.getenv("POSTGRES_USER", "sensor_user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "sensor_pass")

class SensorData(BaseModel):
    sensor_id: int
    value: float
    timestamp: float

def get_db_connection():
    try:
        return psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            cursor_factory=RealDictCursor
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB connection error: {e}")

@app.get("/data", response_model=List[SensorData])
def get_data_from_timestamp(after: float):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT sensor_id, value, timestamp FROM sensor_data WHERE timestamp >= %s ORDER BY timestamp ASC",
            (after,)
        )
        return cur.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
