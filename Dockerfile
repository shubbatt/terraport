# Build the frontend Vite React app
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Setup the backend Express server
FROM node:22-alpine
WORKDIR /app

# Install native C++ tools so SQLite can perfectly compile against THIS container's operating system
RUN apk add --no-cache python3 make g++ sqlite-dev

# Copy server dependencies
COPY server/package*.json ./server/
# Build sqlite3 from raw source code so it exactly matches the Docker runtime
RUN cd server && npm install --production --build-from-source

# Copy backend source code
COPY server/ ./server/
COPY --from=frontend /app/dist ./dist

# Ensure the uploads directory exists
RUN mkdir -p ./server/uploads
RUN chmod -R 777 ./server/uploads

EXPOSE 3001
WORKDIR /app/server
CMD ["node", "index.js"]
