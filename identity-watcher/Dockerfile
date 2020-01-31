FROM ubuntu:16.04

### Tools for handling the Google Chrome browser SSO
RUN apt-get update && apt-get -y install python3-pip libnss3-tools curl openjdk-8-jre-headless

### AWS aws2 command for S3/Minio communication
RUN apt-get update && apt-get install -y curl unzip less
RUN curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
 && unzip awscliv2.zip \
 && ./aws/install

COPY lib/requirements.txt /identity-watcher/
RUN (cd /identity-watcher && pip3 install -r requirements.txt)

COPY lib /identity-watcher

COPY artifacts/launcher.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh

RUN adduser --disabled-password --gecos "User" --uid 1000 watcher

USER watcher

WORKDIR /home/watcher

ENV LANG=en_US.UTF8

ENTRYPOINT ["/usr/local/bin/launcher.sh"]
