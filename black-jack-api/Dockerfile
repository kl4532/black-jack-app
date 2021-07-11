
FROM node:15
# App directory
WORKDIR /app

# App dependencies
COPY package*.json ./
RUN npm i

# Copy app source code
COPY . .

# Env setup
COPY .env .env

#Expose port and begin application
EXPOSE 3000

# PROD
#RUN npm ci --only=production
#CMD [ "npm", "run", "start:prod"]

# DEV
CMD [ "npm", "run", "start:dev"]

