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

    response = client.assume_role_with_web_identity(
        RoleArn='00000-00000-00000-00000', # Not applicable for Minio
        RoleSessionName='0000', # Not applicable for Minio
        WebIdentityToken=jwt_token
    )
    return response['Credentials']
