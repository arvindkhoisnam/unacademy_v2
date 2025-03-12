FROM node:18-alpine

RUN apk update && apk upgrade
RUN apk add --no-cache openssl

WORKDIR app

COPY package-lock.json .
COPY package.json .
COPY turbo.json .
COPY packages ./packages
COPY apps/http ./apps/http

RUN npm install esbuild
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "http-start"]

