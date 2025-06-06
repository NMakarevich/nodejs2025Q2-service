ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/app

COPY package*.json .

RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]