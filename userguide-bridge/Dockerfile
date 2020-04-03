FROM node:13-alpine

# Set up Node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm set unsafe-perm true
RUN npm install
COPY src /usr/src/app/src
ENV NODE_ENV production

# Set up launcher
COPY artifacts/launcher.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh && \
    chown node:users /usr/src/app

USER node
ENV LANG=en_US.UTF8

EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/launcher.sh"]
