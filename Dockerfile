FROM node:16

WORKDIR /app

COPY . /app/

COPY package*.json /app/

RUN npm install

RUN npm run build

EXPOSE 8080

CMD ["node", "src/server.js"]
