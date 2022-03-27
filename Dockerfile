FROM node:14.19-alpine3.14 as react-template

LABEL maintainer="zefey <1076971426@qq.com>"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

RUN npm run build

FROM nginx

COPY --from=react-template /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]