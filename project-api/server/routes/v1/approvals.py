import os
import urllib.parse
from urllib.parse import urlencode
from flask import Blueprint, jsonify, redirect, request, make_response
import logging
import config
from auth.auth import auth
from activity.activity import activity
from clients.vault import VaultClient

log = logging.getLogger(__name__)

approvals = Blueprint('approvals', 'approvals')

@approvals.route('requests', methods=['POST'], strict_slashes=False)
@auth
def record_approval_request() -> object:
    """
    Record an approval request
    """
    content = request.json

    missing = []
    required = ['commit_sha', 'requestor', 'diff', 'applications', 'approval_callback_url']
    for r in required:
        if r not in content:
            missing.append(r)
    if len(missing) > 0:
        raise Exception("Required data missing %s" % str(missing))

    conf = config.Config()

    vault_cli = VaultClient(conf.data['vault']['addr'], conf.data['vault']['token'])
    
    pkg_request = vault_cli.get_package_requests()
    if pkg_request is None:
        vault_cli.update_package_request(content)
        activity ('bbsae_apps_request', '', '', 'api', True, 'Initiated new apps approval for commit %s' % content['commit_sha'])
    else:
        vault_cli.delete_package_request()
        activity ('bbsae_apps_req_cancelled', '', '', 'api', True, 'Cancelled request for commit %s' % pkg_request['commit_sha'])

        vault_cli.update_package_request(content)
        activity ('bbsae_apps_request', '', '', 'api', True, 'Initiated new apps approval for commit %s' % content['commit_sha'])

    return jsonify({})

@approvals.route('requests', methods=['GET'], strict_slashes=False)
@auth
def get_approval_request() -> object:
    """
    Get the approval requests
    """

    conf = config.Config()

    vault_cli = VaultClient(conf.data['vault']['addr'], conf.data['vault']['token'])
    
    pkg_request = vault_cli.get_package_requests()
    if pkg_request is None:
        return jsonify([])
    else:
        return jsonify([pkg_request])

@approvals.route('requests/<string:code>', methods=['DELETE'], strict_slashes=False)
@auth
def delete_request(code: str) -> object:
    """
    Delete an approval request
    """

    conf = config.Config()

    vault_cli = VaultClient(conf.data['vault']['addr'], conf.data['vault']['token'])
    
    pkg_request = vault_cli.get_package_requests()
    if pkg_request is not None:
        if pkg_request['approve_result']['code'] == code:
            vault_cli.delete_package_request()
            return jsonify({"status":"deleted"})

    return jsonify({"status":"nochange"})
