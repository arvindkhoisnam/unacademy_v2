FROM node:18-alpine

RUN apk update && apk upgrade
RUN apk add --no-cache openssl
RUN apk add --no-cache \
    graphicsmagick \
    ghostscript

WORKDIR app

COPY package-lock.json .
COPY package.json .
COPY turbo.json .
COPY packages ./packages
COPY apps/worker_1 ./apps/worker_1

RUN npm install esbuild
RUN npm install

CMD ["npm","run","w_1-start"]