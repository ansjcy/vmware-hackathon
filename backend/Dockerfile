ARG NODE_TAG=10-alpine
FROM node:${NODE_TAG}

ARG GIT_SHA
ARG VERSION
ENV GIT_SHA=${GIT_SHA}
ENV VERSION=${VERSION}

LABEL MAINTAINER="Hao Song <mail@shawnsong.com>"
LABEL NAME="Front-End"
LABEL VERSION="${VERSION}"

RUN printf "GIT_SHA=${GIT_SHA}\nVERSION=${VERSION}\n" > build.properties

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --quiet

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
