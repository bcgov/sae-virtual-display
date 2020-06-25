resource "random_string" "accessKey" {
  length = 32
  special = false
}

resource "random_string" "secretKey" {
  length = 64
  special = false
}

data "template_file" "config" {
  template = file("${path.module}/artifacts/config.yaml.tpl")
  vars = {
      domain = var.domain
      accessKey = random_string.accessKey.result
      secretKey = random_string.secretKey.result
  }
}

resource "helm_release" "minio" {
  name       = "minio"
  chart      = "minio"
  repository = "https://charts.bitnami.com/bitnami"

  namespace  = var.namespace

  wait       = false

  values = [
      data.template_file.config.rendered
  ]
}