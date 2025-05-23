FROM node:10-alpine AS builder

WORKDIR /opt/web
COPY package.json ./

RUN npm install
RUN npm audit fix

ARG REACT_APP_SERVER_URL=https://api.codeseer.net
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
ENV PATH="./node_modules/.bin:$PATH"

EXPOSE 80

COPY . ./
RUN echo "REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL" > .env

RUN npm run build

FROM nginx:1.17-alpine
RUN apk --no-cache add curl
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
    chmod +x envsubst && \
    mv envsubst /usr/local/bin
COPY ./nginx.config /etc/nginx/nginx.template
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
COPY --from=builder /opt/web/build /usr/share/nginx/html