FROM python:3.11-slim

WORKDIR /app
COPY . /app

RUN pip install fastapi uvicorn psycopg2-binary python-dotenv

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
