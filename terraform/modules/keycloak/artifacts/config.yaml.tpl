
keycloak:
  replicas: 2
  # Keep replicas >= 2 so that standalone-ha.xml is used!

  image:
    tag: 7.0.1

  ingress:
    enabled: true
    hosts:
    - auth.${domain}
    annotations:
      # Enable client certificate authentication
      nginx.ingress.kubernetes.io/auth-tls-verify-client: "optional"
      # Create the secret containing the trusted ca certificates
      nginx.ingress.kubernetes.io/auth-tls-secret: "vdi/cacerts-secret"
      # Specify the verification depth in the client certificates chain
      nginx.ingress.kubernetes.io/auth-tls-verify-depth: "2"
      # Specify an error page to be redirected to verification errors
      # nginx.ingress.kubernetes.io/auth-tls-error-page: "http://auth.${domain}/error-cert.html"
      # Specify if certificates are passed to upstream server
      nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream: "true"
      # Configuration snippet
      nginx.ingress.kubernetes.io/configuration-snippet: |
          proxy_set_header ssl-client-cert $ssl_client_escaped_cert;      
    tls:
    - secretName: vdi-tls
      hosts:
      - auth.${domain}

  username: kcadmin
  password: ${password}

  persistence:
    dbVendor: postgres
    deployPostgres: true

  extraVolumes: |
    - name: keycloak-secret
      secret:
        secretName: keycloak-secret
    - name: keycloak-stores
      configMap:
        name: keycloak-stores

  extraVolumeMounts: |
    - name: keycloak-secret
      mountPath: "/realm/"
      readOnly: true
    - name: keycloak-secret
      mountPath: "/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml"
      subPath: standalone-ha.xml
      readOnly: false
    - name: keycloak-stores
      mountPath: "/opt/jboss/keycloak/standalone/configuration/stores"

  extraArgs: -Dkeycloak.import=/realm/realm-sae.json,/realm/realm-bbsae.json

  extraEnv: |
    #- name: KEYCLOAK_LOGLEVEL
    #  value: TRACE
    - name: ROOT_LOGLEVEL
      value: INFO
    - name: PROXY_ADDRESS_FORWARDING
      value: "true"

postgresql:
  postgresqlPassword: pguserpswd
