var baroque = angular.module('Baroque', []);

baroque.controller("main", ['$scope', '$http', function($scope, $http){
    var api = new Twitter4FxOS($http, function(call){
        if(call == Twitter4FxOS.prototype.NG){
            console.log("");
            $scope.enableApi = false;
            $scope.$apply();
            api.executeOAuth().then(function(){
                console.log("");
                //location.reload();
            }).catch(function(){
                console.log("");
                //location.reload();
            });
        }else{
            $scope.enableApi = true;

            //TODO ここでAPIを叩く
            api.getHomeTimeline().then(function(){

            }).catch(function(){

            });

            $scope.$apply();
        }
    });

    $scope.fetchAccessToken = function(){
        console.log($scope.pin);
        api.fetchAccessToken($scope.pin).then(function(){
            console.log("API standing by");
        }).catch(function(){
            console.log("");
        });
    };
}]);