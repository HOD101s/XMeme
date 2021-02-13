FROM ubuntu:18.04

# Install MongoDB.
RUN \
    apt-get -y update && \
    apt-get install -y gnupg2 ca-certificates sudo && \
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 656408E390CFB1F5 && \
    echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb.list && \
    apt-get update && \
    apt-get install -y mongodb-org && \
    rm -rf /var/lib/apt/lists/*
VOLUME ["/data/db"]
# expose mongo port
EXPOSE 27017

# Install pip3
RUN sudo apt-get update
RUN apt-get install -y python3-pip
# copy backend to container
COPY backend/. /app
# set working directory to app
WORKDIR /app
# install python environment
RUN pip3 install -r requirements.txt
# expose ports
EXPOSE 8080
EXPOSE 8081
# set env
ENV MONGO_XMEME_CONNECT_URI=mongodb://localhost:27017/
# mod rights to run shell script
RUN chmod +x dockerStart.sh
CMD ./dockerStart.sh