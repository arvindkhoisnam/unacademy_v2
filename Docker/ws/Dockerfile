FROM node:18-alpine

WORKDIR app

COPY package-lock.json .
COPY package.json .
COPY turbo.json .
COPY packages ./packages
COPY apps/webSocket ./apps/webSocket

RUN npm install esbuild
RUN npm install

EXPOSE 3001

CMD ["npm","run","ws-start"]
