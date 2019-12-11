docker build . -t vdi-init-identity
docker tag vdi-init-identity ikethecoder/vdi-init-identity:0.1.0
docker push ikethecoder/vdi-init-identity

bash ../.travis/docker_quayio_push vdi-init-identity
