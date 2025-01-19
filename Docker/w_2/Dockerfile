FROM node:18-alpine

RUN apk update && apk upgrade
RUN apk add --no-cache openssl

WORKDIR app

COPY package-lock.json .
COPY package.json .
COPY turbo.json .
COPY packages ./packages
COPY apps/worker_2 ./apps/worker_2

RUN npm install esbuild
RUN npm install

CMD ["npm","run","w_2-start"]