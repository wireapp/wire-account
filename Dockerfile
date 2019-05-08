FROM node:10-jessie
 # For some extra dependencies...
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
        curl git bash \
    && curl -sLo /tmp/dumb-init.deb \
		https://github.com/Yelp/dumb-init/releases/download/v1.0.2/dumb-init_1.0.2_amd64.deb \
	&& dpkg -i /tmp/dumb-init.deb \
	&& rm /tmp/dumb-init.deb \
	&& apt-get clean

COPY dist/ .
COPY yarn.lock .
COPY run.sh .
ENV NODE_PATH=/deploy/node_modules
ENV PATH=$PATH:/deploy/node_modules/.bin

RUN yarn

EXPOSE 8080
ENTRYPOINT ["dumb-init", "--", "/bin/bash", "/run.sh"]
