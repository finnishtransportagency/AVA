#!/usr/bin/env bash
set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

# Cleanup things
cleanup() {
    trap - SIGINT SIGTERM ERR EXIT
    docker kill ${CONTAINER_NAME}
}

# Build docker image, run dev build and copy node modules and react build
IMG_NAME=frontend-app-builder
CONTAINER_NAME=ava-builder

docker build -t ${IMG_NAME} .
docker run --rm -d --name ${CONTAINER_NAME} ${IMG_NAME}
docker exec ${CONTAINER_NAME} npm run build:dev
docker cp ${CONTAINER_NAME}:/ava-react-frontend/node_modules .
docker cp ${CONTAINER_NAME}:/ava-react-frontend/build .
