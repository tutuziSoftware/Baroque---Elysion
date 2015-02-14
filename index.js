var baroque = angular.module('Baroque', []);

baroque.controller("main", ['$scope', '$http', function($scope, $http){
    var api = new Twitter4FxOS($http, function(call){
        if(call == Twitter4FxOS.prototype.NG){
            api.executeOAuth().then(function(){
                location.reload();
            }).catch(function(){
                location.reload();
            });
        }else{
            $scope.isApi = true;
        }
    });

    $scope.fetchAccessToken = function(){
        api.fetchAccessToken($scope.pin).then(function(){
            console.log("API standing by");
        }).catch(function(){
            console.log("");
        });
    };
}]);