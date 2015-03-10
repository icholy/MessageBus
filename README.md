# MessageBus

> PubSub library for WebWorkers

main.js
``` js
var worker = new Worker('worker.js'),
    bus    = MessageBus.create(worker);

bus.on('pong', function (data) {
  console.log('got a pong');
});

bus.emit('ping', null);
```

worker.js
``` js
importScripts('../build/MessageBus.js');

var bus = MessageBus.create(self);

bus.on('ping', function (data) {
  bus.emit('pong', null);
});
```
