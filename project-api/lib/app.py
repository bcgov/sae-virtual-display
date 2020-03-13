from gevent import monkey

# Patch Sockets to make requests asynchronous
monkey.patch_all()

from gevent.pywsgi import WSGIServer
from http import HTTPStatus as HTTPStatus
import logging
import config
import threading
import os
import signal
from flask import Flask, g, jsonify, make_response, url_for, Response
from flask_compress import Compress
from api import ProjectApi
#from proxy import Proxy
log = logging.getLogger(__name__)


def create_app(test_config=None):

    app = Flask(__name__)

    conf = config.Config()
    if test_config is None:
        app.config.update(conf.data)
    else:
        # load the test config if passed in
        app.config.update(conf.data)
        app.config.update(test_config)

    ##Routes##
    ProjectApi(app)
    Compress(app)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    @app.before_request
    def before_request():
        from timeit import default_timer as timer

        g.request_start_time = timer()
        g.request_time = lambda: "%s" % (timer() - g.request_start_time)
        resp = Response()
        resp.headers['Content-Type'] = ["application/json"]

    @app.after_request
    def after_request(response):
        log.debug('Rendered in %ss', g.request_time())
        return response

    @app.errorhandler(HTTPStatus.NOT_FOUND)
    def not_found(param):
        content = jsonify({
            "error": "Not Found",
            "code": HTTPStatus.NOT_FOUND
        })
        return make_response(content, HTTPStatus.NOT_FOUND)


    @app.errorhandler(HTTPStatus.INTERNAL_SERVER_ERROR)
    def internal_server_error(error):
        content = jsonify({
            "error": "{error}",
            "code": HTTPStatus.INTERNAL_SERVER_ERROR
        })
        return make_response(content, HTTPStatus.INTERNAL_SERVER_ERROR)

    return app

