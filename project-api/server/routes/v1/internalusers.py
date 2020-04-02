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

internalusers = Blueprint('internalusers', 'internalusers')

conf = config.Config()

keycloak_cli = KeycloakClient(conf.data['kc_internal']['url'], conf.data['kc_internal']['realm'], conf.data['kc_internal']['username'], conf.data['kc_internal']['password'])

@internalusers.route('/<string:username>', methods=['PUT'], strict_slashes=False)
@auth
def add_user(username: str) -> object:
    """
    Add user if it does not exist
    """
    content = request.json

    groups = content['groups']

    user_attributes = {}
    if "user_attributes" in content:
        user_attributes = content['user_attributes']

    try:
        keycloak_cli.add_user(username, content['email'], content['first_name'], content['last_name'], user_attributes)
        for group in groups:
            keycloak_cli.add_group(group)
            keycloak_cli.join_group(group, username)

        activity ('add_user', '', '', 'api', True, "User %s Added" % username)
    except BaseException as ex:
        activity ('add_user', '', '', 'api', False, "Failed - failed to add user %s." % username)
        raise ex

    return jsonify({"status": "ok"})

@internalusers.route('/<string:username>', methods=['DELETE'], strict_slashes=False)
@auth
def delete_user(username: str) -> object:
    """
    Delete user if exists
    """

    try:
        keycloak_cli.del_user(username)
        activity ('delete_user', '', '', 'api', True, "User %s Deleted" % username)
    except BaseException as ex:
        activity ('delete_user', '', '', 'api', False, "Failed - failed to delete user %s." % username)
        raise ex

    return jsonify({"status": "ok"})