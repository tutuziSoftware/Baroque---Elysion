var Twitter4FxOS = (function(){
    function Twitter4FxOS(){
        this._network = new Network();
        this._storage = new Storage("accessToken");
    };

    Twitter4FxOS.prototype.checkOAuth = function(){
        return new Promise(function(resolve, reject){
            this._storage.getItem().then(function(accessToken){
                resolve(accessToken);
            }).catch(function(){
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
    function Network(){
        this._consumerKey =	"x1Z4hAckN1a5LTQKouGQ";
        this._consumerSecret = "2FXyGxHDh856bZXTO5dhDvaFl3SqQp65EQZItT6k";
    };

    Network.prototype.startOAuth = function(){
        return new Promise(function(resolve, reject){

        });
    };

    return TwitterFx;
})();