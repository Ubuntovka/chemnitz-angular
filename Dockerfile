FROM node:23 AS build
WORKDIR /chemnitz-angular

COPY . .

RUN npm install


RUN npm run build --configuration=production

FROM nginx:alpine

COPY --from=build /chemnitz-angular/dist/chemnitz-angular /usr/share/nginx/html

EXPOSE 80


