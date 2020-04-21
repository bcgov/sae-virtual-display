import os
import urllib.parse
from urllib.parse import urlencode
from flask import Blueprint, jsonify, redirect, request, make_response
import logging
import config
from auth.auth import auth
from activity.activity import activity

log = logging.getLogger(__name__)

events = Blueprint('events', 'events')

@events.route('', methods=['POST'], strict_slashes=False)
@auth
def record_event() -> object:
    """
    Record an event
    """
    content = request.json

    missing = []
    required = ["action", "actor", "project", "success", "message"]
    for r in required:
        if r not in content:
            missing.append(r)
    if len(missing) > 0:
        activity ('received_event', '', '', 'api', False, "Event received with missing fields - %s" % str(missing))
    else:
        activity (content["action"], '', content["project"], content["actor"], content["success"], content["message"])

    return jsonify({})
