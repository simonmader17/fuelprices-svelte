FROM node:20.3.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=30012
EXPOSE 30012
CMD ["node", "build"]
