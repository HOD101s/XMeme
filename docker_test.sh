sudo apt-get -y update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

sudo docker build -t xmeme_app .
sudo docker run -d -p 8081:8081 xmeme_app

curl --location --request GET 'http://localhost:8081/memes'


# Execute the POST /memes endpoint using curl

curl --location --request POST 'http://localhost:8081/memes' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "xyz",
"url": "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpe",
"caption": "Dhoni"
}'

# Execute the GET /memes endpoint using curl
curl --location --request GET 'http://localhost:8081/memes'

# If you have swagger enabled, make sure it is exposed at localhost:8081
curl --location --request GET 'http://localhost:8081/swagger-ui/'