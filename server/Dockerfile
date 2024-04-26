# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the server dependencies
RUN npm install

# Copy the rest of the server code to the working directory
COPY . .

# Expose the port on which your server listens (adjust if necessary)
EXPOSE 5001

# Specify the command to run your server
CMD ["npm", "start"]