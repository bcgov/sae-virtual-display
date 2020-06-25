
resource "vault_jwt_auth_backend" "issuer" {
    description  = "Keycloak auth backend for issuing certificates"
    path = "jwt"
    type = "jwt"
    oidc_discovery_url = "https://${var.oidc_host}/auth/realms/${var.oidc_realm}"
    oidc_discovery_ca_pem = file("../../_tmp/ca.crt")
    default_role="noops"
    
}

resource "vault_policy" "sae-issue-cert-role" {
  name = "sae-issue-cert-role"

  policy = <<EOT
path "pki_int/issue/*" {
  capabilities = ["update"]
}
EOT
}

resource "vault_jwt_auth_backend_role" "sae-issue-cert-role" {
  backend         = vault_jwt_auth_backend.issuer.path
  role_name       = "sae-issue-cert-role"
  role_type       = "jwt"
  token_policies  = [vault_policy.sae-issue-cert-role.name]
  token_ttl       = 20
  token_max_ttl   = 20
  allowed_redirect_uris = [
      "${var.external_url}/ui/vault/auth/popdata/oidc/callback",
      "https://hub.${var.domain}/hub/oauth_callback"
  ]
  bound_audiences = []
  user_claim      = "preferred_username"
  bound_claims = {
      groups = ""
  }
  
}

