# syntax=docker/dockerfile:1
FROM node:lts-alpine3.15
WORKDIR /web3
COPY . .
RUN npm install
CMD ["node", "./node_modules/mocha/bin/mocha.js"]
EXPOSE 3000