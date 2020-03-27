#!/bin/bash -i

# -i is needed to bootstrap CONDA to get the proper R version

# Because the singleuser POD does not have DNS records created for it, we use an IP address
# so that the Spark workers can communicate with the driver running in POD
export SPARK_DRIVER_HOST=`hostname -I | xargs`
export SPARK_MASTER_URL="spark://spark-master-svc:7077"
export SPARK_DIST_CLASSPATH=$(hadoop classpath)

echo 'alias s3="aws s3 --endpoint $MINIO_ADDR"' >> /home/jovyan/.profile

# For 'sparklyr'
echo "
default:
  spark.master: $SPARK_MASTER_URL
  spark.driver.host: $SPARK_DRIVER_HOST
" > /home/jovyan/config.yml

mkdir -p /home/jovyan/.config/RStudio

echo "
[General]
desktop.renderingEngine=software

[mainwindow]
geometry=@ByteArray(\x1\xd9\xd0\xcb\0\x3\0\0\0\0\0\0\0\0\0\x1f\0\0\x6r\0\0\x3\x30\0\0\0\0\0\0\0\x1f\0\0\x6r\0\0\x3\x30\0\0\0\0\0\0\0\0\x6t\0\0\0\0\0\0\0\x1f\0\0\x6r\0\0\x3\x30)

" > /home/jovyan/.config/RStudio/desktop.ini

DISPLAY=:100 rstudio &

