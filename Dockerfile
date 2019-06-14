FROM node:alpine
ENV DB_HOST host.docker.internal
COPY dist /
COPY package.json package.json
RUN npm install --production
CMD node bundle.js
