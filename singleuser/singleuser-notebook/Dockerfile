FROM jupyter/all-spark-notebook:dc9744740e12

USER root

RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --allow-unauthenticated \
        curl \
        i3 \
        language-pack-en-base \
        openssh-server \
        x11-apps \
        xserver-xephyr \
        xterm \
 && apt-get clean -y \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y gnupg2

RUN curl https://winswitch.org/gpg.asc | apt-key add - \
 && echo "deb http://winswitch.org/ bionic main" > /etc/apt/sources.list.d/winswitch.list \
 && curl https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
 && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
 && apt-get update

# http://security.ubuntu.com/ubuntu/pool/main/p/poppler/libpoppler58_0.41.0-0ubuntu1.6_amd64.deb
#RUN curl -L -O http://security.ubuntu.com/ubuntu/pool/main/p/poppler/libpoppler58_0.41.0-0ubuntu1.14_amd64.deb \
# && apt-get install -y -f ./libpoppler58_0.41.0-0ubuntu1.14_amd64.deb \
# && rm ./libpoppler58_0.41.0-0ubuntu1.14_amd64.deb

#RUN curl -L -O http://security.ubuntu.com/ubuntu/pool/main/p/poppler/poppler-utils_0.41.0-0ubuntu1.14_amd64.deb \
# && apt-get install -y -f ./poppler-utils_0.41.0-0ubuntu1.14_amd64.deb \
# && rm ./poppler-utils_0.41.0-0ubuntu1.14_amd64.deb

RUN apt-get remove xpra
RUN curl -L -O https://xpra.org/dists/bionic/main/binary-amd64/xpra_2.5.3-r23270-1_amd64.deb \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --fix-missing --allow-unauthenticated -f ./xpra_2.5.3-r23270-1_amd64.deb \
 && rm ./xpra_2.5.3-r23270-1_amd64.deb

#RUN adduser --disabled-password --gecos "User" --uid 1000 jovyan

RUN apt-get install -y \
        dbus-x11 \
        fluxbox \
        google-chrome-stable \
        libudev-dev \
        python-avahi \
        python-netifaces \
 && apt-get clean -y \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

ARG NB_USER=jovyan

RUN mkdir -p /run/user/1000/xpra \
 && chown -R $NB_USER /run/user \
 && mkdir -p /run/group \
 && chown -R $NB_USER:xpra /run/group \
 && mkdir -p /run/xpra \
 && chown -R $NB_USER:xpra /run/xpra \
 && chown -R $NB_USER:xpra /usr/share/xpra \
 && chown -R $NB_USER:xpra /home/jovyan \
 && chown -R $NB_USER:xpra /usr/local/bin \
 && usermod -a -G xpra $NB_USER

#RUN systemd-machine-id-setup
RUN rm /etc/machine-id && ln -s /var/lib/dbus/machine-id /etc/machine-id

##
## Browser Client Certificate DB
##
RUN apt-get update && apt-get install libnss3-tools

##
## Postgres CLIENT
##
RUN apt-get update && apt-get install -y postgresql-client

##
## XPRA UI Customization
## (removed for notebook because it is using xpra 3)
## COPY artifacts/* /usr/share/xpra/www/.
## RUN rm -f /usr/share/xpra/www/*.br /usr/share/xpra/www/*.gz

### AWS aws2 command for S3/Minio communication
RUN apt-get update && apt-get install -y curl unzip less
RUN curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
 && unzip awscliv2.zip \
 && ./aws/install \
 && rm -rf awscliv2.zip aws

## SonaType Jake for scanning conda python libraries
RUN pip install jake

#############################################################################
#############################################################################

COPY artifacts/start-wrapper.sh /usr/local/bin
COPY artifacts/launcher.sh /usr/local/bin
RUN chmod +x /usr/local/bin/launcher.sh \
 && chmod +x /usr/local/bin/start-wrapper.sh

USER $NB_USER

ENV SPARK_VERSION=2.4.5

RUN mkdir -p $HOME/.pki/nssdb && certutil -d $HOME/.pki/nssdb -N

ENTRYPOINT ["/usr/local/bin/start-wrapper.sh"]
