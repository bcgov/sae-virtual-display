resource "kubernetes_secret" "tls" {
  metadata {
    name = "cacerts-secret"
    namespace = var.namespace
  }

  data = {
    "ca.crt" = "${file("../../_tmp/ca.crt")}\n${vault_pki_secret_backend_root_sign_intermediate.root.certificate}\n${vault_pki_secret_backend_root_sign_intermediate.root.issuing_ca}"
    "ca_chain.crt" = "${file("../../_tmp/ca.crt")}\n${vault_pki_secret_backend_root_sign_intermediate.root.certificate}\n${vault_pki_secret_backend_root_sign_intermediate.root.issuing_ca}"
    "ca-vaultpki-root.crt" = vault_pki_secret_backend_root_sign_intermediate.root.issuing_ca
    "ca-vaultpki-inter.crt" = vault_pki_secret_backend_root_sign_intermediate.root.certificate
  }
}

resource "kubernetes_config_map" "capfx" {
  depends_on = [null_resource.cachain_pfx]

  metadata {
    name = "cacerts-pfx"
    namespace = var.namespace
  }

  binary_data = {
    "ca_chain.pfx" = "${fileexists("../../_tmp/ca_chain.pfx") ? filebase64("../../_tmp/ca_chain.pfx") : ""}"
  }
}


