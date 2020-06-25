resource "random_string" "token" {
  length = 32
  special = false
}

data "template_file" "config" {
  template = file("${path.module}/artifacts/config.yaml.tpl")
  vars = {
      domain = var.domain
      token  = random_string.token.result
  }
}

resource "helm_release" "vdi-project-api" {
  name       = "vdi-project-api"
  chart      = "vdi-project-api"
  repository = "https://bcgov.github.io/helm-charts"

  namespace  = var.namespace

  wait       = false

  values = [
      data.template_file.config.rendered
  ]
}