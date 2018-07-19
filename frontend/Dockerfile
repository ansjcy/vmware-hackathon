ARG NGINX_TAG=1-alpine
FROM nginx:${NGINX_TAG}

ARG GIT_SHA
ARG VERSION
ENV GIT_SHA=${GIT_SHA}
ENV VERSION=${VERSION}

LABEL MAINTAINER="Hao Song <mail@shawnsong.com>"
LABEL NAME="Front-End"
LABEL VERSION="${VERSION}"

RUN printf "GIT_SHA=${GIT_SHA}\nVERSION=${VERSION}\n" > build.properties

RUN rm /etc/nginx/conf.d/default.conf

ADD ./public /var/www/frontend/public
ADD ./nginx.conf /etc/nginx/conf.d/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
