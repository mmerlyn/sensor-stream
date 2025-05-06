
# Real-Time Sensor Dashboard with Kafka, Spark, PostgreSQL, FastAPI & React

This project is a real-time dashboard that streams **temperature** and **humidity** readings every 5 seconds. It showcases an end-to-end streaming data pipeline using:

- **Python** (data producer)
- **Kafka + Zookeeper** (streaming platform)
- **Apache Spark** (stream processing)
- **PostgreSQL** (data storage)
- **FastAPI** (REST API backend)
- **React.js** (frontend dashboard)
- **Docker Compose** (container orchestration)

## Demo

> Displays sensor readings every 5 seconds on a live-updating UI.

[Demo](https://drive.google.com/file/d/10sotn4D0T8xfHV6UxCW88erpHJdvhuak/view?usp=sharing) 

## Features

- Simulated sensor data generation (Python)
- Real-time processing with Spark Structured Streaming
- Writes transformed data to PostgreSQL
- FastAPI serves the latest reading
- React frontend polls data every 5 seconds and updates the UI
- Fully Dockerized with `docker-compose`

## Tech Stack

| Layer      | Tool                  |
|------------|-----------------------|
| Data Gen   | Python + KafkaProducer |
| Stream     | Apache Kafka + Zookeeper |
| Processing | Apache Spark          |
| Storage    | PostgreSQL            |
| Backend    | FastAPI               |
| Frontend   | React + Recharts      |
| Orchestration | Docker Compose     |

## 📁 Project Structure

```bash
.
├── api/                  # FastAPI backend
│   └── main.py
├── producer/             # Kafka Python data producer
│   └── producer.py
├── spark-app/
│   └── spark_stream.py   # Spark streaming script
├── frontend/             # React frontend
│   └── src/
├── jars/                 # PostgreSQL JDBC driver
│   └── postgresql-42.7.4.jar
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint     | Description              |
|--------|--------------|--------------------------|
| GET    | `/latest`    | Returns latest sensor data |

Example response:

```json
{
  "temperature": 24.75,
  "humidity": 62.3,
  "timestamp": 1714898232.0
}
```

## To-Do / Enhancements

- [ ] Add authentication layer to API
- [ ] Allow querying history by timestamp
- [ ] Deploy to cloud

## 📚 Learnings

This project helped me build a full streaming data pipeline using modern data tools. It can be used as a template for any real-time dashboard involving time-series data.

## Author

**Merlyn Mercy**  
GitHub: [@mmerlyn](https://github.com/mmerlyn)
