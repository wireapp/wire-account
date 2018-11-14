FROM node:10-alpine
 # For some extra dependencies...
RUN apk add --no-cache dumb-init git bash

COPY . /deploy
ENV NODE_PATH=/deploy/node_modules
ENV PATH=$PATH:/deploy/node_modules/.bin
WORKDIR /deploy
RUN yarn && yarn build
EXPOSE 8080
ENTRYPOINT ["dumb-init", "--", "/bin/bash", "/src/run.sh"]
