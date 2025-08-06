FROM node:22.11

WORKDIR /app

COPY . .

RUN npm install && npm run build

# Serve app with a lightweight server
RUN npm install -g serve

EXPOSE 4173
CMD ["serve", "-s", "dist"]
