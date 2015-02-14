var Twitter4FxOS = (function(){
    function Twitter4FxOS($http){
        this._network = new Network($http);
        this._storage = new Storage("accessToken");
    };

    Twitter4FxOS.prototype.checkOAuth = function(){
        console.log("Twitter4FxOS.prototype.checkOAuth");
        return new Promise(function(resolve, reject){
            this._storage.getItem().then(function(accessToken){
                resolve(accessToken);
            }).catch(function(){
                console.log("catch");
                this._network.startOAuth().then(function(){

                }).catch(function(){

                });
            }.bind(this));
        }.bind(this));
    };

    /**
     * 通信系
     * @constructor
     */
    function Network($http){
        this._$http = $http;
    };

    Network.prototype.startOAuth = function(){
        return new Promise(function(resolve, reject){
            const CONSUMER_KEY = "x1Z4hAckN1a5LTQKouGQ";
            const CONSUMER_SECRET = "2FXyGxHDh856bZXTO5dhDvaFl3SqQp65EQZItT6k";
            const basic = btoa(encodeURIComponent(CONSUMER_KEY)+":"+encodeURIComponent(CONSUMER_SECRET));

            console.log(this);

            this._$http({
                url:"https://api.twitter.com/oauth2/token",
                method:"POST",
                data:{
                    grant_type:'client_credentials'
                },
                headers: {
                    Authorization: "Basic "+basic,
                    "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            }).success(function(){
                console.log(arguments);
                resolve();
            }).error(function(){
                console.log(arguments);
                reject();
            });
        }.bind(this));
    };

    return Twitter4FxOS;
})();