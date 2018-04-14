# ------ Set up the base for all build stages ------ #
FROM node:8.11.1 AS release
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
# Install deps on directory up so that mounted code won't wipe these out
# WORKDIR /usr/src
COPY package.json .
COPY package-lock.json .
RUN npm install && npm cache clean --force
# WORKDIR /usr/src/app

COPY . .
CMD [ "npm", "start" ]

# FROM release AS live-code
# VOLUME /usr/src/app
# RUN rm -rf node_modules
# RUN npm i --only=development