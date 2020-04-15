FROM bitnami/spark:2.4.4-debian-9-r108
#FROM bitnami/spark:2.4.5-debian-10-r72

USER root

RUN mv /opt/bitnami/spark /opt/bitnami/spark.oem

## ADD SAME VERSION OF SPARK THAT DOES NOT HAVE HADOOP
## AND ADD HADOOP VERSION 2.8.5 SEPARATELY WITH THE AWS S3 LIBRARIES
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
 && rm -rf $HADOOP_HOME/share/doc

ENV SPARK_VERSION=2.4.5
ENV SPARK_PACKAGE=spark-${SPARK_VERSION}-bin-without-hadoop
ENV SPARK_HOME=/opt/bitnami/spark
#ENV SPARK_DIST_CLASSPATH=$(hadoop classpath)
ENV PATH=${SPARK_HOME}/bin:$PATH

RUN mkdir -p $SPARK_HOME && \
  curl -sL --retry 3 \
  "https://archive.apache.org/dist/spark/spark-${SPARK_VERSION}/${SPARK_PACKAGE}.tgz" \
  | tar --extract --gunzip --no-same-owner -C /tmp/ \
  && mv /tmp/$SPARK_PACKAGE/* ${SPARK_HOME}

ENV AWS_SDK_VERSION=1.10.77

RUN curl -sO https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/${HADOOP_VERSION}/hadoop-aws-${HADOOP_VERSION}.jar \
 && mv hadoop-aws-*.jar $SPARK_HOME/jars/. \
 && curl -sO https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk/${AWS_SDK_VERSION}/aws-java-sdk-${AWS_SDK_VERSION}.jar \
 && curl -sO https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-s3/${AWS_SDK_VERSION}/aws-java-sdk-s3-${AWS_SDK_VERSION}.jar \
 && curl -sO https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-config/${AWS_SDK_VERSION}/aws-java-sdk-config-${AWS_SDK_VERSION}.jar \
 && curl -sO https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-core/${AWS_SDK_VERSION}/aws-java-sdk-core-${AWS_SDK_VERSION}.jar \
 && mv aws-java-sdk-*.jar $SPARK_HOME/jars/.

#RUN cp /opt/bitnami/spark.oem/jars/slf4j* $SPARK_HOME/jars/.

# UPGRADE Python from 3.6 to 3.7
ENV PYTHON_VERSION=3.7.7
RUN apt update && apt install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev curl \
 && curl -O https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tar.xz \
 && tar -xf Python-${PYTHON_VERSION}.tar.xz \
 && (cd Python-${PYTHON_VERSION} && ./configure --enable-optimizations && make -j 4 && make altinstall)
RUN update-alternatives --install /usr/bin/python python /usr/local/bin/python3.7 0 \
 && update-alternatives --install /usr/bin/python3 python3 /usr/local/bin/python3.7 0 \
 && update-alternatives --install /opt/bitnami/python/bin/python python /usr/local/bin/python3.7 0 \
 && update-alternatives --install /opt/bitnami/python/bin/python3 python3 /usr/local/bin/python3.7 0

#RUN ln -s /usr/share/pyshared/lsb_release.py /usr/local/lib/python3.7/site-packages/lsb_release.py \
# && pip3 install --upgrade pip

# RUN mv /opt/bitnami/spark /opt/bitnami/spark.oem && \
#     cp -r /spark/spark-2.4.4 /opt/bitnami/spark
# RUN cp -r /opt/bitnami/spark.oem/tmp /opt/bitnami/spark
# RUN chmod g+w /opt/bitnami/spark
RUN (cd $SPARK_HOME && mkdir -p tmp logs work && chmod -R g+w tmp logs work conf)
RUN echo "export SPARK_DIST_CLASSPATH=$(hadoop classpath)" >> /libspark.sh
# /opt/bitnami/spark/jars/

WORKDIR $SPARK_HOME
USER 1001
