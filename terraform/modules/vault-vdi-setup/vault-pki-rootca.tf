resource "vault_mount" "pki" {
  path        = "pki"
  type        = "pki"
  description = "Mount for PKI Infrastructure"
  default_lease_ttl_seconds = 3600
  max_lease_ttl_seconds = 52560000
}

resource "vault_pki_secret_backend_root_cert" "domain" {

  depends_on = [ vault_mount.pki ]

  backend = vault_mount.pki.path

  type = "internal"
  common_name = "${var.domain} Root CA"
  ttl = 315360000
  format = "pem"
  private_key_format = "der"
  key_type = "rsa"
  key_bits = 4096
  exclude_cn_from_sans = true
  ou = "Data World"
  organization = "Data Land (${var.domain})"
}



