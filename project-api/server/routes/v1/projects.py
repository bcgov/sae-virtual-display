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
from clients.vault import VaultClient
from clients.minio import MinioClient
from activity.activity import activity

log = logging.getLogger(__name__)

projects = Blueprint('projects', 'projects')

conf = config.Config()

vault_cli = VaultClient(conf.data['vault']['addr'], conf.data['vault']['token'])
minio_cli = MinioClient(conf.data['minio']['addr'], conf.data['minio']['access_key'], conf.data['minio']['secret_key'])

@projects.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """
    Returns the overall API status
    :return: JSON of endpoint status
    """
    return jsonify({"status": "ok"})

@projects.route('/', methods=['GET'], strict_slashes=False)
@auth
def project_list() -> object:
    """
    Returns the list of projects that are enabled
    """
    return jsonify(vault=vault_cli.list_all(), minio=minio_cli.list_all())

@projects.route('/<string:projectId>', methods=['POST'], strict_slashes=False)
@auth
def project_post(projectId: str) -> object:
    """
    Enables a project
    """
    try:
        minio_cli.add_project(projectId)
        vault_cli.add_project(projectId)

        activity ('enable_project', '', projectId, 'api', True, "Project Enabled")
    except BaseException as ex:
        activity ('enable_project', '', projectId, 'api', False, "Failed - project partially enabled")
        raise ex

    return jsonify({"status": "ok"})


@projects.route('/<string:projectId>', methods=['GET'], strict_slashes=False)
@auth
def project_get(projectId: str) -> object:
    """
    Returns the details about the project
    """

    return jsonify(vault=vault_cli.get_project(projectId), minio=minio_cli.get_project(projectId))

@projects.route('/<string:projectId>', methods=['DELETE'], strict_slashes=False)
@auth
def project_delete(projectId: str) -> object:
    """
    Deletes the project access
    """
    try:
        minio_cli.del_project(projectId)
        vault_cli.del_project(projectId)

        purge = request.args.get('purge')
        log.debug("Purge? %s" % purge)
        if purge == "yes":
            minio_cli.del_buckets(projectId)
        activity ('disable_project', '', projectId, 'api', True, "Project Disabled")
    except BaseException as ex:
        activity ('disable_project', '', projectId, 'api', False, "Failed - project partially disabled")
        raise ex

    return jsonify({"status": "ok"})
