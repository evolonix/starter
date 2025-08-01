## [Docker](https://www.docker.com/)

Create [apps/web/Dockerfile](../../apps/web/Dockerfile) with the following to be used for development with HMR:

```dockerfile
# syntax = docker/dockerfile:1

# Build with:
# docker build -t web:dev -f apps/web/Dockerfile .
# Run with:
# docker run -it --rm -p 4200:4200 --name starter-web-dev --label com.docker.compose.project=starter web:dev

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=23.6.0
FROM node:${NODE_VERSION}-slim AS base

# Node.js app lives here
WORKDIR /app

# Install node modules
COPY package-lock.json package.json ./
RUN npm install

# Set environment
ENV NODE_ENV="development"

# Copy application code
COPY . .

# Start the server by default, this can be overwritten at runtime
EXPOSE 4200

WORKDIR /app/apps/web
CMD [ "npx", "react-router", "dev", "--host" ]
```

Create [docker-compose.yml](../../docker-compose.yml) with the following to be used for starting the development container with mapped volumes:

```yaml
# Run with:
# docker compose up
# Include --build to rebuild the image if there are changes to the Dockerfile or package.json files
# Optionally, use -d to run the app in detached mode

services:
  web:
    image: web:dev
    container_name: starter-web-dev
    build:
      context: .
      dockerfile: ./apps/web/Dockerfile
    ports:
      - '4200:4200'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true # To fix an issue with HMR on Windows machines
```

Update [apps/web/package.json](../../apps/web/package.json) with the following:

```json
{
  ...
  "nx": {
    "targets": {
      "docker-build": {
        "command": "docker build -t web:dev -f apps/web/Dockerfile ."
      }
    }
  }
}
```
