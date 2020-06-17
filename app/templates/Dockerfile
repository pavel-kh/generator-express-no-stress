FROM node:12-alpine
LABEL Author Pavel Kharakh

RUN mkdir -p /var/app
WORKDIR /var/app

COPY . /var/app
RUN npm install

RUN npm run compile

EXPOSE 3000

CMD [ "npm", "start" ]
