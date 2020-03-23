from flask import Blueprint, jsonify
from routes.v1.projects import projects
from routes.v1.events import events
from routes.v1.membership import membership
from routes.admin import admin
from routes.selfserve import selfserve

v1 = Blueprint('v1', 'v1')

@v1.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """
    Returns the overall API status
    :return: JSON of endpoint status
    """
    return jsonify({"status": "ok"})

class Register:
    def __init__(self, app):
        app.register_blueprint(events, url_prefix="/v1/events")
        app.register_blueprint(projects, url_prefix="/v1/projects")
        app.register_blueprint(membership, url_prefix="/v1/membership")
        app.register_blueprint(admin, url_prefix="/admin")
        app.register_blueprint(selfserve, url_prefix="/selfserve")

