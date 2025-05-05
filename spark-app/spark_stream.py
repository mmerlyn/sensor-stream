import os
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import StructType, IntegerType, FloatType, DoubleType
 
# Define schema matching the Kafka messages
schema = StructType() \
    .add("sensor_id", IntegerType()) \
    .add("value", FloatType()) \
    .add("timestamp", DoubleType())
 
# --- Configuration from Environment Variables ---
# Make sure these environment variable names match those in your docker-compose.yml
kafka_brokers = os.getenv("KAFKA_BROKER", "kafka:9092") # Default if not set
db_host = os.getenv("POSTGRES_HOST", "postgres")
db_port = os.getenv("POSTGRES_PORT", "5432") # Default port
db_name = os.getenv("POSTGRES_DB", "sensor")
db_user = os.getenv("POSTGRES_USER", "sensor_user")
db_password = os.getenv("POSTGRES_PASSWORD", "sensor_pass")
kafka_topic = os.getenv("KAFKA_TOPIC", "sensor-data")
 
# Construct JDBC URL
jdbc_url = f"jdbc:postgresql://{db_host}:{db_port}/{db_name}"
 
# --- Create Spark session for Local Mode ---
spark = SparkSession.builder \
    .appName("SensorDataStreaming") \
    .master("local[*]") \
    .getOrCreate()
 
# Set log level to avoid excessive informational messages (optional)
spark.sparkContext.setLogLevel("WARN")
 
print(f"Starting Spark Stream from Kafka: {kafka_brokers}, topic: {kafka_topic}")
print(f"Writing to PostgreSQL: {jdbc_url}, user: {db_user}")
 
 
# Read data from Kafka topic
df_raw = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_brokers) \
    .option("subscribe", kafka_topic) \
    .option("startingOffsets", "earliest") \
    .load()
 
# Convert Kafka value from bytes to string, then JSON
# Handle potential errors during JSON parsing
df_json = df_raw.selectExpr("CAST(value AS STRING)") \
    .select(from_json(col("value"), schema).alias("data")) \
    .filter(col("data").isNotNull()) \
    .select("data.*")
 
# Function to write batch to PostgreSQL
def write_to_postgres(batch_df, batch_id):
    print(f"Writing batch {batch_id} to PostgreSQL...")
    try:
        batch_df.write \
            .format("jdbc") \
            .option("url", jdbc_url) \
            .option("dbtable", "sensor_data") \
            .option("user", db_user) \
            .option("password", db_password) \
            .option("driver", "org.postgresql.Driver") \
            .mode("append") \
            .save()
        print(f"Batch {batch_id} successfully written.")
    except Exception as e:
        print(f"Error writing batch {batch_id} to PostgreSQL: {e}")
 
 
# Write the processed data stream to PostgreSQL
query = df_json.writeStream \
    .foreachBatch(write_to_postgres) \
    .outputMode("append") \
    .start()
 
print("Spark Streaming query started. Waiting for termination...")
query.awaitTermination()
print("Spark Streaming query terminated.")