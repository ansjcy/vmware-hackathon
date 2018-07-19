FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
ADD ./public /var/www/frontend/public
ADD ./frontend.conf /etc/nginx/conf.d/
