from traitlets import Unicode

from jupyterhub.auth import Authenticator

from tornado import gen


class DummyAuthenticator(Authenticator):
    password = Unicode(
        None,
        allow_none=True,
        config=True,
        help="""
        Set a global password for all users wanting to log in.
        This allows users with any username to log in with the same static password.
        """
    )

    @gen.coroutine
    def authenticate(self, handler, data):
        return {
            'name': data['username'],
            'auth_state': {
                'access_token': 'dummy_access_token',
                'refresh_token': 'dummy_refresh_token',
                'oauth_user': {
                    'id': data['username'],
                    'groups': [
                        'project_1',
                        'project_2'
                    ]
                },
                'scope': 'offline_access',
            }
        }        
