FROM mongo
COPY ./mongo.config.js /docker-entrypoint-initdb.d/
EXPOSE 27017
CMD ["mongod", "--auth"]
