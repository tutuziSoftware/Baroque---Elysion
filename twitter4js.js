var Twitter4FxOS = (function(){
    function Twitter4FxOS($http, callback){
        this._storage = new Storage("accessToken");
        this._accessTokenSecret = new Storage("accessTokenSecret");

        this._storage.getItem().then(function(accessToken){
            console.log("test");
            this._accessTokenSecret.getItem().then(function(accessTokenSecret){
                this._network = new Network({
                    $http:$http,
                    accessToken:accessToken,
                    accessTokenSecret:accessTokenSecret
                });
                callback(Twitter4FxOS.prototype.OK);
            }).catch(
                tryOAuth.bind(this)
            );
        }.bind(this)).catch(
            tryOAuth.bind(this)
        );

        function tryOAuth(){
            this._network = new Network({
                $http:$http
            });
            callback(Twitter4FxOS.prototype.NG);
        }
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
                this._accessTokenSecret.getItem().then(function(accessTokenSecret){
                    resolve({
                        accessToken:accessToken,
                        accessTokenSecret:accessTokenSecret
                    });
                }).catch(function(){
                    console.log("TODO アクセストークンの再取得");
                });
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

            this._network.fetchAccessToken(pin).then(function (accessTokens) {
                console.log(accessTokens);
                this._storage.setItem(accessTokens.accessToken);
                this._accessTokenSecret.setItem(accessTokens.accessTokenSecret);
                resolve();
            }.bind(this)).catch(function () {
                console.log("network error");
                reject();
            });
        }.bind(this));
    };

    Twitter4FxOS.prototype.getHomeTimeline = function(){
        return this._network.getHomeTimeline();
    };

    /**
     * 通信系
     * @constructor
     */
    function Network(args){
        this._$http = args.$http;
        this._accessToken = args.accessToken;
        this._accessTokenSecret = args.accessTokenSecret;
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
                var tokens = data.match(/oauth_token=([^&]*)&oauth_token_secret=([^&]*)/);
                console.log(data);
                console.log(tokens);
                const accessToken = tokens[1];
                const accessTokenSecret = tokens[2];
                resolve({
                    accessToken: accessToken,
                    accessTokenSecret: accessTokenSecret
                });
            }).error(function(){
                console.log(arguments);
                reject();
            });
        }.bind(this));
    };

    Network.prototype.getHomeTimeline = function(){
        return new Promise(function(resolve, reject){
            var message = {
                method: "POST",
                action: "https://api.twitter.com/1.1/statuses/home_timeline.json",
                parameters: {
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_consumer_key: this._CONSUMER_KEY,
                    oauth_token: this._OAUTH_TOKEN
                }
            };

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, {
                consumerSecret: this._CONSUMER_SECRET,
                tokenSecret: this._OAUTH_TOKEN_SECRET
            });

            this._$http({
                url: OAuth.addToURL(message.action, message.parameters),
                type: message.method
            }).success(function(data){
                console.log(data);
            }).error(function(){
                console.log(arguments);
            });
        }.bind(this));
    };

    return Twitter4FxOS;
})();