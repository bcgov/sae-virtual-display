FROM ubuntu:16.04

RUN apt-get update && apt-get -y install python3-pip

RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --allow-unauthenticated \
        curl \
        i3 \
        language-pack-en-base \
        openssh-server \
        x11-apps \
        xserver-xephyr \
        xterm

RUN apt-get update && apt-get install -y \
        wget \
        software-properties-common \
        libudev-dev \
        python-avahi \
        python-netifaces \
 && apt-get clean -y \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

RUN curl https://winswitch.org/gpg.asc | apt-key add - \
 && echo "deb http://winswitch.org/ xenial main" > /etc/apt/sources.list.d/winswitch.list \
 && curl https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
 && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
 && apt-get update

# http://security.ubuntu.com/ubuntu/pool/main/p/poppler/libpoppler58_0.41.0-0ubuntu1.6_amd64.deb
RUN curl -L -O http://security.ubuntu.com/ubuntu/pool/main/p/poppler/libpoppler58_0.41.0-0ubuntu1.14_amd64.deb \
 && apt-get install -y -f ./libpoppler58_0.41.0-0ubuntu1.14_amd64.deb \
 && rm ./libpoppler58_0.41.0-0ubuntu1.14_amd64.deb

RUN curl -L -O http://security.ubuntu.com/ubuntu/pool/main/p/poppler/poppler-utils_0.41.0-0ubuntu1.14_amd64.deb \
 && apt-get install -y -f ./poppler-utils_0.41.0-0ubuntu1.14_amd64.deb \
 && rm ./poppler-utils_0.41.0-0ubuntu1.14_amd64.deb

RUN curl -L -O https://xpra.org/dists/xenial/main/binary-amd64/xpra_2.5.3-r23270-1_amd64.deb \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --fix-missing --allow-unauthenticated -f ./xpra_2.5.3-r23270-1_amd64.deb \
 && rm ./xpra_2.5.3-r23270-1_amd64.deb


COPY lib/requirements.txt /gatekeeper/
RUN (cd /gatekeeper && pip3 install -r requirements.txt)
RUN mkdir -p /var/www/htdocs && echo 'ok' > /var/www/htdocs/index.html
RUN wget -O - https://openresty.org/package/pubkey.gpg | apt-key add -

# OpenResty/LUA for Gatekeeper
RUN apt-get -y install --no-install-recommends wget gnupg ca-certificates && \
    wget -O - https://openresty.org/package/pubkey.gpg | apt-key add - && \
    add-apt-repository -y "deb http://openresty.org/package/ubuntu $(lsb_release -sc) main" && \
    apt-get update && \
    apt-get install -y openresty

RUN adduser --disabled-password --gecos "User" --uid 1000 jovyan

ARG NB_USER=jovyan

COPY lib /gatekeeper
COPY artifacts/openresty.conf /etc/openresty/nginx.conf
RUN chown -R $NB_USER:$NB_USER /usr/local/openresty

COPY artifacts/start-gatekeeper.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh

RUN mkdir -p /run/user/1000/xpra \
 && chown -R $NB_USER:xpra /run/user \
 && mkdir -p /run/group \
 && chown -R $NB_USER:xpra /run/group \
 && mkdir -p /run/xpra \
 && chown -R $NB_USER:xpra /run/xpra \
 && chown -R $NB_USER:xpra /usr/share/xpra \
 && chown -R $NB_USER:xpra /home/jovyan \
 && chown -R $NB_USER:xpra /usr/local/bin \
 && usermod -a -G xpra $NB_USER

##
## XPRA UI Customization
##
COPY artifacts/index-v3.html /usr/share/xpra/www/index.html
RUN rm -f /usr/share/xpra/www/*.br /usr/share/xpra/www/*.gz

USER $NB_USER

ENV LANG=en_US.UTF8
ENV XDR_RUNTIME_DIR=/tmp/runtime-jovyan

ENTRYPOINT ["/usr/local/bin/launcher.sh"]
