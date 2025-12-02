# Real-Time Sensor Dashboard

A real-time dashboard that streams temperature and humidity readings from sensors using Kafka, Spark, and React.

[Demo](https://drive.google.com/file/d/10sotn4D0T8xfHV6UxCW88erpHJdvhuak/view?usp=sharing) | [Blog](https://medium.com/@merlynmercylona/building-a-live-sensor-monitoring-system-with-kafka-spark-postgresql-fastapi-react-e66a2aa10550)

## Tech Stack

- **Producer:** Python, kafka-python
- **Stream Processing:** Apache Spark, PySpark
- **Message Queue:** Apache Kafka, ZooKeeper
- **Database:** PostgreSQL
- **API:** FastAPI
- **Frontend:** React, TypeScript, Recharts, Tailwind CSS
- **Infra:** Docker, Docker Compose

## API Endpoints

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/latest`           | Get latest sensor reading |
| GET    | `/history?limit=20` | Get last N readings       |

## To-Do

- [ ] Add authentication
- [ ] WebSocket support for real-time updates
- [ ] Deploy to cloud
- [ ] Add more sensor types

## Learnings

This project gave me hands-on experience with Docker, building REST APIs, integrating frontend and backend components, and managing data flow across services. As someone working toward a career in software development, this was a great way to understand how different tools interact in a real-time streaming setup.

Key takeaways:

- Setting up Kafka with ZooKeeper for message streaming
- Writing Spark Streaming jobs to process real-time data
- Connecting Spark to PostgreSQL using JDBC
- Building a FastAPI backend with PostgreSQL
- Creating live-updating charts with React and Recharts
- Orchestrating multiple services with Docker Compose

## Notes

This project was built as part of **CS 649 Big Data Tools & Methods** at San Diego State University.
