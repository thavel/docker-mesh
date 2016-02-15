import re
import logging
from uuid import getnode
from docker import Client


log = logging.getLogger(__name__)
DEFAULT_URI = 'unix://var/run/docker.sock'


class DockerData(object):

    def __init__(self, uri=DEFAULT_URI, ignore=list()):
        self._client = Client(base_url=uri)
        self._ignore = [re.compile(regex) for regex in ignore]

    @staticmethod
    def _get_mac(cont):
        """
        Get the MAC address from a container.
        """
        try:
            return cont['NetworkSettings']['Networks']['bridge']['MacAddress']
        except KeyError:
            return None

    @staticmethod
    def _get_name(cont):
        """
        Get the name of a container.
        """
        return cont['Names'][0][1:]

    @classmethod
    def _find(cls, name, into):
        """
        Find a container id according to its name.
        """
        for cont in into:
            if cls._get_name(cont) == name:
                return cont
        return None

    @classmethod
    def _filter(cls, regex, into):
        """
        Remove matching regex in a list of containers.
        """
        for cont in into:
            if regex.match(cont['Image']):
                into.remove(cont)
        return into

    @property
    def mac(self):
        """
        Get the MAC address of the current container.
        """
        imac = getnode()
        mac = ':'.join(("%012X" % imac)[i:i+2] for i in range(0, 12, 2))
        return mac.lower()

    @property
    def containers(self):
        """
        Get a raw list of containers.
        """
        # Let's assume ignore regex are targeting docker images only.
        containers = self._client.containers()
        for regex in self._ignore:
            self._filter(regex, containers)
        return containers

    def nodes(self, image=True):
        """
        Get a usable list of nodes (by container's name or docker image).
        """
        mac = self.mac
        nodes = []
        for cont in self.containers:
            if self._get_mac(cont) == mac:
                continue
            nodes.append({
                'id': cont['Id'],
                'label': cont['Image'] if image else self._get_name(cont)
            })
        return nodes

    def edges(self, links=True, volumes_from=True):
        """
        Get a usable list of edges between nodes (according to docker links).
        """
        mac = self.mac
        edges = []
        containers = self.containers

        # Links
        for cont in containers:
            # Skip conditions
            if self._get_mac(cont) == mac:
                continue
            if len(cont['Names']) <= 1:
                continue

            # Build edges from docker links
            previous = None
            for link in cont['Names'][1:]:
                name = link.split('/')[1]
                if name == previous:
                    continue
                previous = name

                dest = self._find(name, containers)
                if not dest:
                    continue

                edges.append({
                    'from': cont['Id'],
                    'to': dest['Id']
                })

        return edges
