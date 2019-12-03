FROM ubuntu:16.04

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
## Spark
##
RUN wget -c http://muug.ca/mirror/apache-dist/spark/spark-2.4.4/spark-2.4.4-bin-hadoop2.7.tgz
RUN mkdir /spark && tar -zxvf /spark-2.4.4-bin-hadoop2.7.tgz -C /spark/

USER $NB_USER

##
## Conda
##
WORKDIR /home/$NB_USER

RUN curl -v -O https://repo.anaconda.com/archive/Anaconda3-2019.10-Linux-x86_64.sh
RUN chmod +x ./Anaconda3-2019.10-Linux-x86_64.sh
RUN ./Anaconda3-2019.10-Linux-x86_64.sh -b

ENV PATH=$PATH:/home/$NB_USER/anaconda3/bin

RUN conda init
RUN conda update --prefix /home/jovyan/anaconda3 anaconda

RUN conda config --add channels conda-forge; \
    conda config --add channels anaconda

RUN conda install r-essentials r-tictoc r-rpostgres --yes
RUN conda install -c conda-forge/label/main r-sparklyr --yes
RUN conda install r-rstudioapi --yes
RUN conda install openjdk --yes

RUN mkdir -p $HOME/.pki/nssdb && certutil -d $HOME/.pki/nssdb -N

USER root

RUN curl -L -O https://download1.rstudio.org/desktop/xenial/amd64/rstudio-1.2.1335-amd64.deb \
&& DEBIAN_FRONTEND=noninteractive apt-get install -y --fix-missing --allow-unauthenticated -f ./rstudio-1.2.1335-amd64.deb \
 && rm ./rstudio-1.2.1335-amd64.deb

COPY artifacts/start-wrapper.sh /usr/local/bin
COPY artifacts/launcher.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh \
 && chmod +x /usr/local/bin/start-wrapper.sh

RUN apt-get install -y xvfb

USER $NB_USER

ENV LANG=en_US.UTF8
ENV XDR_RUNTIME_DIR=/tmp/runtime-jovyan
ENV SPARK_HOME=/spark/spark-2.4.4-bin-hadoop2.7
ENV PATH=$PATH:$SPARK_HOME/bin

ENTRYPOINT ["/usr/local/bin/start-wrapper.sh"]
