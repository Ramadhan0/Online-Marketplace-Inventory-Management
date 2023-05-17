FROM node:18.4.0-alpine
WORKDIR /usr/src/marketplace
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
