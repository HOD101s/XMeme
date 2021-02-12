cd backend/
sudo gunicorn app:app -b :8080 -b :8081 &