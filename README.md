# Virtual Display

## Getting Started

### Prerequisites

- Minikube (`minikube start --vm-driver=virtualbox --memory=6g --disk-size=80g` `minikube addons enable ingress` `minikube addons enable ingress-dns`)
- Keycloak
- Hashicorp Vault
- Minio (S3 implementation)

## Components

### Hub

The Hub is the entrypoint for launching virtual displays.

### Gatekeeper

The Gatekeeper is a service that sits between the Hub Proxy and a Virtual Display, performing OAuth authentication with the Hub Proxy before allowing communication with the XPRA server running on the Gatekeeper.  The XPRA server makes a secure X connection to an `xvfb` session on the particular Virtual Display.

### Identity Watcher

The Identity Watcher works in the background to refresh the user's client certificate and Minio temporary credentials.

### Init User Identity

The Init User Identity is a lightweight container for initializing the CA certificates.

### Singleuser Virtual Displays

Singleuser includes all the images that are supported as Virtual Displays

- Browser (Chrome)
- RStudio
- Notebook
- Conda Navigator (Dev Only)
- Data Curator (Dev Only)

Each are based on an `Ubuntu` operating system and adds to the image:
- X Server (xvfb)
- Fluxbox Window Manager
- Browser Client Certificate DB tools (libnss3-tools)
- Postgres Client
- AWS Client (for S3)
- Conda
