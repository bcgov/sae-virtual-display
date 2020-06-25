resource "vault_mount" "pki_int" {
  path        = "pki_int"
  type        = "pki"
  description = "Mount for PKI Intermediate Authority"
  default_lease_ttl_seconds = 3600
  max_lease_ttl_seconds = 52560000
}

resource "vault_pki_secret_backend_intermediate_cert_request" "intermediate" {
  depends_on = [ vault_mount.pki_int ]

  backend = vault_mount.pki_int.path

  type = "internal"
  common_name = "${var.domain} Intermediate Authority"
}

resource "vault_pki_secret_backend_config_urls" "config_urls_int" {
  backend              = vault_mount.pki_int.path
  issuing_certificates = ["${var.external_url}/v1/pki_int/ca"]
  crl_distribution_points= ["${var.external_url}/v1/pki_int/crl"]
}

resource "vault_pki_secret_backend_role" "users" {
  backend          = vault_mount.pki_int.path
  name             = "users-bbsae"
  allow_subdomains = false
  max_ttl          = 86400 # 24 hours
  allow_any_name   = true
  server_flag      = false
  client_flag      = true
  require_cn       = true
  key_usage        = ["DigitalSignature","KeyAgreement","KeyEncipherment"]
  organization     = ["Data World Inc"]
}


