# Build the frontend Vite React app
FROM node:18 AS frontend
WORKDIR /app

# Copy root package.json for frontend
COPY package*.json ./
RUN npm install

# Copy all files for building frontend
COPY . .
RUN npm run build

# Setup the backend Express server
FROM node:18
WORKDIR /app

# Copy server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy backend source code
COPY server/ ./server/

# Copy the built frontend pages from the previous stage
COPY --from=frontend /app/dist ./dist

# Ensure the uploads directory exists
RUN mkdir -p ./server/uploads
RUN chmod -R 777 ./server/uploads

# Expose backend port
EXPOSE 3001

# Start the application
WORKDIR /app/server
CMD ["node", "index.js"]
