sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get -y update
sudo apt-get install -y mongodb-org
sudo systemctl enable mongod
sudo service mongod restart
sudo apt install -y python3-pip
pip3 install Flask
pip3 install Flask-Cors
pip3 install flask-restx
pip3 install gunicorn
pip3 install idna
pip3 install itsdangerous
pip3 install Jinja2
pip3 install jsonschema
pip3 install MarkupSafe
pip3 install pycodestyle
pip3 install PyJWT
pip3 install pymongo
pip3 install pyrsistent
pip3 install pytz
pip3 install requests
pip3 install six
pip3 install toml
pip3 install urllib3
pip3 install Werkzeug
pip3 install wincertstore


export MONGO_XMEME_CONNECT_URI="mongodb://localhost:27017/"