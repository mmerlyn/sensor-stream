# SensorStream

A real-time data pipeline that streams sensor readings through Kafka and Spark to a live React dashboard. I built this to gain hands-on experience with **distributed streaming systems**, **big data processing**, and **end-to-end data engineering**.

[Demo](https://drive.google.com/file/d/10sotn4D0T8xfHV6UxCW88erpHJdvhuak/view?usp=sharing) | [Blog](https://medium.com/@merlynmercylona/building-a-live-sensor-monitoring-system-with-kafka-spark-postgresql-fastapi-react-e66a2aa10550)

## Why I Built This

I wanted to understand how real-time data systems work in production environments - the kind used for IoT telemetry, financial market data, and application monitoring. Rather than just reading about Kafka and Spark, I built a complete pipeline that ingests, processes, stores, and visualizes streaming data in real time. This forced me to solve real integration challenges: connecting distributed services, handling data serialization, managing stream processing checkpoints, and building responsive UIs that update continuously.

## Skills Demonstrated

| Area                     | Technologies & Concepts                                              |
| ------------------------ | -------------------------------------------------------------------- |
| **Stream Processing**    | Apache Spark Structured Streaming, PySpark, micro-batch processing   |
| **Message Queues**       | Apache Kafka, ZooKeeper, producer/consumer patterns, topic design    |
| **Backend Development**  | Python, FastAPI, REST API design, CORS configuration                 |
| **Database Design**      | PostgreSQL, JDBC integration, indexing strategies, schema design     |
| **Frontend Development** | React 19, TypeScript, Recharts, Tailwind CSS, polling-based updates  |
| **Data Serialization**   | JSON schema validation, Spark StructType definitions                 |
| **Containerization**     | Docker, Docker Compose, multi-service orchestration, networking      |
| **System Integration**   | Service dependencies, environment configuration, cross-service comms |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     React Dashboard (:5173)                         │
│  • Live temperature/humidity charts    • 5-second polling           │
│  • Rolling data window                 • Recharts visualization     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTP GET /latest, /history
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend (:8000)                        │
│  • REST endpoints          • PostgreSQL queries                     │
│  • CORS middleware         • JSON response formatting               │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ SQL queries
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL (:5432)                             │
│  • sensor_data table       • Timestamp DESC index                   │
│  • Persistent storage      • Optimized for latest-first queries    │
└─────────────────────────────┬───────────────────────────────────────┘
                              ↑ JDBC batch writes
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                   Spark Structured Streaming                        │
│  • Kafka consumer          • JSON parsing with schema validation    │
│  • Micro-batch processing  • foreachBatch sink to PostgreSQL        │
│  • Null filtering          • Error handling per batch               │
└─────────────────────────────┬───────────────────────────────────────┘
                              ↑ Consumes from topic
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                    Apache Kafka (:9092)                             │
│  • Topic: sensor-data      • Distributed message queue              │
│  • ZooKeeper coordination  • Decouples producer from consumer       │
└─────────────────────────────┬───────────────────────────────────────┘
                              ↑ Publishes sensor readings
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                      Python Producer                                │
│  • Simulates sensor-001    • 1-second intervals                     │
│  • JSON serialization      • Auto-retry on connection failure       │
└─────────────────────────────────────────────────────────────────────┘
```

## Components Implemented

**Data Producer**

- Simulates environmental sensor generating temperature (20-30°C) and humidity (40-60%)
- Publishes JSON messages to Kafka every second
- Auto-retry logic with exponential backoff for broker connectivity
- Clean shutdown handling

**Stream Processor (Spark)**

- Reads from Kafka with "earliest" offset for full data capture
- Strongly-typed schema validation using Spark StructType
- Filters malformed records before database insertion
- Batch-writes to PostgreSQL via JDBC with error isolation

**REST API (FastAPI)**

- `GET /latest` - Returns most recent sensor reading
- `GET /history?limit=N` - Returns N most recent readings in chronological order
- CORS-enabled for cross-origin frontend requests
- Connection pooling with proper error handling

**Dashboard (React)**

- Live-updating display with current temperature and humidity
- Three interactive Recharts visualizations:
  - Temperature trend line chart
  - Humidity trend line chart
  - Combined dual-axis chart for correlation analysis
- 10-point rolling window to show recent trends
- Loading states and error handling for API failures

## What I Learned

- **Distributed systems design**: Understanding how loosely-coupled services communicate through message queues and why decoupling producers from consumers improves system resilience
- **Data pipeline architecture**: Designing end-to-end data flow from ingestion to storage to presentation, with clear boundaries between processing stages
- **Schema enforcement**: Implementing strongly-typed data contracts at system boundaries to catch malformed data early and prevent downstream failures
- **Database optimization**: Choosing appropriate indexing strategies based on query patterns rather than generic best practices
- **Error handling in distributed systems**: Isolating failures to individual batches so one bad record doesn't halt the entire pipeline
- **API design**: Building RESTful endpoints with proper CORS configuration, connection management, and meaningful error responses
- **Frontend state management**: Separating concerns between data fetching, caching, and UI rendering in reactive applications
- **Container orchestration**: Managing multi-service dependencies, networking, and environment configuration with Docker Compose
- **Debugging across service boundaries**: Tracing data flow through multiple systems to identify where issues originate

## License

MIT
