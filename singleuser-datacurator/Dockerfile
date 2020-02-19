FROM ubuntu:16.04

##################################################################
##################################################################
##################################################################
#FROM ubuntu:16.04

RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --allow-unauthenticated \
        vim \
        libedit2 \
        curl \
        i3 \
        language-pack-en-base \
        openssh-server \
        x11-apps \
        xserver-xephyr \
        xterm

RUN curl https://winswitch.org/gpg.asc | apt-key add - \
 && echo "deb http://winswitch.org/ xenial main" > /etc/apt/sources.list.d/winswitch.list \
 && curl https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
 && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
 && apt-get update

RUN apt-get update && apt-get install -y \
        dbus-x11 \
        fluxbox \
        xvfb \
        google-chrome-stable \
        libudev-dev \
        python-avahi \
        python-netifaces \
 && apt-get clean -y \
 && apt-get autoremove -y \
 && rm -rf /var/lib/apt/lists/*

RUN adduser --disabled-password --gecos "User" --uid 1000 jovyan

ARG NB_USER=jovyan

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
## Minio CLIENT
##
RUN curl -O https://dl.min.io/client/mc/release/linux-amd64/mc && chmod +x mc && mv mc /usr/local/bin/mc

##
## Apache Arrow library
##
RUN apt-get install -y -V apt-transport-https curl gnupg lsb-release
RUN curl https://dist.apache.org/repos/dist/dev/arrow/KEYS | apt-key add -
RUN echo "deb [arch=amd64] https://dl.bintray.com/apache/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/ $(lsb_release --codename --short) main" >> /etc/apt/sources.list.d/apache-arrow.list
RUN echo "deb-src https://dl.bintray.com/apache/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/ $(lsb_release --codename --short) main" >> /etc/apt/sources.list.d/apache-arrow.list
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y keyboard-configuration
RUN apt-get update \
 && apt-get install -y -V libarrow-dev \
 && apt-get install -y -V libarrow-glib-dev \
 && apt-get install -y -V libplasma-dev \
 && apt-get install -y -V libplasma-glib-dev \
 && apt-get install -y -V libgandiva-dev \
 && apt-get install -y -V libgandiva-glib-dev \
 && apt-get install -y -V libparquet-dev \
 && apt-get install -y -V libparquet-glib-dev

USER $NB_USER

##
## Conda
##
WORKDIR /home/$NB_USER

RUN curl -v -qO https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    chmod +x ./Miniconda3-*-Linux-x86_64.sh && \
    ./Miniconda3-*-Linux-x86_64.sh -b

ENV PATH=$PATH:/home/$NB_USER/miniconda3/bin

RUN conda init
#RUN conda update -n base -c defaults conda
#RUN conda update --prefix /home/$NB_USER/miniconda3 miniconda3

RUN conda config --add channels conda-forge && \
    conda config --add channels anaconda && \
    conda install r-essentials r-tictoc r-rstudioapi openjdk --yes && \
    conda install -c conda-forge/label/main scalapack libiconv arrow-cpp r-base r-arrow r-ggplot2 r-devtools r-microbenchmark r-dbi r-sparklyr r-rpostgres --yes

RUN conda install anaconda-navigator --yes

RUN mkdir -p $HOME/.pki/nssdb && certutil -d $HOME/.pki/nssdb -N

USER root

##
## XPRA
##

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





##
## Add the runtime scripts to start the X-Windows emulator and RStudio
##
ENV LANG=en_US.UTF8
ENV JAVA_HOME=/home/$NB_USER/miniconda3
ENV XDG_RUNTIME_DIR=/tmp/runtime-$NB_USER


######################################################
######################################################
## Data Curator
######################################################

RUN mkdir -p /app

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential clang libdbus-1-dev libgtk-3-dev \
                       libnotify-dev libgnome-keyring-dev \
                       libasound2-dev libcap-dev libcups2-dev libxtst-dev \
                       libxss1 libnss3-dev gcc-multilib g++-multilib curl \
                       gperf bison python-dbusmock openjdk-8-jre

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
 && apt-get install -y nodejs

RUN apt-get install -y git
RUN git clone https://github.com/ODIQueensland/data-curator.git \
 && cd data-curator

RUN apt-get update
RUN npx @electron/check-python-tls

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
 && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

RUN cd data-curator && yarn install
RUN apt-get install -y libgconf-2-4
RUN cd data-curator && yarn run build

RUN cd data-curator && ls -l dist/electron

RUN apt-get install -y libgconf-2-4

RUN chown -R $NB_USER /app

COPY artifacts/start-wrapper.sh /usr/local/bin
COPY artifacts/launcher.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh \
 && chmod +x /usr/local/bin/start-wrapper.sh \
 && mkdir $XDG_RUNTIME_DIR \
 && chmod 0700 $XDG_RUNTIME_DIR \
 && chown $NB_USER $XDG_RUNTIME_DIR

USER $NB_USER


ENTRYPOINT ["/usr/local/bin/start-wrapper.sh"]
