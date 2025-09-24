FROM node:20 as build-env
RUN mkdir /app
COPY package*.json /app/
WORKDIR /app

RUN npm ci --legacy-peer-deps

ENV	NODE_ENV=production 

COPY . /app

# Pass the API base URL from Docker Compose
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:stable-alpine

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /app/dist /usr/share/nginx/html
EXPOSE 3010
CMD ["nginx", "-g", "daemon off;"]
