FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "index.js"]


#Detailed Documentation:
#1. Used the official Node.js Docker image.
#2. Created app directory.
#3. Included "package.json" and "package-lock.json" for dependency installation.
#4. Ran "npm install" to install the required dependencies.
#5. Bundled app source into the container.
#6. Exposed port 3000 and configured the container to run the app.