FROM node:22

WORKDIR /app
ENV DEFAULT_PORT=${DEFAULT_PORT}

COPY package*.json ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./
COPY ./src ./src
COPY .env.dist ./
COPY crawlee.json ./
COPY jest.config* ./
COPY .env.dist /app/.env
RUN npm install
RUN npx playwright install
RUN npx playwright install-deps || true
RUN npm run build

CMD ["npm", "start"]

EXPOSE $DEFAULT_PORT
