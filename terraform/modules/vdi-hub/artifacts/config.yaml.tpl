
ingress:
    enabled: true
    hosts:
    - hub.${domain}
    tls:
    - secretName: vdi-tls
      hosts:
      - hub.${domain}

proxy:
  secretToken: ${token}


hub:
  service:
    type: ClusterIP
    annotations: {}
    ports:
      nodePort:
    loadBalancerIP:
  baseUrl: /
  cookieSecret:
  publicURL:
  initContainers: []
  uid: 1000
  fsGid: 1000
  nodeSelector: {}
  concurrentSpawnLimit: 64
  consecutiveFailureLimit: 5
  activeServerLimit:
  deploymentStrategy:
    ## type: Recreate
    ## - sqlite-pvc backed hubs require the Recreate deployment strategy as a
    ##   typical PVC storage can only be bound to one pod at the time.
    ## - JupyterHub isn't designed to support being run in parallell. More work
    ##   needs to be done in JupyterHub itself for a fully highly available (HA)
    ##   deployment of JupyterHub on k8s is to be possible.
    type: Recreate
  db:
    type: sqlite-pvc
    upgrade:
    pvc:
      annotations: {}
      selector: {}
      accessModes:
        - ReadWriteOnce
      storage: 1Gi
      subPath:
      storageClassName:
    url:
    password:
  labels: {}
  annotations: {}
  extraConfig:
    vdi: |
      import hashlib, json
      from kubernetes.client.models import ( V1ContainerPort, V1EnvVar)

      c.JupyterHub.spawner_class = 'k8sspawner.K8sSpawner'
      c.JupyterHub.allow_named_servers = True
      c.JupyterHub.cookie_max_age_days = 10 * (1/(24*60)) # 10 minute expiry to expire before Keycloak JWT refresh token

      c.JupyterHub.template_vars = {
          "userguide_url": "${USERGUIDE_API_URL}"
      }

      def username_key(jwt):

        project = "undefined"
        for grp in jwt["groups"]:
            if grp.split('-')[0].isnumeric():
                project = grp

        id = jwt["preferred_username"] + "@" + project
        return id
      c.GenericOAuthenticator.username_key = username_key

      from z2jh import get_config
      c.K8sSpawner.cmd = ['jupyter-labhub']
      c.KubeSpawner.pvc_name_template = 'claim-{username}-{group}'
      c.KubeSpawner.pod_name_template = 'display-{username}-{group}{servername}'
      c.K8sSpawner.storage_class = '${STORAGE_CLASS}'

      #def userdata_hook(spawner, auth_state):
      #  spawner.userdata = auth_state["groups"]
      #c.KubeSpawner.auth_state_hook = userdata_hook

      c.JupyterHub.named_server_limit_per_user = 0

      container_envs = [
          { # Virtual Display
            "HOME_PAGE": "",
            "JHUB_URL": "",
            "JHUB_API": "",
            "PGHOST": "",
            "PGPORT": "",
            "PGUSER": "",
            "PGDATABASE": "",
            "PGSSLMODE": "",
            "REQUESTS_CA_BUNDLE" : "",
            "USER_PROJECT_ID": "",
            "PROJECT_ID": "",
            "VAULT_ADDR": "",
            "MINIO_ADDR": ""
        },
        { # Gatekeeper
            "EXTERNAL_HOST": "",
            "JUPYTERHUB_BASE_URL": "",
            "JUPYTERHUB_CLIENT_ID": "",
            "JUPYTERHUB_API_TOKEN": "",
            "JUPYTERHUB_SERVICE_PREFIX": "",
            "JUPYTERHUB_OAUTH_CALLBACK_URL": "",
            "REQUESTS_CA_BUNDLE" : "",
            "JHUB_API": "",
            "XPRA_ARGS": ""
        },
        { # Identity Watcher
            "REFRESH_TOKEN_PATH": "",
            "PROJECT_ID": "",
            "USER_PROJECT_ID": "",
            "OAUTH2_TOKEN_URL": "",
            "OAUTH2_CLIENT_ID": "",
            "OAUTH2_CLIENT_SECRET": "",
            "CA_CHAIN_URI": "",
            "REQUESTS_CA_BUNDLE" : "",
            "VAULT_ADDR": "",
            "MINIO_ADDR": ""
        }
      ]

      def modify_pod_hook(spawner, pod):
        # Copy the environment vars set in first container and put in second container
        master_envs = pod.spec.containers[0].env
        pod.spec.containers[0].env = []

        for env in master_envs:
           if env.name in container_envs[0].keys():
             container_envs[0][env.name] = env.value
           if env.name in container_envs[1].keys():
             container_envs[1][env.name] = env.value
           if env.name in container_envs[2].keys():
             container_envs[2][env.name] = env.value

        pod.spec.containers[0].env = [V1EnvVar(k, v) for k, v in (container_envs[0]).items()]
        pod.spec.containers[1].env = [V1EnvVar(k, v) for k, v in (container_envs[1]).items()]
        pod.spec.containers[2].env = [V1EnvVar(k, v) for k, v in (container_envs[2]).items()]

        pod.spec.containers[0].name = 'display-session'
        pod.spec.containers[0].ports = [V1ContainerPort(name='virtual-display', container_port=8887)]
        pod.spec.containers[0].args = ['jupyter-labhub', '--ip="0.0.0.0"', '--port=8887']
        return pod

      c.KubeSpawner.modify_pod_hook = modify_pod_hook

      c.KubeSpawner.port = 8888

      # NEEDED FOR Google CHROME and appears for RStudio as well
      #c.KubeSpawner.extra_container_config = {
      #  "security_context": {
      #    "capabilities": {
      #        "add": ["SYS_ADMIN"]
      #    }
      #  }
      #}

      c.KubeSpawner.extra_pod_config = {
        "hostIPC": True
      }

      c.KubeSpawner.extra_containers = [
          {
              "name": "gatekeeper",
              "image": "quay.io/ikethecoder/vdi-gatekeeper:${IMAGE_TAG}",
              "ports": [
                  {
                      "containerPort": 8888,
                      "name": "notebook-port",
                      "protocol": "TCP"
                  }
              ],
              "volumeMounts": [
                  {
                      "mountPath": "/etc/ssl/certs",
                      "name": "ssl-certs"
                  }
              ],
              "readinessProbe": {
                "exec": {
                    "command": [
                        "curl",
                        "--silent",
                        "--fail",
                        "http://127.0.0.1:5000"
                    ]
                },
                "failureThreshold": 10,
                "timeoutSeconds": 4,
                "periodSeconds": 2
              }
         },
         {
              "name": "identity-watcher",
              "image": "quay.io/ikethecoder/vdi-identity-watcher:${IMAGE_TAG}",
              "env": [],
              "volumeMounts": [
                    {
                        "mountPath": "/etc/ssl/certs",
                        "name": "ssl-certs"
                    },
                    {
                        'mountPath': '/cacerts',
                        'name': 'ca-cert'
                    },
                    {
                        'mountPath': '/tmp-user-identity',
                        'name': 'user-identity'
                    },
                    {
                        'mountPath': '/tmp-pki-nssdb',
                        'name': 'auth-nssdb'
                    },
                    {
                        'mountPath': '/tmp-pki-postgres',
                        'name': 'auth-postgres'
                    },
                    {
                        'mountPath': '/tmp-pki-java',
                        'name': 'auth-java'
                    },
                    {
                        'mountPath': '/tmp-auth-minio',
                        'name': 'auth-minio'
                    }
              ]
         }          
      ]

      c.KubeSpawner.environment = {
        "HOME_PAGE": "${HOMEPAGE_URL}",
        "JHUB_URL": "",
        "JHUB_API": "https://hub.${DOMAIN}/hub/api",
        "PGHOST": "psql.${DOMAIN}",
        "PGPORT": "31432",
        "PGUSER": "{username}-{group}",
        "PGDATABASE": "{group}",
        "PGSSLMODE": "require",
        "REQUESTS_CA_BUNDLE" : "/etc/ssl/certs/ca-certificates.crt",
        "EXTERNAL_HOST": "https://hub.${DOMAIN}",
        "REFRESH_TOKEN_PATH": "/tmp-user-identity/refresh_token",
        "PROJECT_ID": "{group}",
        "USER_PROJECT_ID": "{username}-{group}",
        "OAUTH2_TOKEN_URL": "https://${OIDC_HOST}/auth/realms/${OIDC_REALM}/protocol/openid-connect/token",
        "OAUTH2_CLIENT_ID": "${OIDC_CLIENT_ID}",
        "OAUTH2_CLIENT_SECRET": "${OIDC_CLIENT_SECRET}",
        "CA_CHAIN_URI": "http://vdi-project-api-static.vdi.svc.cluster.local:8000/ca_chain.pfx",
        "VAULT_ADDR": "${VAULT_ADDR}",
        "MINIO_ADDR": "${MINIO_ADDR}",
        "XPRA_ARGS": "--use-display"
      }


      c.KubeSpawner.volumes = [
          {
              'name': 'vol-user',
              'persistentVolumeClaim': {
                  'claimName': 'claim-{username}-{group}'
              }
          },
          {
              'name': 'vol-project',
              'persistentVolumeClaim': {
                  'claimName': 'claim-{group}'
              }
          },
          {
              'name': 'vol-conda-environments',
              'persistentVolumeClaim': {
                  'claimName': 'claim-conda-environments'
              }
          },
          {
              'name': 'ca-cert',
              'secret': { 'secretName' : 'cacerts-secret'}
          },
          {
              'name': 'user-identity',
              'secret': { 'secretName' : '{username}-{group}-cert'}
          },
          {
              'name': 'auth-nssdb',
              'emptyDir': {}
          },
          {
              'name': 'auth-postgres',
              'emptyDir': {}
          },
          {
              'name': 'auth-java',
              'emptyDir': {}
          },
          {
              'name': 'auth-minio',
              'emptyDir': {}
          },
          {
              'name': 'ssl-certs',
              'emptyDir': {}
          }
      ]
      on_hold = [
          {
              'mountPath': '/opt/miniconda/jre/lib/security',
              'name': 'auth-java'
          }
      ]
      c.KubeSpawner.volume_mounts = [
          {
              'mountPath': get_config('singleuser.storage.homeMountPath'),
              'name': 'vol-user'
          },
          {
              'mountPath': "/home/jovyan/work/ProjectGroupShare",
              'name': 'vol-project'
          },
          {
              'mountPath': '/opt/miniconda/envs',
              'name': 'vol-conda-environments'
          },
          {
              'mountPath': '/home/jovyan/.pki/nssdb',
              'name': 'auth-nssdb'
          },
          {
              'mountPath': '/home/jovyan/.postgresql',
              'name': 'auth-postgres'
          },
          {
              'mountPath': '/home/jovyan/.aws',
              'name': 'auth-minio'
          },
          {
              'mountPath': '/cacerts',
              'name': 'ca-cert'
          },
          {
              'mountPath': '/etc/ssl/certs',
              'name': 'ssl-certs'
          }
      ]

  extraConfigMap: {}
  extraEnv:
    OAUTH2_TLS_VERIFY: "false"
    OAUTH2_AUTHORIZE_URL: https://${OIDC_HOST}/auth/realms/${OIDC_REALM}/protocol/openid-connect/auth
    OAUTH2_TOKEN_URL: https://${OIDC_HOST}/auth/realms/${OIDC_REALM}/protocol/openid-connect/token
    OAUTH2_CLIENT_ID: "${OIDC_CLIENT_ID}"
    OAUTH2_CLIENT_SECRET: "${OIDC_CLIENT_SECRET}"
    VAULT_ADDR: "${VAULT_ADDR}"
    MINIO_ADDR: "${MINIO_ADDR}"
    JUPYTER_ENABLE_LAB: 1
    PROJECT_API_URL: "${PROJECT_API_URL}"
    PROJECT_API_TOKEN: "${PROJECT_API_TOKEN}"
    REQUESTS_CA_BUNDLE: "/etc/certificates/ca.pem"
    HOMEPAGE_URL: "${HOMEPAGE_URL}"

  extraContainers: []
  extraVolumes:
    - name: ca-cert
      secret:
        secretName: cacerts-secret
    - name: ca-bundle
      secret:
        secretName: vdi-tls
        items:
        - key: ca
          path: ca.pem
    - name: vdi-applications
      configMap:
        name: vdi-applications
  extraVolumeMounts:
    - name: ca-cert
      mountPath: /cacerts
    - name: ca-bundle
      mountPath: /etc/certificates
    - name: vdi-applications
      mountPath: /vdi
  image:
    name: quay.io/ikethecoder/vdi-hub
    tag: ${IMAGE_TAG}
    # pullSecrets:
    #   - secretName
  resources:
    requests:
      cpu: 200m
      memory: 512Mi
  services: {}
  imagePullSecret:
    enabled: false
    registry:
    username:
    email:
    password:
  pdb:
    enabled: true
    minAvailable: 1
  networkPolicy:
    enabled: false
    ingress: []
    egress:
      - to:
          - ipBlock:
              cidr: 0.0.0.0/0
  allowNamedServers: false
  namedServerLimitPerUser:
  authenticatePrometheus:
  redirectToServer:
  shutdownOnLogout:
  templatePaths: []
  templateVars: {}
  livenessProbe:
    enabled: false
    initialDelaySeconds: 30
    periodSeconds: 10
  readinessProbe:
    enabled: true
    initialDelaySeconds: 0
    periodSeconds: 10
  # existingSecret: existing-secret

rbac:
  enabled: true

prePuller:
  hook:
    enabled: false
    image:
      name: jupyterhub/k8s-image-awaiter
      tag: 0.9.0-alpha.1.095.3e95dc3
  extraImages:
    hub:
      name: quay.io/ikethecoder/vdi-hub
      tag: ${IMAGE_TAG}
      policy: Always
    gatekeeper:
      name: quay.io/ikethecoder/vdi-gatekeeper
      tag: ${IMAGE_TAG}
      policy: Always
    init-identity:
      name: quay.io/ikethecoder/vdi-init-identity
      tag: ${IMAGE_TAG}
      policy: Always
    identity-watcher:
      name: quay.io/ikethecoder/vdi-identity-watcher
      tag: ${IMAGE_TAG}
      policy: Always
    session-browser:
      name: quay.io/ikethecoder/vdi-session-browser
      tag: ${IMAGE_TAG}
      policy: Always
    session-rstudio:
      name: quay.io/ikethecoder/vdi-session-rstudio
      tag: ${IMAGE_TAG}
      policy: Always
    spark-worker:
      name: quay.io/ikethecoder/vdi-spark-worker
      tag: ${IMAGE_TAG}
      policy: Always

auth:
  type: custom
  state:
      enabled: True
      cryptoKey: c5cd1bda51ccfbf50c634a2f4fb58b15e60934a195c59d3a8f8e47870cf82bc9
  custom:
    className: oauthenticator.generic.GenericOAuthenticator
    config:
      login_service: "keycloak"
      client_id: "${OIDC_CLIENT_ID}"
      client_secret: "${OIDC_CLIENT_SECRET}"
      token_url: "https://${OIDC_HOST}/auth/realms/${OIDC_REALM}/protocol/openid-connect/token"
      userdata_url: "https://${OIDC_HOST}/auth/realms/${OIDC_REALM}/protocol/openid-connect/userinfo"
      authorize_url: "https://${OIDC_HOST}/auth/realms/${OIDC_REALM}/protocol/openid-connect/auth"
      callback_url: https://vdi.demo/hub/oauth_callback
      userdata_method: GET
      userdata_params: {'state': 'state'}
  whitelist:
    users:
  admin:
    access: true
    users:
  dummy:
    password:
  ldap:
    dn:
      search: {}
      user: {}
    user: {}

singleuser:
  extraTolerations: []
  nodeSelector: {}
  extraNodeAffinity:
    required: []
    preferred: []
  extraPodAffinity:
    required: []
    preferred: []
  extraPodAntiAffinity:
    required: []
    preferred: []
  networkTools:
    image:
      name: jupyterhub/k8s-network-tools
      tag: 0.9.0-alpha.1.095.3e95dc3
  cloudMetadata:
    enabled: false
    ip: 169.254.169.254
  networkPolicy:
    enabled: false
    ingress: []
    egress:
    # Required egress is handled by other rules so it's safe to modify this
      - to:
          - ipBlock:
              cidr: 0.0.0.0/0
              except:
                - 169.254.169.254/32
  events: true
  extraAnnotations: {}
  extraLabels:
    hub.jupyter.org/network-access-hub: 'true'
  extraEnv: {}
  lifecycleHooks: {}

  initContainers:
    - name: "configure-user-identity"
      image: quay.io/ikethecoder/vdi-init-identity:${IMAGE_TAG}
      command: ["/bin/sh"]
      securityContext:
        runAsUser: 0
        allowPrivilegeEscalation: false      
      args:
      - "-c"
      - |
       set -x
       #
       # S3 authentication setup
       #
       #cp /tmp-user-identity/mc-config.json /tmp-auth-minio/config.json
       #mkdir /tmp-auth-minio/session /tmp-auth-minio/share /tmp-auth-minio/certs
       #chown -R 1000:1000 /tmp-auth-minio/*
       #chmod -R 0700 /tmp-auth-minio/*
       #
       # Postgres authentication setup
       #
       cp /tmp-user-identity/postgresql.* /tmp-pki-postgres
       chown 1000:1000 /tmp-pki-postgres/*
       chmod 600 /tmp-pki-postgres/*
       #
       # Browser/Client Certificate authentication setup
       #
       cp /tmp-user-identity/* /tmp-pki-nssdb
       rm /tmp-pki-nssdb/postgresql.*
       rm /tmp-pki-nssdb/refresh_token
       rm /tmp-pki-nssdb/jre_cacerts
       chown 1000:1000 /tmp-pki-nssdb/*
       chmod 600 /tmp-pki-nssdb/*
       #
       # Private CA Certificate install
       #
       cp /cacerts/* /usr/local/share/ca-certificates
       update-ca-certificates
       cp -r /etc/ssl/certs/* /new-ssl-certs/
       #
       # Java CA Keystore install
       #
       cp -rL /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/security/* /tmp-pki-java/
       chown 1000:1000 /tmp-pki-java/*
       chmod 600 /tmp-pki-java/*
       #cp /tmp-user-identity/jre_cacerts /tmp-pki-java/cacerts

      volumeMounts:
      - name: ca-cert
        mountPath: "/cacerts"    
      - name: ssl-certs
        mountPath: "/new-ssl-certs"
      - name: auth-nssdb
        mountPath: "/tmp-pki-nssdb"
      - name: auth-postgres
        mountPath: "/tmp-pki-postgres"
      - name: auth-java
        mountPath: "/tmp-pki-java"
      - name: auth-minio
        mountPath: "/tmp-auth-minio"
      - name: user-identity
        mountPath: "/tmp-user-identity"
    - name: "configure-volume-permissions"
      image: ubuntu:16.04
      command: ["/bin/sh"]
      securityContext:
        runAsUser: 0
        allowPrivilegeEscalation: false      
      args:
      - "-c"
      - |
       set -x
       mkdir -p /vol-user/private
       mkdir -p /vol-project/data
       chown -R 1000:1000 /vol-user/*
       chown -R 1000:1000 /vol-project/*
      volumeMounts:
      - name: vol-user
        mountPath: "/vol-user"    
      - name: vol-project
        mountPath: "/vol-project"

  extraContainers: []
  uid: 1000
  fsGid: 100
  serviceAccountName:
  storage:
    type: dynamic
    extraLabels: {}
    extraVolumes: []
    extraVolumeMounts: []
    static:
      pvcName:
      subPath: '{username}'
    capacity: 1Gi
    homeMountPath: /home/jovyan
    dynamic:
      storageClass:
      pvcNameTemplate: claim-{username}{servername}
      volumeNameTemplate: volume-{username}{servername}
      storageAccessModes: [ReadWriteOnce]
  image:
    name: quay.io/ikethecoder/vdi-session-notebook
    tag: v1.3.7
    pullPolicy: IfNotPresent
    # pullSecrets:
    #   - secretName
  imagePullSecret:
    enabled: false
    registry:
    username:
    email:
    password:
  startTimeout: 300
  cpu:
    limit:
    guarantee:
  memory:
    limit:
    guarantee: 1G
  extraResource:
    limits: {}
    guarantees: {}
  cmd: jupyterhub-singleuser
  defaultUrl:
  extraPodConfig: {}