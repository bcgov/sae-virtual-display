FROM bitnami/spark:2.4.4-debian-9-r108
#FROM bitnami/spark:2.4.5-debian-10-r32 (wasn't able to start)

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

ENV SPARK_VERSION=2.4.4
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

# RUN mv /opt/bitnami/spark /opt/bitnami/spark.oem && \
#     cp -r /spark/spark-2.4.4 /opt/bitnami/spark
# RUN cp -r /opt/bitnami/spark.oem/tmp /opt/bitnami/spark
# RUN chmod g+w /opt/bitnami/spark
RUN (cd $SPARK_HOME && mkdir -p tmp logs work && chmod -R g+w tmp logs work conf)
RUN echo "export SPARK_DIST_CLASSPATH=$(hadoop classpath)" >> /libspark.sh
# /opt/bitnami/spark/jars/

WORKDIR $SPARK_HOME
USER 1001
