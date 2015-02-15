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
            console.log($scope.enableApi, $scope.$apply);
            $scope.enableApi = true;
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