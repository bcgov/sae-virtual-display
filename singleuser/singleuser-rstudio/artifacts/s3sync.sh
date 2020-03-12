#!/bin/bash

# Datasets
aws s3 --endpoint $MINIO_ADDR sync s3://${PROJECT_ID}-datasets /home/jovyan/work/ProjectGroupShare/${PROJECT_ID}-datasets

# Working
aws s3 --endpoint $MINIO_ADDR sync s3://${PROJECT_ID}-working /home/jovyan/work/ProjectGroupShare/${PROJECT_ID}-working
aws s3 --endpoint $MINIO_ADDR sync /home/jovyan/work/ProjectGroupShare/${PROJECT_ID}-working s3://${PROJECT_ID}-working
