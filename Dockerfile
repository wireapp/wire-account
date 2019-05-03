FROM node:10-alpine
# For some extra dependencies...
RUN apk add --no-cache dumb-init git bash

COPY dist/ .
COPY yarn.lock .
COPY run.sh .
ENV NODE_PATH=/deploy/node_modules
ENV PATH=$PATH:/deploy/node_modules/.bin

RUN yarn

EXPOSE 8080
ENTRYPOINT ["dumb-init", "--", "/bin/bash", "/run.sh"]
