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

RUN mkdir -p $HOME/.pki/nssdb && certutil -d $HOME/.pki/nssdb -N

USER root

##
## Apache Arrow library
##
RUN apt-get install -y -V apt-transport-https curl gnupg lsb-release
RUN curl https://dist.apache.org/repos/dist/dev/arrow/KEYS | apt-key add -
RUN echo "deb [arch=amd64] https://dl.bintray.com/apache/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/ $(lsb_release --codename --short) main" >> /etc/apt/sources.list.d/apache-arrow.list
RUN echo "deb-src https://dl.bintray.com/apache/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/ $(lsb_release --codename --short) main" >> /etc/apt/sources.list.d/apache-arrow.list
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
 && apt-get install -y -V libarrow-dev \
 && apt-get install -y -V libarrow-glib-dev \
 && apt-get install -y -V libplasma-dev \
 && apt-get install -y -V libplasma-glib-dev \
 && apt-get install -y -V libgandiva-dev \
 && apt-get install -y -V libgandiva-glib-dev \
 && apt-get install -y -V libparquet-dev \
 && apt-get install -y -V libparquet-glib-dev

##
## RSTUDIO
##
RUN apt-get update
RUN curl -L -qO https://download1.rstudio.org/desktop/xenial/amd64/rstudio-1.2.5019-amd64.deb \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --fix-missing --allow-unauthenticated -f ./rstudio-1.2.5019-amd64.deb \
 && rm ./rstudio-1.2.5019-amd64.deb

##
## Spark 2.4.4 with Hadoop 2.8.5 libraries and Amazon AWS SDK 1.10.77
##
ENV HADOOP_VERSION=2.8.5
ENV HADOOP_HOME=/spark/hadoop-$HADOOP_VERSION
ENV HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
ENV PATH=${HADOOP_HOME}/bin:$PATH

RUN mkdir -p $HADOOP_HOME && \
  curl -sL --retry 3 \
  "http://archive.apache.org/dist/hadoop/common/hadoop-$HADOOP_VERSION/hadoop-$HADOOP_VERSION.tar.gz" \
  | gunzip \
  | tar -x -C /tmp/ \
 && mv /tmp/hadoop-$HADOOP_VERSION/* ${HADOOP_HOME} \
 && rm -rf $HADOOP_HOME/share/doc \
 && rmdir /tmp/hadoop-$HADOOP_VERSION

ENV SPARK_VERSION=2.4.4
ENV SPARK_PACKAGE=spark-${SPARK_VERSION}-bin-without-hadoop
ENV SPARK_HOME=/spark/spark-${SPARK_VERSION}
#ENV SPARK_DIST_CLASSPATH=$(hadoop classpath)
ENV PATH=${SPARK_HOME}/bin:$PATH

RUN mkdir -p $SPARK_HOME && \
  curl -sL --retry 3 \
  "https://archive.apache.org/dist/spark/spark-${SPARK_VERSION}/${SPARK_PACKAGE}.tgz" \
  | gunzip \
  | tar x -C /tmp/ \
  && mv /tmp/$SPARK_PACKAGE/* ${SPARK_HOME} \
  && rmdir /tmp/$SPARK_PACKAGE

#ENV AWS_SDK_VERSION=1.11.699
ENV AWS_SDK_VERSION=1.10.77

RUN curl -sO https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/${HADOOP_VERSION}/hadoop-aws-${HADOOP_VERSION}.jar \
 && mv hadoop-aws-*.jar $SPARK_HOME/jars/. \
 && curl -sO https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk/${AWS_SDK_VERSION}/aws-java-sdk-${AWS_SDK_VERSION}.jar \
 && curl -sO https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-s3/${AWS_SDK_VERSION}/aws-java-sdk-s3-${AWS_SDK_VERSION}.jar \
 && curl -sO https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-config/${AWS_SDK_VERSION}/aws-java-sdk-config-${AWS_SDK_VERSION}.jar \
 && curl -sO https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-core/${AWS_SDK_VERSION}/aws-java-sdk-core-${AWS_SDK_VERSION}.jar \
 && mv aws-java-sdk-*.jar $SPARK_HOME/jars/.

##
## Add the runtime scripts to start the X-Windows emulator and RStudio
##
ENV LANG=en_US.UTF8
ENV JAVA_HOME=/home/$NB_USER/miniconda3
ENV XDG_RUNTIME_DIR=/tmp/runtime-$NB_USER

COPY artifacts/start-wrapper.sh /usr/local/bin
COPY artifacts/launcher.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh \
 && chmod +x /usr/local/bin/start-wrapper.sh \
 && mkdir $XDG_RUNTIME_DIR \
 && chmod 0700 $XDG_RUNTIME_DIR \
 && chown $NB_USER $XDG_RUNTIME_DIR

USER $NB_USER
ENTRYPOINT ["/usr/local/bin/start-wrapper.sh"]
