sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 656408E390CFB1F5
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get -y update
sudo apt-get install -y mongodb-org
sudo systemctl enable mongod.service
sudo systemctl start mongod.service
sudo apt install -y python3-pip
pip3 install -r ./backend/requirements.txt


export MONGO_XMEME_CONNECT_URI="mongodb://localhost:27017/"