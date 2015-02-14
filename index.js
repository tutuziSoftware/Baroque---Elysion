var baroque = angular.module('Baroque', []);

baroque.controller("main", function($scope){
    var api = new Twitter4FxOS;

    $scope.startOAuth = function(){
        api.checkOAuth().then(function(){
            $scope.accessToken = true;
        }).catch(function(){
            $scope.accessToken = false;
        });
    };
});