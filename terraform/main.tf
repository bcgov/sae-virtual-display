

module "keycloak" {
    source = "./modules/keycloak"

    namespace = var.namespace

    domain = var.domain

    truststore = "${filebase64("_tmp/truststore.jks")}"
    servercert = "${filebase64("_tmp/keystore.jks")}"
}

module "vault" {
    source = "./modules/vault"

    namespace = var.namespace

    domain = var.domain
}

module "vdi-hub" {
    source = "./modules/vdi-hub"

    namespace = var.namespace

    domain = var.domain
}

#module "vdi-project-api" {
#    source = "./modules/vdi-project-api"
#
#    domain = var.domain
#}

module "minio" {
    source = "./modules/minio"

    namespace = var.namespace

    domain = var.domain
}

/*
module "vault-vdi-setup" {
    source = "./modules/vault-vdi-setup"

    domain = var.domain

    external_url = "https://vault.${var.domain}"
}
*/