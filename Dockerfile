FROM node:22

WORKDIR /app
ENV DEFAULT_PORT=${DEFAULT_PORT}

COPY package*.json ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./
COPY ./src ./src
COPY ./src/.env ./

RUN npm install
CMD ["npm", "start"]

EXPOSE ${DEFAULT_PORT}/tcp
