
output "accessKey" {
    value = "${random_string.accessKey.result}"
}

output "secretKey" {
    value = "${random_string.secretKey.result}"
}

output "host" {
    value = "minio.${var.domain}"
}
