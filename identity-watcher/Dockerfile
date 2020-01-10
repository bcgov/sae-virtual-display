FROM ubuntu:16.04

RUN apt-get update && apt-get -y install python3-pip libnss3-tools curl openjdk-8-jre-headless

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
