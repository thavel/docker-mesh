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

function Network(elementId) {
    this.container = document.getElementById(elementId);
    this.nodes = new vis.DataSet();
    this.edges = new vis.DataSet();
    this.vis = undefined;
    this.options = {
        nodes : {
            shape: 'dot',
            size: 10
        }
    };

}

Network.prototype.build = function() {
    var data = {
        nodes: this.nodes,
        edges: this.edges
    };
    this.vis = new vis.Network(this.container, data, this.options);
};

/*
 * Main controller
 */

app.controller("meshController", function($scope, $location, $http) {
    var api = $location.protocol() + "://" + $location.host() + ":9201";
    var network = new Network("network");

    $http.get(api + "/v1/nodes")
    .then(function(res) {
        network.nodes.add(res.data);
        network.build();
    });

    $http.get(api + "/v1/edges")
    .then(function(res) {
        network.edges.add(res.data);
    });

});
