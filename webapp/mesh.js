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
 * Main controller
 */

app.controller("meshController", function($scope) {
});
