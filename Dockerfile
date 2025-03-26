# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the project
RUN npm run build

# Expose the required port
EXPOSE 8080

# Start Rammerhead
CMD ["node", "src/server.js"]
