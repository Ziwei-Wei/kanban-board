FROM node:alpine

# Create app directory
WORKDIR /app

# Install Application
COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]
