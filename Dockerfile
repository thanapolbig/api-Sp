

FROM node:10-alpine
# FROM node:8.12-alpine
RUN apk add g++ make python
# Create app directory in docker
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json are copied
# where available
COPY package.json /usr/src/app

RUN npm install
RUN npm rebuild
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /usr/src/app
EXPOSE 7777

CMD ["npm","run", "proOrg1"]
# EXPOSE 7777
# CMD ["npm","run", "start1"]

#1#sudo docker build -t chaiwatsumrit/sample-api-server:v1.0 .
#docker run -p 7777:7777 chaiwatsumrit/sample-api-server:v1.0 --network basic

# docker login docker.io
# username :chaiwatsumrit
# docker push chaiwatsumrit/sample-api-server:v1.0

# docker run \
#   --name sample-api-server \
#   -v "$(pwd)":/app \
#   -w /app \
#   chaiwatsumrit/sample-api-server:v1.0 \
#   npm run proOrg1
  