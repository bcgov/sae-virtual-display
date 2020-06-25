
output "keycloak_adminpw" {
    value = "${random_string.keycloak_adminpw.result}"
}

output "keycloak_adminuser" {
    value = "kcadmin"
}
