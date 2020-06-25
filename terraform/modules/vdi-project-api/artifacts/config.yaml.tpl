
projectapi:
  vault:
    addr: "http://vault.default.svc.cluster.local:8200"
    token: "root"

  minio:
    addr: "http://minio.default.svc.cluster.local:9000"
    accessKey: "XCFJR8CNJ1aiFn8XuCxwzwIMCq2UCVeZ"
    secretKey: "aoqBmSrXqApmrDcipr8Yts7NibhjQuGU3cNRoMwAAF8bBota4FVWC8rlGeiAosX9"

  keycloak:
    url: "https://auth.demo"
    realm: "bbsae"
    username: "kcadmin"
    password: "3AqByHBqTxhbOygbWSQ6Qh2ydy24N3yk"

  selfserve:
    clientId: "vdi"
    clientSecret: "a260fa5a-0c02-4082-97bc-602e735f5a43"

  keycloakInternal:
    url: "https://auth.demo"
    realm: "sae"
    username: "kcadmin"
    password: "3AqByHBqTxhbOygbWSQ6Qh2ydy24N3yk"

ingress:
  enabled: true
  hosts:
    - host: vdi-admin.demo
      paths: ["/"]
    - host: selfreg.demo
      paths: ["/selfserve"]
  tls:
    - secretName: vdi-tls
      hosts:
        - vdi-admin.demo
        - selfreg.demo