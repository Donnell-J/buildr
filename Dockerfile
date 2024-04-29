FROM node:latest

EXPOSE 19006
USER root
WORKDIR tmp
COPY . /tmp
ENV HOME /app
ENTRYPOINT npx expo start -w