
resource "vault_pki_secret_backend_root_sign_intermediate" "root" {
  depends_on = [ vault_pki_secret_backend_intermediate_cert_request.intermediate ]

  backend = vault_mount.pki.path

  csr = vault_pki_secret_backend_intermediate_cert_request.intermediate.csr
  format="pem_bundle"
  ttl=51560000
  use_csr_values=true
  common_name = "${var.domain} Intermediate Authority Signed"
}

resource "vault_pki_secret_backend_intermediate_set_signed" "intermediate_external" {
  backend = vault_mount.pki_int.path

  certificate = vault_pki_secret_backend_root_sign_intermediate.root.certificate
}
/*
resource "local_file" "output_signed_ssl_bundle" {
  content = "${vault_pki_secret_backend_root_sign_intermediate.root.certificate}"
  filename = var.signed_ssl_bundle
}

resource "local_file" "output_signed_ssl_bundle_full" {
  content = "${vault_pki_secret_backend_root_sign_intermediate.root.issuing_ca}"
  filename = "${var.signed_ssl_bundle}.issuing_ca.crt"
}
*/