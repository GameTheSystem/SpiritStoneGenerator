# ------ Set up the base for all build stages ------ #
FROM node:8.11 AS base

ARG env
ENV NODE_ENV $env

# Install deps one directory up so that mounted code won't wipe these out
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY package.json .
COPY package-lock.json .
RUN npm install && npm cache clean --force

# ------ The release stage ------ #
FROM node:8.11-alpine AS release
COPY --from=base /usr/src /usr/src

ARG env
ENV NODE_ENV $env
ENV PATH ${PATH}:/usr/src/node_modules/.bin

ARG port=80
EXPOSE ${port}

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . .

CMD [ "npm", "start" ]