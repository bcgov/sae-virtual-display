FROM ubuntu:16.04

RUN apt-get update && apt-get -y install python3-pip curl

RUN adduser --disabled-password --gecos "App User" --uid 1000 appuser

ARG NB_USER=appuser

COPY server/requirements.txt /app/
RUN (cd /app && pip3 install -r requirements.txt)

# Install MC Minio client for configuring policies
RUN curl -O https://dl.min.io/client/mc/release/linux-amd64/archive/mc.RELEASE.2020-04-02T21-50-12Z && \
    chmod +x mc.RELEASE.2020-04-02T21-50-12Z && \
    mv mc.RELEASE.2020-04-02T21-50-12Z /usr/local/bin/mc

COPY server /app

COPY artifacts/launcher.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh

RUN chown -R $NB_USER:users /home/appuser \
 && chown -R $NB_USER:users /app \
 && chown -R $NB_USER:users /usr/local/bin \
 && usermod -a -G users $NB_USER


USER $NB_USER

WORKDIR /app
ENV LANG=en_US.UTF8

ENTRYPOINT ["/usr/local/bin/launcher.sh"]
