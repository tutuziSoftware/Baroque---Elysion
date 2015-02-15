var Twitter4FxOS = (function(){
    function Twitter4FxOS($http, callback){
        this._storage = new Storage("accessToken");

        this._storage.getItem().then(function(accessToken){
            this._network = new Network($http, accessToken);
            callback(Twitter4FxOS.prototype.OK);
        }.bind(this)).catch(function(){
            this._network = new Network($http);
            callback(Twitter4FxOS.prototype.NG);
        }.bind(this));
    };

    Twitter4FxOS.prototype.OK = {};
    Twitter4FxOS.prototype.NG = {};

    /**
     * OAuth承認を行います。
     * @returns {Promise}
     */
    Twitter4FxOS.prototype.executeOAuth = function(){
        console.log("Twitter4FxOS.prototype.executeOAuth");
        return new Promise(function(resolve, reject){
            this._storage.getItem().then(function(accessToken){
                console.log("then");
                resolve();
            }).catch(function(){
                console.log(this._network);
                this._network.startOAuth().then(function(accessToken){
                    console.log("catch");
                    this._storage.setItem(accessToken);
                    resolve(accessToken);
                }.bind(this)).catch(function(){
                    console.log("catch");
                    reject();
                });
            }.bind(this));
        }.bind(this));
    };

    Twitter4FxOS.prototype.fetchAccessToken = function(pin){
        return new Promise(function(resolve, reject) {
            console.log(pin, this);

            this._network.fetchAccessToken(pin).then(function (accessToken) {
                console.log(accessToken);
                this._storage.setItem(accessToken);
                resolve();
            }.bind(this)).catch(function () {
                console.log("network error");
                reject();
            });
        }.bind(this));
    };

    Twitter4FxOS.prototype.getHomeTimeline = function(callback){
        this._network.getHomeTimeline(function(){

        });
    };

    /**
     * 通信系
     * @constructor
     */
    function Network($http, accessToken){
        console.log($http, accessToken);
        this._$http = $http;
        this._accessToken = accessToken;
    };

    Network.prototype._CONSUMER_KEY = "x1Z4hAckN1a5LTQKouGQ";
    Network.prototype._CONSUMER_SECRET = "2FXyGxHDh856bZXTO5dhDvaFl3SqQp65EQZItT6k";

    Network.prototype.startOAuth = function(){
        return new Promise(function(resolve, reject){
            var message = {
                method: "GET",
                action: "https://api.twitter.com/oauth/request_token",
                parameters: {
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_consumer_key: this._CONSUMER_KEY
                }
            };

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, {
                consumerSecret: this._CONSUMER_SECRET
            });

            this._$http({
                url: OAuth.addToURL(message.action, message.parameters),
                method: message.method
            }).success(function(data){
                console.log(data);
                var _ = data.match(/oauth_token=([^&]*)&oauth_token_secret=([^&]*)/);
                this._OAUTH_TOKEN = _[1];
                this._OAUTH_TOKEN_SECRET = _[2];
                const URL = "https://api.twitter.com/oauth/authorize?oauth_token="+this._OAUTH_TOKEN;
                console.log(URL);
                window.open(URL, "_blank");
            }.bind(this)).error(function(){
                console.log(arguments);
                reject();
            });
        }.bind(this));
    };

    Network.prototype.fetchAccessToken = function(pin){
        return new Promise(function(resolve, reject){
            var message = {
                method: "GET",
                action: "https://twitter.com/oauth/access_token",
                parameters: {
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_consumer_key: this._CONSUMER_KEY,
                    oauth_token: this._OAUTH_TOKEN,
                    oauth_verifier: pin
                }
            };
            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, {
                consumerSecret: this._CONSUMER_SECRET,
                tokenSecret: this._OAUTH_TOKEN_SECRET
            });

            this._$http({
                url: OAuth.addToURL(message.action, message.parameters),
                method: message.method
            }).success(function(data){
                resolve(data.match(/oauth_token=([^&]*)/)[1]);
            }).error(function(){
                console.log(arguments);
                reject();
            });
        }.bind(this));
    };

    Network.prototype.getHomeTimeline = function(){
        console.log(this._accessToken);
        this._$http({
            url:"https://api.twitter.com/1.1/statuses/home_timeline.json",
            method:"GET",
            headers: {
                Authorization: "Bearer "+this._accessToken
            }
        }).success(function(data){
            console.log(data);
        }).error(function(){
            console.log(arguments);
        });
    };

    return Twitter4FxOS;
})();