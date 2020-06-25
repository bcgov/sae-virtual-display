global:
    minio:
        accessKey: "${accessKey}"
        secretKey: "${secretKey}"

ingress:
    enabled: true
    hosts:
    - host: minio.${domain}
    tls:
    - secretName: vdi-tls
      hosts:
      - minio.${domain}

mode: standalone

extraEnv:
  - name: MINIO_BROWSER
    value: "on"
  - name: MINIO_HTTP_TRACE
    value: "/dev/stdout"
  - name: MINIO_IAM_JWKS_URL
    value: "http://keycloak-http.vdi.svc.cluster.local/auth/realms/bbsae/protocol/openid-connect/certs"

image:
  tag: 2020.1.25-debian-10-r10
