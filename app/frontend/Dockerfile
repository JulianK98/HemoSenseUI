FROM node:18-bookworm-slim

WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH

COPY package.json /frontend/package.json
RUN npm install
RUN npm install -g @angular/cli@16.1.4

COPY . /frontend

EXPOSE 80

CMD ng serve --host 0.0.0.0 --port 80 --disable-host-check
