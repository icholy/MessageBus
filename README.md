# MessageBus

> PubSub library for WebWorkers

main.js
``` js
var worker = new Worker('worker.js'),
    bus    = MessageBus.create(worker);

bus.subscribe('pong', function (data) {
  console.log('got a pong');
});

bus.publish('ping', null);
```

worker.js
``` js
importScripts('../build/MessageBus.js');

var bus = MessageBus.create(self);

bus.subscribe('ping', function (data) {
  bus.publish('pong', null);
});
```
