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
    this.options = {};
    this.nodes = undefined;
    this.edges = undefined;
    this.vis = undefined;
}

Network.prototype.build = function() {
    var data = {
        nodes: this.nodes
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
        network.nodes = new vis.DataSet(res.data);
        network.build();
    })
    .catch(function(err) {

    });

});
