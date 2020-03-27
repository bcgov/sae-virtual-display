

import base64

aws_credentials = """
[default]
aws_access_key_id={key}
aws_secret_access_key={secret}
aws_session_token={token}
""".format(
    key="1",
    secret="2",
    token="3"
)

print(aws_credentials)
print(base64.b64encode(aws_credentials.encode('utf-8')).decode('utf-8'))
