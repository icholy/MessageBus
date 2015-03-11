# MessageBus [![Build Status](https://travis-ci.org/icholy/MessageBus.svg)](https://travis-ci.org/icholy/MessageBus) 

> PubSub library for WebWorkers

### Install

``` sh
$ npm install
$ gulp dist
```

### Usage Example

**main.js**

``` js
var worker = new Worker('worker.js'),
    bus    = MessageBus.create(worker);

bus.on('pong', function (payload) {
  console.log(payload.foo);
});

bus.emit('ping', null);
```

**worker.js**

``` js
importScripts('MessageBus.js');

var bus = MessageBus.create(self);

bus.on('ping', function () {
  bus.emit('pong', { foo: 'Hello World' });
});
```

### SharedWorker Example

**main.js**

``` js
var worker = new SharedWorker('worker.js'),
    bus    = MessageBus.create(worker.port);

worker.port.start();

bus.on('pong', function (payload) {
  console.log(payload.foo);
});

bus.emit('ping', null);
```

**worker.js**

``` js
importScripts('MessageBus.js');

onconnect = function (event) {
  var port = events.port[0],
      bus = MessageBus.create(port);

  port.start();

  self.addEventListener("error", function (e) {
    bus.emit("error", e);
  });

  bus.on('ping', function () {
    bus.emit('pong', { foo: 'Hello World' });
  });
};
```
