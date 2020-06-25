service:
  port: 443
  nodePort: 11001

serverBlock: |-

  server {
    listen                    443 ssl;
    server_name               auth.${domain};

    ssl_certificate           ${sslCertificate};
    ssl_certificate_key       ${sslCertificateKey};

    # Proxy everything over to the service
    location / {
        resolver 127.0.0.11 valid=30s;

        client_max_body_size 0;

        # Add X-Forwarded-* headers
        proxy_set_header        X-Forwarded-Host $host;
        proxy_set_header        X-Forwarded-Proto $scheme;

        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;

        proxy_set_header        Upgrade $http_upgrade;
        proxy_set_header        Connection $connection_upgrade;

        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version      1.1;

        proxy_read_timeout 600s;
        proxy_pass http://${workspace}_gitlab/;
    }
  }
