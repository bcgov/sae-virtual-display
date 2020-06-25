resource "tls_private_key" "ca" {
  algorithm   = "RSA"
}

resource "tls_self_signed_cert" "ca" {
  key_algorithm   = "RSA"
  private_key_pem = tls_private_key.ca.private_key_pem

  is_ca_certificate = true

  subject {
    common_name  = "root"
    organization = "Root CA"
  }

  validity_period_hours = 120000

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
    "cert_signing"
  ]
}

resource "tls_private_key" "vdi" {
  algorithm   = "RSA"
}

resource "tls_cert_request" "vdi" {
  key_algorithm   = "RSA"
  private_key_pem = tls_private_key.vdi.private_key_pem

  subject {
    common_name  = var.domain
    organization = "Data Land Signed"
  }

  dns_names = [
      "hub.${var.domain}",
      "selfreg.${var.domain}",
      "vdi-admin.${var.domain}",
      "auth.${var.domain}",
      "vault.${var.domain}",
      "minio.${var.domain}"
  ]
}

resource "tls_locally_signed_cert" "vdi" {
  cert_request_pem   = tls_cert_request.vdi.cert_request_pem
  ca_key_algorithm   = "RSA"
  ca_private_key_pem = tls_private_key.ca.private_key_pem
  ca_cert_pem        = tls_self_signed_cert.ca.cert_pem

  validity_period_hours = 12000

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}

resource "kubernetes_secret" "tls" {
  metadata {
    name = "vdi-tls"
    namespace = var.namespace
  }

  data = {
      "tls.crt" = tls_locally_signed_cert.vdi.cert_pem
      "tls.key" = tls_private_key.vdi.private_key_pem
      "ca"      = tls_self_signed_cert.ca.cert_pem
  }

  type = "kubernetes.io/tls"
}

resource "local_file" "ca" {
    filename = "_tmp/ca.crt"
    content  = tls_self_signed_cert.ca.cert_pem
}



