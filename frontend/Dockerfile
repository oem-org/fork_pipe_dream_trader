# Dont use alpine as it needs special optinal packages installed in react
FROM node:20-bookworm

WORKDIR /app

# Clean up any old node_modules and package-lock.json

# Copy package.json and package-lock.json before running npm install
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . /app

EXPOSE 3000

ENTRYPOINT ["sh", "entrypoint.sh"]

