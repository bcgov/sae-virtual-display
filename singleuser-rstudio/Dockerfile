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
## Spark
##
RUN wget -c http://apache.mirror.colo-serv.net/spark/spark-3.0.0-preview2/spark-3.0.0-preview2-bin-hadoop3.2.tgz
RUN mkdir /spark && tar -zxvf /spark-3.0.0-preview2-bin-hadoop3.2.tgz -C /spark/

USER $NB_USER

##
## Conda
##
WORKDIR /home/$NB_USER

RUN curl -v -O https://repo.anaconda.com/archive/Anaconda3-2019.10-Linux-x86_64.sh && \
    chmod +x ./Anaconda3-2019.10-Linux-x86_64.sh && \
    ./Anaconda3-2019.10-Linux-x86_64.sh -b

ENV PATH=$PATH:/home/$NB_USER/anaconda3/bin

RUN conda init
RUN conda update --prefix /home/jovyan/anaconda3 anaconda

RUN conda config --add channels conda-forge; \
    conda config --add channels anaconda

RUN conda install r-essentials r-tictoc r-rstudioapi --yes
RUN conda install -c conda-forge/label/main scalapack openjdk libiconv r-dbi r-sparklyr r-rpostgres --yes

RUN mkdir -p $HOME/.pki/nssdb && certutil -d $HOME/.pki/nssdb -N

USER root

RUN curl -L -O https://download1.rstudio.org/desktop/xenial/amd64/rstudio-1.2.5019-amd64.deb \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --fix-missing --allow-unauthenticated -f ./rstudio-1.2.5019-amd64.deb \
 && rm ./rstudio-1.2.5019-amd64.deb

RUN curl -O https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk/1.11.699/aws-java-sdk-1.11.699.jar \
 && mv aws-java-sdk-*.jar /spark/spark-3.0.0-preview2-bin-hadoop3.2/jars/.

RUN curl -O https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/3.2.1/hadoop-aws-3.2.1.jar \
 && mv hadoop-aws-*.jar /spark/spark-3.0.0-preview2-bin-hadoop3.2/jars/.


###### Attempt 1

# RUN curl -O https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk/1.7.15/aws-java-sdk-1.7.15.jar \
#  && mv aws-java-sdk-*.jar /spark/spark-2.4.4-bin-hadoop2.7/jars/.

# # Works, BUT gives error due to vhost style S3 URLs; path style access added in 2.8.0
# RUN curl -O https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/2.7.7/hadoop-aws-2.7.7.jar \
#  && mv hadoop-aws-*.jar /spark/spark-2.4.4-bin-hadoop2.7/jars/.

COPY artifacts/start-wrapper.sh /usr/local/bin
COPY artifacts/launcher.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh \
 && chmod +x /usr/local/bin/start-wrapper.sh

USER $NB_USER

ENV LANG=en_US.UTF8
ENV XDR_RUNTIME_DIR=/tmp/runtime-jovyan
ENV SPARK_HOME=/spark/spark-3.0.0-preview2-bin-hadoop3.2
ENV PATH=$PATH:$SPARK_HOME/bin

ENTRYPOINT ["/usr/local/bin/start-wrapper.sh"]
