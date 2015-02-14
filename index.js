var baroque = angular.module('Baroque', []);

baroque.controller("main", function($scope, $http){
    var api = new Twitter4FxOS($http);
    api.executeOAuth().then(function(){
        console.log("access");
    }).catch(function(){
        $scope.accessToken = false;
    });
});