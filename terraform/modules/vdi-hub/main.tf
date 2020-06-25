resource "random_string" "token" {
  length = 32
  lower = false
  special = false
}

data "template_file" "config" {
  template = file("${path.module}/artifacts/config.yaml.tpl")
  vars = {
      domain = var.domain
      token  = random_string.token.result
      USERGUIDE_API_URL = "https://docs.bgddi.com"
      IMAGE_TAG = "v1.3.7"
      HOMEPAGE_URL = "https://auth.demo/auth/realms/sae/account"
      DOMAIN = var.domain
      OIDC_HOST = "auth.demo"
      OIDC_REALM = "bbsae"
      OIDC_CLIENT_ID = "vdi"
      OIDC_CLIENT_SECRET = "006f5b8b-6120-4afb-be57-e55cbbbc1fae"
      VAULT_ADDR = "http://vault.vdi.svc.cluster.local:8200"
      MINIO_ADDR = "http://minio.vdi.svc.cluster.local:9000"
      PROJECT_API_URL = "http://vdi-project-api.vdi.svc.cluster.local"
      PROJECT_API_TOKEN = "s3cret"
      STORAGE_CLASS = "standard"
  }
}

resource "helm_release" "hub" {
  name       = "hub"
  chart      = "vdi-virtual-display"
  repository = "https://bcgov.github.io/helm-charts"

  namespace  = var.namespace

  wait       = false

  values = [
      data.template_file.config.rendered
  ]
}
