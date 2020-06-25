
image:
  tag: v1.4.0

projectapi:
  selfSignedTLS: true

  vault:
    addr: "http://vault.vdi.svc.cluster.local:8200"
    token: "root"

  minio:
    addr: "http://minio.vdi.svc.cluster.local:9000"
    accessKey: "1jGcqGoiIBSA7fpi5ITvWuLyL1PKR4oh"
    secretKey: "3CA1hAm09gcZl0U4bR7cIYOvjr0lKqJCnAjICFHoKF2vkPh8NeOgrZ501XuXACdK"

  keycloak:
    url: "https://auth.demo"
    realm: "bbsae"
    username: "realm-admin"
    password: "realm-admin"

  selfserve:
    clientId: "vdi"
    clientSecret: "006f5b8b-6120-4afb-be57-e55cbbbc1fae"

  keycloakInternal:
    url: "https://auth.demo"
    realm: "sae"
    username: "realm-admin"
    password: "realm-admin"

ingress:
  enabled: true
  hosts:
    - host: vdi-admin.demo
      paths: ["/"]
    - host: selfreg.demo
      paths: ["/selfserve","/static"]
  tls:
    - secretName: vdi-tls
      hosts:
        - vdi-admin.demo
        - selfreg.demo
