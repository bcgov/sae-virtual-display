from flask import Blueprint, jsonify, session, request, redirect, url_for, render_template
from flask_dance.consumer import OAuth2ConsumerBlueprint
import logging
import json
import oauthlib
import datetime
import traceback
import urllib.parse
from datetime import timezone
from activity.activity import activity

from config import Config
import os

log = logging.getLogger(__name__)

conf = Config().data

client_id = conf['oauth']['client_id']
client_secret = conf['oauth']['client_secret']
oauth_url = conf['oauth']['url']
oauth_realm = conf['oauth']['realm']
hub_redirect_url = conf['hub_redirect_url']

selfserve = OAuth2ConsumerBlueprint(
    "kc", 'selfserve',
    client_id=client_id,
    client_secret=client_secret,
    base_url="%s/auth/realms/%s/protocol/openid-connect/" % (oauth_url, oauth_realm),
    token_url="%s/auth/realms/%s/protocol/openid-connect/token" % (oauth_url, oauth_realm),
    authorization_url="%s/auth/realms/%s/protocol/openid-connect/auth" % (oauth_url, oauth_realm),
    redirect_to="kc._selfserve"
)

@selfserve.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("kc.login"))

@selfserve.route("/")
def _selfserve():
    try:
        if not selfserve.session.authorized:
            return redirect(url_for("kc.login"))
        resp = selfserve.session.get("/auth/realms/%s/protocol/openid-connect/userinfo" % oauth_realm)
        assert resp.ok

        js = resp.json()
        if 'groups' in js:
            groups = js['groups']
        else:
            groups = []
        session['groups'] = groups
        session['policy'] = resp.json()['policy']
        session['username'] = resp.json()['preferred_username']
        session['jwt_info'] = json.dumps(resp.json(), indent=4, sort_keys=True)

        activity ('access', '', '', session['username'], True, "Access Granted")

        return redirect(url_for("kc.main"))
    except oauthlib.oauth2.rfc6749.errors.TokenExpiredError as ex:
        return redirect(url_for("kc.login"))

@selfserve.route("/main")
def main():
    if not selfserve.session.authorized:
        return redirect(url_for("kc.login"))

    if not 'groups' in session:
        return render_template('error.html', message = "Access Denied", logout_url=logout_url())

    message = None

    if len(session['groups']) == 0:
        message = "You currently do not have any projects assigned to your account.  Contact your project administrator to get your account added to the project."

    is_project_assigned = session['policy'] != 'no-access'

    return render_template('selfserve/index.html', hub_redirect_url=hub_redirect_url, is_project_assigned=is_project_assigned, message=message, logout_url=logout_url(), jwt_info=session['jwt_info'], username=session['username'], tab={"registration":"show active"})

@selfserve.route('/groups',
           methods=['GET'], strict_slashes=False)
def view_groups() -> object:
    if not 'groups' in session:
        return render_template('error.html', message = "Access Denied")

    return json.dumps(session['groups'])

def do_render_template(**args):

    if 'repository' in args['data']:
        team = get_sae_project(session['groups'])
        actor = session['username']
        activity (args['action'], args['data']['repository'], team, actor, args['success'], args['message'])
    linked_repos = get_linked_repos()
    return render_template('index.html', **args, repo_list=linked_repos, unlinked_repo_list=get_unlinked_repos(), noshares_repo_list=get_noshares_repos(linked_repos), groups=session['groups'], project=get_sae_project(session['groups']))

def logout_url():
    return "%s/auth/realms/%s/protocol/openid-connect/logout?%s" % (oauth_url, oauth_realm, urllib.parse.urlencode({'redirect_uri':url_for("kc.logout", _external=True)}) )

