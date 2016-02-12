import logging
from docker import Client


log = logging.getLogger(__name__)
DEFAULT_URI = 'unix://var/run/docker.sock'


class DockerApi(object):

    def __init__(self, uri=DEFAULT_URI):
        self._client = Client(base_url=uri)

    @property
    def containers(self):
        return self._client.containers()
