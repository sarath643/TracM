# Fetching the latest node image on alpine linux
FROM node:alpine AS development

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /react-app


# Copying all the files in our project
COPY . .

RUN npm install
EXPOSE 3000
EXPOSE 3001

# Starting our application
CMD ["npm","run","dev"]