# Getting Started

https://github.com/jupyterhub/jupyterhub/blob/0.8.1/jupyterhub/services/auth.py

```
pip install -r requirements.txt

        'base_url': os.environ['JUPYTERHUB_BASE_URL'],
        'client_id': os.environ['JUPYTERHUB_CLIENT_ID'],
        'api_token': os.environ['JUPYTERHUB_API_TOKEN'],
        'api_url': os.environ['JUPYTERHUB_API_URL'],
        'oauth_callback': os.environ['JUPYTERHUB_OAUTH_CALLBACK_URL']

JUPYTERHUB_BASE_URL="/" \
JUPYTERHUB_CLIENT_ID="12-12-12-12" \
JUPYTERHUB_API_TOKEN="1234" \
JUPYTERHUB_API_URL="http://jhub.local/hub/api" \
JUPYTERHUB_OAUTH_CALLBACK_URL="/user/foo-bar-user/oauth_callback" \
python3 ./gatekeeper.py
```