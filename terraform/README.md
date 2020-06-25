

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


## Apply

Create a terraform.tfvars file (see terraform.tfvars.example):

Run the following commands:

```
terraform init

echo "hostRootPath=\"`pwd`/_tmp\"" > terraform.hostpath.auto.tfvars

terraform plan

terraform apply -auto-approve

```

## Vault Setup

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
  applications.json: '[{\"name\":\"browser\",\"label\":\"Google Chrome Browser\",\"logo\":\"browser\",\"container\":\"quay.io/ikethecoder/vdi-session-browser:v1.3.7\"}]'
" > cmap.yaml

kubectl apply --namespace vdi -f cmap.yaml

rm cmap.yaml
```

## Create system users in Keycloak `bbsae` and `sae` realms

Go to: https://auth.demo

View the `_tmp/readme` file to get credential details for Keycloak.

Create a user `realm-admin` with password `realm-admin` for the two realms.

Add a role mapping: `Client Roles`: `realm-management`.  Add `manage-users`.

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
