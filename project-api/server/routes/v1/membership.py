import os
import requests
import urllib.parse
from urllib.parse import urlencode
from flask import Blueprint, jsonify, redirect, request, make_response
from http import HTTPStatus as HTTPStatus
import logging
import random
import string
import config
from auth.auth import auth
from clients.keycloak import KeycloakClient
from clients.vault import VaultClient
from clients.minio import MinioClient
from activity.activity import activity

log = logging.getLogger(__name__)

membership = Blueprint('membership', 'membership')

conf = config.Config()

vault_cli = VaultClient(conf.data['vault']['addr'], conf.data['vault']['token'])
minio_cli = MinioClient(conf.data['minio']['addr'], conf.data['minio']['access_key'], conf.data['minio']['secret_key'])
keycloak_cli = KeycloakClient(conf.data['keycloak']['url'], conf.data['keycloak']['realm'], conf.data['keycloak']['username'], conf.data['keycloak']['password'])

@membership.route('/<string:projectId>/<string:username>', methods=['PUT'], strict_slashes=False)
@auth
def join(projectId: str, username: str) -> object:
    """
    Join project
    """
    try:
        keycloak_cli.join_project(projectId, username)

        activity ('join_project', '', projectId, 'api', True, "User %s Joined" % username)
    except BaseException as ex:
        activity ('join_project', '', projectId, 'api', False, "Failed - failed to join user %s." % username)
        raise ex

    return jsonify({"status": "ok"})

@membership.route('/<string:projectId>/<string:username>', methods=['DELETE'], strict_slashes=False)
@auth
def leave(projectId: str, username: str) -> object:
    """
    Leave project
    """
    try:
        keycloak_cli.leave_project(projectId, username)

        activity ('leave_project', '', projectId, 'api', True, "User %s Removed" % username)
    except BaseException as ex:
        activity ('leave_project', '', projectId, 'api', False, "Failed - failed to remove user %s." % username)
        raise ex

    return jsonify({"status": "ok"})
