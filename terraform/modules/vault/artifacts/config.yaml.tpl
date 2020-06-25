
server:
    ingress:
        enabled: true
        hosts:
        - host: vault.${domain}
        tls:
        - secretName: vdi-tls
          hosts:
          - vault.${domain}

    dev:
        enabled: true
