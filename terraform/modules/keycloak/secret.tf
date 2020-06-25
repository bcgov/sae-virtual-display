resource "kubernetes_config_map" "kc-stores" {
  metadata {
      name = "keycloak-stores"
      namespace = var.namespace
  }

  binary_data = {
    "servercert.jks" = "${var.servercert}"
    "truststore.jks" = "${var.truststore}"
  }
}

resource "kubernetes_secret" "kc-secret" {
  metadata {
      name = "keycloak-secret"
      namespace = var.namespace
  }

  data = {
    "realm-sae.json" = "${file("${path.module}/artifacts/realm-export-sae.json")}"
    "realm-bbsae.json" = "${file("${path.module}/artifacts/realm-export-bbsae.json")}"
    "standalone-ha.xml" = "${file("${path.module}/artifacts/standalone-ha.xml")}"
  }

  type = "Opaque"
}