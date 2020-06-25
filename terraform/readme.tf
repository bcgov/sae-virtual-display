resource "local_file" "readme" {
    content  = <<-EOT
    KEYCLOAK:
       Username : ${module.keycloak.keycloak_adminuser}
       Password : ${module.keycloak.keycloak_adminpw}

    MINIO:
       Host     : ${module.minio.host}
       AccessKey: ${module.minio.accessKey}
       SecretKey: ${module.minio.secretKey}


    EOT
    filename = "_tmp/readme"
}
