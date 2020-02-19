import os
import requests
import urllib.parse
from urllib.parse import urlencode
from flask import Blueprint, jsonify, redirect, request, make_response
from http import HTTPStatus as HTTPStatus
import logging

log = logging.getLogger(__name__)

users = Blueprint('users', 'users')

@users.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """
    Returns the overall API status
    :return: JSON of endpoint status
    """
    return jsonify({"status": "ok"})

@users.route('/<string:userId>/<string:serverId>/verify', methods=['GET'], strict_slashes=False)
def user_server_auth(userId: str, serverId: str) -> object:
    return user_auth(userId)

@users.route('/<string:userId>/verify', methods=['GET'], strict_slashes=False)
def user_auth(userId: str) -> object:
    """
    Check if a cookie is set.  If so, then open traffic to XPRA.
    If not, redirect to HUB to authorize.
    """

    log.debug("For user %s" % userId)

    conf = config()
    log.debug("Config %s" % conf)

    # Redirect to OAUTH
    getVars = {
        'client_id': conf['client_id'],
        'redirect_uri': conf['oauth_callback'],
        'response_type': 'code',
        'state': "12345"
    }
    log.debug("Redirecting to %s/oauth2/authorize?%s" % (conf['api_url'], urllib.parse.urlencode(getVars)))
    return redirect("%s/oauth2/authorize?%s" % (conf['api_url'], urllib.parse.urlencode(getVars)), code=302)

@users.route('/<string:userId>/<string:serverId>/oauth_callback', methods=['GET'], strict_slashes=False)
def oauth_server_callback(userId: str, serverId: str) -> object:
    return oauth_callback(userId)
    
@users.route('/<string:userId>/oauth_callback', methods=['GET'], strict_slashes=False)
def oauth_callback(userId: str) -> object:
    """
    Should receive a 'code' from HUB.  Use it to get a token from HUB to complete OAUTH handshake.
    Then open traffic to XPRA.

    Use code to call oauth2/token.  If good, set cookie 'jupyterhub-user-USER' and clear the 'jupyterhub-user-USER-oauth-state' cookie.  Turn on proxy traffic to XPRA.
    """
    code = request.args.get('code')

    log.debug("Got code %s" % code)

    conf = config()

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    params = {
        'client_id': conf['client_id'],
        'client_secret': conf['api_token'],
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': conf['oauth_callback']
    }

    url = "%s/oauth2/token" % (conf['api_url'])

    log.debug("POST TO %s" % url)
    log.debug("POST PAYLOAD %s" % params)
    response = requests.post(url, data=urlencode(params).encode('utf8'), headers=headers)
    log.debug("Got response")
    log.debug("Got response TEXT %s" % response.text)
    log.debug("Got response JSON %s" % response.json())
    tok = response.json()

    log.debug("Request INFO %s" % request.url_root)
    log.debug("Request INFO %s" % request.host)
    log.debug("Request INFO %s" % request.host_url)

    log.debug("REDIRECT TO %s%s" % (conf['external_host'], conf['service_prefix']))

    response = make_response(redirect("%s%s" % (conf['external_host'], conf['service_prefix'])))
    response.set_cookie('virtual-display-session', path=conf['service_prefix'], value=tok['access_token'])
    return response

def config():
    return {
        'external_host': os.environ['EXTERNAL_HOST'],
        'base_url': os.environ['JUPYTERHUB_BASE_URL'],
        'client_id': os.environ['JUPYTERHUB_CLIENT_ID'],
        'api_token': os.environ['JUPYTERHUB_API_TOKEN'],
        'api_url': os.environ['JHUB_API'],
        'service_prefix': os.environ['JUPYTERHUB_SERVICE_PREFIX'],
        'oauth_callback': os.environ['JUPYTERHUB_OAUTH_CALLBACK_URL']
    }

class Register:
    def __init__(self, app):
        app.register_blueprint(users, url_prefix="/user")
