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
let worker = new Worker("worker.js"),
    bus    = MessageBus.create(worker);

bus.on<any>("pong", payload => {
  console.log(payload.foo);
});

bus.emit("ping");
```

**worker.js**

``` js
importScripts("MessageBus.js");

let bus = MessageBus.create(self);

bus.on("ping", () => {
  bus.emit("pong", { foo: "Hello World" });
});
```

### SharedWorker Example

**events.ts**

``` ts
enum Events { PONG, PING }
```

**main.ts**

``` ts
let worker = new SharedWorker("worker.js"),
    bus    = MessageBus.create(worker.port);

worker.port.start();

bus.on<any>(Events.PONG, payload => {
  console.log(payload.foo);
});

bus.emit(Events.PING);
```

**worker.ts**

``` ts
importScripts("MessageBus.js", "events.js");

onconnect = event => {
  let port = events.port[0],
      bus  = MessageBus.create(port);

  port.start();

  bus.on(Events.PING, () => {
    bus.emit(Events.PONG, { foo: "Hello World" });
  });
};
```
