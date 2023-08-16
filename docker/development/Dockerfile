FROM node:16.15.1-alpine
USER root

RUN mkdir -p /home/app
WORKDIR /home/app
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]
