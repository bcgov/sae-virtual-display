#!/bin/bash -i

# -i is needed to bootstrap CONDA to get the proper R version

# Because the singleuser POD does not have DNS records created for it, we use an IP address
# so that the Spark workers can communicate with the driver running in POD
export SPARK_DRIVER_HOST=`hostname -I | xargs`
export SPARK_MASTER_URL="spark://spark-master-svc:7077"
export SPARK_DIST_CLASSPATH=$(hadoop classpath)

alias s3sync='mc mirror minio/ /home/jovyan/work/ProjectGroupShare/s3'

# For 'sparklyr'
echo "
default:
  spark.master: $SPARK_MASTER_URL
  spark.driver.host: $SPARK_DRIVER_HOST
" > /home/jovyan/config.yml

DISPLAY=:100 rstudio &

