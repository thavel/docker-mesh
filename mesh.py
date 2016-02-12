import logging
from nyuki import Nyuki, resource
from nyuki.capabilities import Response
from aiohttp_cors import ResourceOptions, setup as cors_setup

from webapp import Webapp
from data import DockerData


log = logging.getLogger(__name__)
WEBAPP_PATH = './webapp/'


class Mesh(Nyuki):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.webapp = Webapp(self.loop)
        self.data = DockerData()

    async def setup(self):
        # Enable cors capabilities for the api routes
        self._enable_cors()

        # Start the webapp
        web_host = self.config['webapp']['host']
        web_port = self.config['webapp']['port']
        await self.webapp.build(WEBAPP_PATH, web_host, web_port)

    def _enable_cors(self):
        app = self.api._api._app
        cors = cors_setup(app, defaults={
            "*": ResourceOptions(
                allow_credentials=True,
                expose_headers="*",
                allow_headers="*",
            )
        })
        for route in self.api._api.router.routes():
            cors.add(route)

    @resource(endpoint='/containers', version='v1')
    class Containers:

        def get(self, request):
            return Response(status=200, body=self.data.containers)


if __name__ == '__main__':
    nyuki = Mesh()
    nyuki.start()
