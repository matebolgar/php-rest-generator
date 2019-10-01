FROM nginx:1.15.8-alpine

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
ADD nginx.conf /etc/nginx/nginx.conf
ADD . .
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
