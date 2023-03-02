# Build react frontend first
FROM node:lts-alpine3.16 as react-step
WORKDIR /code
ENV PATH /code/node_modules/.bin:$PATH
COPY package.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN npm run build

# Build nginx http proxy container
FROM nginx:alpine
EXPOSE 80
EXPOSE 443
VOLUME "/etc/nginx/conf.d"
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=react-step /code/build ./
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]