from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
import time
import json
import random

retries = 10
for i in range(retries):
    try:
        producer = KafkaProducer(
            bootstrap_servers='kafka:9092',
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        print("✅ Kafka producer connected successfully.")
        break
    except NoBrokersAvailable:
        print(f"❌ Kafka broker not available, retrying in 5s... ({i + 1}/{retries})")
        time.sleep(5)
else:
    raise Exception("Kafka broker not available after several retries.")

topic = 'sensor-data'

while True:
    data = {
        'sensor_id': random.randint(1, 10),
        'value': random.uniform(20.0, 30.0),
        'timestamp': time.time()
    }
    producer.send(topic, data)
    print(f"Sent: {data}")
    time.sleep(1)
