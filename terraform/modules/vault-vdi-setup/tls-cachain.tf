
resource "local_file" "cachain_crt" {
    depends_on = [vault_pki_secret_backend_root_sign_intermediate.root]

    content = <<EOT
${file("../../_tmp/ca.crt")}
${vault_pki_secret_backend_root_sign_intermediate.root.certificate}
${vault_pki_secret_backend_root_sign_intermediate.root.issuing_ca}
EOT
    filename = "../../_tmp/ca_chain.crt"
}

resource "null_resource" "cachain_pfx" {
    depends_on = [local_file.cachain_crt]

    triggers = {
        crt = md5(local_file.cachain_crt.content)
    }

    provisioner "local-exec" {
        command = "set -e && rm -f _tmp/ca_chain.pfx"
    }

    provisioner "local-exec" {
        command = "set -e && openssl pkcs12 -export -out ../../_tmp/ca_chain.pfx -nokeys -in ../../_tmp/ca_chain.crt -password pass:password"
    }
    # openssl pkcs12 -nokeys -info -in ../../_tmp/ca_chain.pfx
}
