FROM ubuntu:18.04

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

RUN apt-get install -y gnupg2 \
 && curl https://winswitch.org/gpg.asc | apt-key add - \
 && echo "deb http://winswitch.org/ xenial main" > /etc/apt/sources.list.d/winswitch.list \
 && curl https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
 && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
 && apt-get update

# Ubuntu 18.04 needed libegl1 for RStudio
RUN apt-get update && apt-get install -y \
        dbus-x11 \
        fluxbox \
        xvfb \
        libegl1 \
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
## Git
##
RUN apt-get update && apt-get install -y git

##
## Browser Client Certificate DB
##
RUN apt-get update && apt-get install libnss3-tools

##
## Postgres CLIENT
##
RUN apt-get update && apt-get install -y postgresql-client

### AWS aws2 command for S3/Minio communication
RUN apt-get update && apt-get install -y curl unzip less
RUN curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
 && unzip awscliv2.zip \
 && ./aws/install

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

## Cairo libraries for rendering ggplot2
## RUN apt-get install -y -V libcairo2-dev libjpeg9-dev

##
## Conda
##

WORKDIR /opt

RUN curl -v -qO https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    chmod +x ./Miniconda3-*-Linux-x86_64.sh && \
    ./Miniconda3-*-Linux-x86_64.sh -b -p /opt/miniconda && \
    rm -f ./Miniconda3-*-Linux-x86_64.sh

RUN groupadd conda && \
    chgrp conda -R /opt/miniconda && \
    chmod 770 -R /opt/miniconda

#RUN usermod -a -G conda $NB_USER
RUN adduser $NB_USER conda

ENV PATH=$PATH:/opt/miniconda/bin

RUN conda init
#RUN conda update -n base -c defaults conda
#RUN conda update --prefix /home/$NB_USER/miniconda3 miniconda3

RUN conda config --add channels conda-forge && \
    conda config --add channels anaconda && \
    conda install openjdk --yes && \
    conda install -c conda-forge/label/main cairo scalapack libiconv arrow-cpp r-bench r-dtplyr r-ggbeeswarm r-essentials r-tictoc r-rstudioapi r-base r-arrow r-ggplot2 r-devtools r-microbenchmark r-dbi r-sparklyr r-rpostgres --yes

##
## RSTUDIO
##
ENV RSTUDIO_VERSION=1.2.5033

RUN curl -L -qO https://download1.rstudio.org/desktop/xenial/amd64/rstudio-${RSTUDIO_VERSION}-amd64.deb \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --fix-missing --allow-unauthenticated -f ./rstudio-${RSTUDIO_VERSION}-amd64.deb \
 && rm ./rstudio-${RSTUDIO_VERSION}-amd64.deb

##
## Spark 2.4.5 with Hadoop 2.8.5 libraries and Amazon AWS SDK 1.10.77
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

ENV SPARK_VERSION=2.4.5
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
ENV XDG_RUNTIME_DIR=/tmp/runtime-$NB_USER

COPY artifacts/start-wrapper.sh /usr/local/bin
COPY artifacts/s3sync.sh /usr/local/bin/s3_sync
COPY artifacts/launcher.sh /usr/local/bin/launcher.sh
RUN chmod +x /usr/local/bin/launcher.sh \
 && chmod +x /usr/local/bin/start-wrapper.sh /usr/local/bin/s3_sync \
 && mkdir $XDG_RUNTIME_DIR \
 && chmod 0700 $XDG_RUNTIME_DIR \
 && chown $NB_USER $XDG_RUNTIME_DIR

USER $NB_USER

RUN mkdir -p $HOME/.pki/nssdb && certutil -d $HOME/.pki/nssdb -N

ENV LANG=en_US.UTF8
ENV JAVA_HOME=/opt/miniconda/bin
ENV LD_LIBRARY_PATH=/opt/miniconda/lib/R/lib
ENV PATH=$PATH:/opt/miniconda/bin
RUN conda init

ENTRYPOINT ["/usr/local/bin/start-wrapper.sh"]
