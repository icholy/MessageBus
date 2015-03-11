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
importScripts('../build/MessageBus.js');

var bus = MessageBus.create(self);

bus.on('ping', function () {
  bus.emit('pong', { foo: 'Hello World' });
});
```
