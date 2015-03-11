var MessageBus;!function(n){function t(n){return new e(n)}var e=function(){function n(n){var t=this;this._channels={},this._unlisten=null,this._endpoint=n;var e=function(n){return t._onEvent(n.data.name,n.data.payload)},s=function(n){return t._onEvent("error",n)};n.addEventListener("message",e),n.addEventListener("error",s),this._unlisten=function(){n.removeEventListener("message",e),n.removeEventListener("error",s)}}return n.prototype.close=function(){null!==this._unlisten&&this._unlisten(),this._unlisten=null,this._channels={}},n.prototype.on=function(n,t){this._channelExists(n)||(this._channels[n]=[]),this._channels[n].push(t)},n.prototype.off=function(n,t){if(this._channelExists(n)){var e=this._channels[n],s=e.indexOf(t);-1!==s&&e.splice(s,1)}},n.prototype.emit=function(n,t){this._endpoint.postMessage({name:n,payload:t})},n.prototype._channelExists=function(n){return this._channels.hasOwnProperty(n)},n.prototype._onEvent=function(n,t){this._channelExists(n)&&this._channels[n].forEach(function(n){n(t)})},n}();n.MessageBus=e,n.create=t}(MessageBus||(MessageBus={}));