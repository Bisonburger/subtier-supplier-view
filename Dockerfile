FROM node:carbon
WORKDIR /usr/src/ssv
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]