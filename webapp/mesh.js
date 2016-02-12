/*
 * Angular application
 */

var app = angular.module("mesh", ["ngMaterial", "ngMdIcons"]);

app.config(["$httpProvider", function ($httpProvider) {
    // Disable cross origin OPTIONS requests
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.withCredentials = true;
}]);

/*
 * Models
 */

function Network(elementId) {
    this._container = document.getElementById(elementId);
    this._nodes = new vis.DataSet();
    this._edges = new vis.DataSet();
    this._options = {
        nodes : {
            shape: "dot",
            size: 20,
            borderWidth: 3
        },
        edges: {
            smooth: {
                roundness: 0.9
            }
        }
    };

}

Network.prototype.build = function() {
    var data = {
        nodes: this._nodes,
        edges: this._edges
    };
    this._vis = new vis.Network(this._container, data, this._options);
};

Network.prototype.addNodes = function(nodes) {
    _.forEach(nodes, function(node) {
        node.color = {background: "#cccccc", border: "#1A78D5"};
        node.font = {size: 12, color: "white"};
    });
    this._nodes.add(nodes);
};

Network.prototype.addEdges = function(edges) {
    _.forEach(edges, function(edge) {
        edge.color = {color: "#cccccc"};
    });
    this._edges.add(edges);
};

/*
 * Main controller
 */

app.controller("meshController", function($scope, $location, $http) {
    var api = $location.protocol() + "://" + $location.host() + ":9201";
    var network = new Network("network");

    $http.get(api + "/v1/nodes")
    .then(function(res) {
        network.addNodes(res.data);
        network.build();
    });

    $http.get(api + "/v1/edges")
    .then(function(res) {
        network.addEdges(res.data);
    });

});
