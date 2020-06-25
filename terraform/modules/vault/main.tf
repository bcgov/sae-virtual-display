data "template_file" "config" {
  template = file("${path.module}/artifacts/config.yaml.tpl")
  vars = {
      domain = var.domain
  }
}

resource "helm_release" "vault" {
  name       = "vault"
  chart      = "vault"
  repository = "https://helm.releases.hashicorp.com"

  namespace  = var.namespace

  wait       = false

  values = [
      data.template_file.config.rendered
  ]
}