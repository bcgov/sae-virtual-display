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
from users import Register
#from proxy import Proxy
log = logging.getLogger(__name__)


def create_app(test_config=None):

    app = Flask(__name__)

    conf = config.Config()
    if ('conf' in conf):
        if test_config is None:
            app.config.update(conf.conf.data)
        else:
            # load the test config if passed in
            app.config.update(conf.conf.data)
            app.config.update(test_config)

    # logLevel = config['logLevel'].upper()

    loggingLevel = getattr(logging, 'DEBUG')

    logging.basicConfig(level=loggingLevel,
                        format='%(asctime)s - %(levelname)s - %(message)s')

    ##Routes##
    Register(app)
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

def wsgi_server():
    port = 8886
    app = create_app()
    http = WSGIServer(('', port), app.wsgi_app)

    log.info('Serving on port %s', str(port))
    try:
        http.serve_forever()
    except KeyboardInterrupt:
        print('Keyboard interrupt received: EXITING')
    finally:
        http.close() 
    log.info('Server terminated!')

#_proxy = Proxy(create_app())

#def handler(signum, frame):
#    print('Signal handler called with signal', signum)
    #_proxy.stop()

# Set the signal handler and a 5-second alarm
#signal.signal(signal.SIGINT, handler)

#_proxy.run()

wsgi_server()
