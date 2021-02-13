sudo apt-get update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker

docker build -t xmeme_app .
docker run -d -p 8081:8081 xmeme_app