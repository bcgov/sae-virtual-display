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
from timeit import default_timer as timer
import config
import sys
from app import create_app

#from proxy import Proxy
log = logging.getLogger(__name__)


conf = config.Config()

def main(port: int = conf.data['apiPort']) -> object:
    """
    Run the Server
    :param port: Port number
    :return:
    """
    logLevel = conf.data['logLevel'].upper()

    loggingLevel = getattr(logging, logLevel)

    logging.basicConfig(level=loggingLevel,
                        format='%(asctime)s - %(levelname)s - %(message)s')

    log.info('Logging level %s' % logLevel)

    if sys.version_info[0] < 3:
        log.error('Server requires Python 3')
        return

    app = create_app()

    log.info('Loading server...')
    load_start = timer()
    http = WSGIServer(('', port), app.wsgi_app)
    load_end = timer()
    log.info('Load time: %s', str(load_end - load_start))

    log.info('Serving on port %s', str(port))
    http.serve_forever()
    log.info('Server terminated!')


if __name__ == '__main__':
    main()

