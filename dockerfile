FROM node:14-alpine AS build
WORKDIR /usr/src/app
COPY . .
RUN apk update && apk upgrade
RUN apk add --update --no-cache nodejs npm python gcc g++ make
RUN npm install -g @angular/cli && npm install && npm run build-prod

FROM nginxinc/nginx-unprivileged
COPY --from=build /usr/src/app/dist/sa /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]