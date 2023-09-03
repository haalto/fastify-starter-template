FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

FROM base as development
ENV NODE_ENV=development

CMD [ "npm", "start" ]

FROM base as production
ENV NODE_ENV=production
RUN npm run build

EXPOSE 80
CMD [ "node", "build/src/server.js" ]