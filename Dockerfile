FROM node:10-alpine
 # For some extra dependencies...
RUN apk add --no-cache dumb-init git bash

COPY . /deploy
ENV NODE_PATH=/deploy/node_modules
ENV PATH=$PATH:/deploy/node_modules/.bin

ARG WIRE_CONFIGURATION_REPOSITORY
ARG WIRE_CONFIGURATION_REPOSITORY_VERSION
ARG WIRE_CONFIGURATION_EXTERNAL_DIR

WORKDIR /deploy
RUN yarn && yarn build
EXPOSE 8080
ENTRYPOINT ["dumb-init", "--", "/bin/bash", "/deploy/run.sh"]
