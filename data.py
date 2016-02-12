import logging
from uuid import getnode
from docker import Client


log = logging.getLogger(__name__)
DEFAULT_URI = 'unix://var/run/docker.sock'


class DockerData(object):

    def __init__(self, uri=DEFAULT_URI):
        self._client = Client(base_url=uri)

    @property
    def mac(self):
        imac = getnode()
        mac = ':'.join(("%012X" % imac)[i:i+2] for i in range(0, 12, 2))
        return mac.lower()

    @property
    def containers(self):
        return self._client.containers()

    @property
    def nodes(self):
        nodes = []
        for node in self.containers:
            mac = node['NetworkSettings']['Networks']['bridge']['MacAddress']
            if mac == self.mac:
                continue
            nodes.append({
                'id': node['Id'],
                'label': node['Names'][0][1:]
            })
        return nodes
