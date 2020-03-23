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

client_id = conf['keycloak']['client_id']
client_secret = conf['keycloak']['client_secret']
oauth_url = conf['keycloak']['url']
oauth_realm = conf['keycloak']['realm']

admin = OAuth2ConsumerBlueprint(
    "keycloak", 'admin',
    client_id=client_id,
    client_secret=client_secret,
    base_url="%s/auth/realms/%s/protocol/openid-connect/" % (oauth_url, oauth_realm),
    token_url="%s/auth/realms/%s/protocol/openid-connect/token" % (oauth_url, oauth_realm),
    authorization_url="%s/auth/realms/%s/protocol/openid-connect/auth" % (oauth_url, oauth_realm),
    redirect_to="keycloak._admin"
)

@admin.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("keycloak.login"))

@admin.route("/")
def _admin():
    try:
        if not admin.session.authorized:
            return redirect(url_for("keycloak.login"))
        resp = admin.session.get("/auth/realms/%s/protocol/openid-connect/userinfo" % oauth_realm)
        assert resp.ok

        groups = resp.json()['groups']

        log.info("Checking? %s %s" % (conf['keycloak']['admin_group'], str(groups)))

        if conf['keycloak']['admin_group'] not in groups:
            message = "Access Denied - User does not belong to the administration group."
            activity ('access', '', '', resp.json()['preferred_username'], False, message)
            del admin.token
            return render_template('error.html', message = message, logout_url=admin_logout_url())

        session['groups'] = groups
        session['username'] = resp.json()['preferred_username']

        activity ('access', '', '', session['username'], True, "Access Granted")

        return redirect(url_for("keycloak.main"))
    except oauthlib.oauth2.rfc6749.errors.TokenExpiredError as ex:
        return redirect(url_for("keycloak.login"))

@admin.route("/main")
def main():
    if not admin.session.authorized:
        return redirect(url_for("keycloak.login"))

    if not 'groups' in session:
        return render_template('error.html', message = "Access Denied", logout_url=admin_logout_url())

    message = False

    return render_template('index.html', message=message, logout_url=admin_logout_url(), username=session['username'], tab={"activity":"show active"})


@admin.route('/activity',
           methods=['GET'], strict_slashes=False)
def view_activity() -> object:
    if not 'groups' in session:
        return render_template('error.html', message = "Access Denied")

    with open('/audit/activity.log', 'r') as f:
        content = f.readlines()
    content = [json.loads(x.strip()) for x in content] 

    content.reverse()

    return json.dumps(content)


def do_render_template(**args):

    if 'repository' in args['data']:
        team = get_sae_project(session['groups'])
        actor = session['username']
        activity (args['action'], args['data']['repository'], team, actor, args['success'], args['message'])
    linked_repos = get_linked_repos()
    return render_template('index.html', **args, repo_list=linked_repos, unlinked_repo_list=get_unlinked_repos(), noshares_repo_list=get_noshares_repos(linked_repos), groups=session['groups'], project=get_sae_project(session['groups']))


def admin_logout_url():
    return "%s/auth/realms/%s/protocol/openid-connect/logout?%s" % (oauth_url, oauth_realm, urllib.parse.urlencode({'redirect_uri':url_for("keycloak.logout", _external=True)}) )

