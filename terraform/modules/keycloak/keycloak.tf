
resource "random_string" "keycloak_adminpw" {
  length = 32
  special = false
}

data "template_file" "keycloak_config" {
  template = file("${path.module}/artifacts/config.yaml.tpl")
  vars = {
    domain = var.domain
    password = random_string.keycloak_adminpw.result
  }
}

resource "helm_release" "keycloak" {
  name       = "keycloak"
  chart      = "keycloak"
  repository = "https://codecentric.github.io/helm-charts"

  namespace  = var.namespace

  wait       = false

  values = [
      data.template_file.keycloak_config.rendered
  ]
}
