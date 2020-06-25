

# Terraform-Based deployment

## Prerequisites

### Preparing the keystore

```
mkdir -p _tmp
keytool -genkey -alias 1 \
    -keyalg RSA -keystore _tmp/keystore.jks \
    -dname "L=Vancouver, S=British Columbia, C=CA" \
    -storetype JKS -deststoretype JKS \
    -storepass password -keypass password

keytool -export -alias 1 -storepass password \
 -file _tmp/kc.cer -storetype JKS \
 -keystore _tmp/keystore.jks

keytool -import -v -noprompt -trustcacerts \
-alias 1 \
-file _tmp/kc.cer \
-storetype JKS -deststoretype JKS \
-keystore _tmp/truststore.jks \
-keypass password -storepass password

```

## Terraform Apply

Run the following commands:

```
terraform init

terraform apply -auto-approve

```

## Update manual DNS

From the minikube dashboard, find the `Ingress` details for the `vdi` namespace.  Make note of the IP address under "Endpoints".

Update `/etc/hosts`:

```
192.168.99.101 minio.demo vault.demo hub.demo auth.demo vdi-admin.demo selfreg.demo
```

## Vault Setup

Terraform does not support dynamic config of a Provider, so once Vault is deployed, we need to run a separate apply for configuring Vault.

```
(cd modules/vault-vdi-setup; terraform12 init; terraform12 apply)
```

If this step fails because Keycloak is not up yet (oidc discovery), then you may need to delete the `jwt` mount:

```
curl -v https://vault.demo/v1/sys/auth/jwt -H "X-Vault-Token: root" --cacert _tmp/ca.crt -X DELETE
```

## Initialize the available applications

```
echo "
kind: ConfigMap
apiVersion: v1
metadata:
  name: vdi-applications
data:
  applications.json: '[{\"name\":\"browser\",\"label\":\"Google Chrome Browser\",\"logo\":\"browser\",\"container\":\"quay.io/ikethecoder/vdi-session-browser:v1.3.7\"},{\"name\":\"rstudio\",\"label\":\"RStudio\",\"logo\":\"rstudio\",\"container\":\"quay.io/ikethecoder/vdi-session-rstudio:feature-metadata\"}]'
" > cmap.yaml

kubectl apply --namespace vdi -f cmap.yaml

rm cmap.yaml
```

## Create system users in Keycloak `bbsae` and `sae` realms

Go to: https://auth.demo

View the `_tmp/readme` file to get credential details for Keycloak.

Create a user `realm-admin` with password `realm-admin` for the two realms.

Add a role mapping: `Client Roles`: `realm-management`.  Add `manage-users`.

## Enable the cert auth flow for `sae`

From `auth.demo`, go to the `sae` realm.

Update `Authentication` : `Bindings` : `Browser Flow` to "browserclientcert".

## Enable a project

```
export TOKEN=s3cret

export PROJECT=00-p1
curl --cacert _tmp/ca.crt \
  https://vdi-admin.demo/v1/projects/$PROJECT \
  -H "x-api-key: $TOKEN" \
  -X POST
```

## Create users in keycloak

Go to: https://auth.demo

In the `bbsae` realm, create a user with the following additional attributes:

```
policy  : 00-p1-s3-access
project : 00-p1
```


## Log into hub and spin up a virtual display

Go to https://hub.demo


## Further enhancements

1) Add identity providers to the `bbsae` realm
1) Integrate Spark
1) Integrate NiFi for getting data into the S3 buckets
1) Add group selector and theme to Keycloak
1) Integrate self-serve managing R/Python libraries
