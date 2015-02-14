var baroque = angular.module('Baroque', []);

baroque.controller("main", function($scope, $http){
    var api = new Twitter4FxOS($http);
    api.checkOAuth().then(function(){
        $scope.accessToken = true;
    }).catch(function(){
        $scope.accessToken = false;
    });
});