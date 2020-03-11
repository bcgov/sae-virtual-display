import os
import boto3

def assume_role_with_web_identity (config, jwt_token):
    session = boto3.session.Session()

    client = session.client(
        service_name='sts',
        aws_access_key_id=config['aws_access_key_id'],
        aws_secret_access_key=config['aws_secret_access_key'],        
        endpoint_url=config['endpoint_url']
    )

    print(client)
    response = client.assume_role_with_web_identity(
        RoleArn='00000-00000-00000-00000', # Not applicable for Minio
        RoleSessionName='0000', # Not applicable for Minio
        WebIdentityToken=jwt_token
    )
    print(response)
    return response['Credentials']


# jwt_token = os.environ['JWT_TOKEN']
# creds = assume_role_with_web_identity(jwt_token)

# print(creds['Expiration'])
# print(creds["AccessKeyId"])
# print(creds["SecretAccessKey"])
# print(creds["SessionToken"])
