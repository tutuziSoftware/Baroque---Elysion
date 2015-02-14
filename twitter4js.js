var Twitter4FxOS = (function(){
    function Twitter4FxOS($http){
        this._network = new Network($http);
        this._storage = new Storage("accessToken");
    };

    /**
     * OAuth承認を行います。
     * @returns {Promise}
     */
    Twitter4FxOS.prototype.executeOAuth = function(){
        console.log("Twitter4FxOS.prototype.executeOAuth");
        return new Promise(function(resolve, reject){
            this._storage.getItem().then(function(accessToken){
                resolve(accessToken);
            }).catch(function(){
                console.log("catch");
                this._network.startOAuth().then(function(accessToken){
                    this._storage.setItem(accessToken);
                    resolve(accessToken);
                }.bind(this)).catch(function(){
                    reject();
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
            const basic = btoa(encodeURI(CONSUMER_KEY)+":"+encodeURI(CONSUMER_SECRET));

            this._$http({
                url:"https://api.twitter.com/oauth2/token",
                method:"POST",
                data:$.param({
                    grant_type:'client_credentials'
                }),
                headers: {
                    Authorization: "Basic "+basic,
                    "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            }).success(function(data){
                resolve(data["access_token"]);
            }).error(function(){
                reject();
            });
        }.bind(this));
    };

    return Twitter4FxOS;
})();