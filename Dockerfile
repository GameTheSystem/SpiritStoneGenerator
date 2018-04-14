# ------ Set up the base for all build stages ------ #
FROM node:8.11 AS base

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /usr/src/app

# Install deps one directory up so that mounted code won't wipe these out
WORKDIR /usr/src
COPY package.json .
COPY package-lock.json .
RUN npm install && npm cache clean --force
ENV PATH ${PATH}:/usr/src/node_modules/.bin
WORKDIR /usr/src/app

# ------ The release stage ------ #
FROM base AS release

COPY . .
CMD [ "npm", "start" ]