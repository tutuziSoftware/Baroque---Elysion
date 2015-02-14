var baroque = angular.module('Baroque', []);

baroque.controller("main", ['$scope', '$http', function($scope, $http){
    var api = new Twitter4FxOS($http);
    api.executeOAuth().then(function(){
        api.getHomeTimeline(function(){
            console.log("api.getHomeTimeline");
        });
    }).catch(function(){
        $scope.accessToken = false;
    });
}]);