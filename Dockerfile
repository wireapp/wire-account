FROM node:22-alpine

# For some extra dependencies...
RUN apk add --no-cache dumb-init git bash

COPY /server .
COPY /run.sh .
ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin

RUN yarn --production --ignore-scripts

ENV NODEPORT 8080
EXPOSE 8080

ENTRYPOINT ["dumb-init", "--", "/bin/bash", "/run.sh"]
