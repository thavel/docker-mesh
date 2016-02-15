# docker-mesh

Draw a comprehensive graph of your docker containers.

This application is embedded into a single docker container, and show only network [links](https://docs.docker.com/engine/userguide/networking/default_network/dockerlinks/) between your platform architecture.

![docker-mesh example](https://raw.githubusercontent.com/thavel/docker-mesh/master/example.png)

## Requirements

* [docker](https://github.com/docker/docker) (all platform)
* [docker-compose](https://github.com/docker/compose) (optionally)


## How to use

### With docker-compose

Just `docker-compose mesh` in the project folder.

### With docker

Either pull or build the image with:
```bash
docker pull thavel/docker-mesh:head
docker build -t thavel/docker-mesh:head .
```
And then launch it:
```bash
docker run --rm \
  -p 9200:8080 -p 9201:8081 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  thavel/docker-mesh:head
```


## Web interface

The web interface is available through `http://localhost:9200` (replace localhost with the IP of your docker-machine if you're running Docker under OSX).


## Third party

*docker-mesh* has a RESTful API available through HTTP via the port 9201.

Available routes are:
* `GET` on `/v1/containers`
* `GET` on `/v1/nodes`
* `GET` on `/v1/edges`


## Under the hood

This application has been written using Python 3.5 and the following libraries:
* [nyuki](https://github.com/optiflows/nyuki)
* [docker-py](https://github.com/docker/docker-py)
* [vis.js](https://github.com/almende/vis)
* [aiohttp_cors](https://github.com/aio-libs/aiohttp_cors)


## Upcoming improvements

* Show `volumes_from` and `volumes` dependencies between containers.
* Show forwarded `ports` of your containers.
* Display basic container information.
* A better and configurable user interface (with filters and commands).
* An improved backend API.
* Versioned and hosted docker-mesh images on [Dockerhub](https://hub.docker.com/u/thavel/).
