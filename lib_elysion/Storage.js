/**
 * 永続ストレージにアクセスする為のクラスです。
 */
function Storage(key){
    this._key = key;
}
Storage.prototype.setItem = function(text){
    console.log(this._key, text);
    return localforage.setItem(this._key, text);
};
/**
 * データを取得します。
 * データが存在しない場合、Promiseはcatchを返します。
 */
Storage.prototype.getItem = function(){
    var self = this;

    return new Promise(function (resolve, reject){
        localforage.getItem(self._key).then(function(data){
            if(data == null){
                reject();
            }else{
                resolve(data);
            }
        });
    });
};
Storage.prototype.removeItem = function(){
    return localforage.removeItem(this._key);
}