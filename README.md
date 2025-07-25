
# 🟢 Real-Time Sensor Dashboard with Kafka, Spark, PostgreSQL, FastAPI & React

This project is a real-time dashboard that streams **temperature** and **humidity** readings every 5 seconds. It showcases an end-to-end streaming data pipeline using:

> Displays sensor readings every 5 seconds on a live-updating UI.

▶️ [Watch Demo](https://drive.google.com/file/d/10sotn4D0T8xfHV6UxCW88erpHJdvhuak/view?usp=sharing) 

📝 [Read the full blog on Medium](https://medium.com/@merlynmercylona/building-a-live-sensor-monitoring-system-with-kafka-spark-postgresql-fastapi-react-e66a2aa10550)

## Tech Stack
![image](https://github.com/user-attachments/assets/4565c405-bdc6-4d29-9fb5-c46b84900389)

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

- Add authentication layer to API
- Allow querying history by timestamp
- Deploy to cloud

## 📚 Learnings

This project was more than just getting things to work—it gave me a chance to explore and connect several technologies in a practical, end-to-end system. I learned how different tools interact and support each other in a real-time setup. As someone working toward a career in software development, it gave me valuable hands-on experience with Docker, building REST APIs, integrating frontend and backend components, and managing data flow across services.

## Author

**Merlyn Mercylona**