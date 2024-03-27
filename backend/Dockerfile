FROM node:20.11.1-alpine

WORKDIR /home/node/app

COPY package*.json .

RUN npm install


COPY . .

CMD ["npm", "start"]