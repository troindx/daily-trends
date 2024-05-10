FROM node:22

WORKDIR /app

COPY package*.json ./
COPY ./src ./src
COPY ./src/.env ./

RUN npm install
CMD ["npm", "start"]

EXPOSE 3000/tcp
