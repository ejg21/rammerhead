# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies (this step can be cached)
COPY package*.json ./

# Install dependencies (including production dependencies)
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Build the application (only if you need to build it, otherwise skip this step)
RUN npm run build

# Expose the port the app will run on
EXPOSE 8080

# Start the application
CMD ["node", "src/server.js"]
