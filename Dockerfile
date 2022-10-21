FROM node:lts-alpine

WORKDIR /ava-react-frontend

RUN apk add --no-cache python3
RUN ln -s /usr/bin/python3 /usr/bin/python

COPY package*.json ./
RUN yarn install 
COPY . /ava-react-frontend

CMD [ "sleep", "infinity"]