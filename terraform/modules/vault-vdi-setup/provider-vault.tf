provider "vault" {
    address      = var.external_url
    token        = "root"
    ca_cert_file = "../../_tmp/ca.crt"
}
