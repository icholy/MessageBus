
importScripts('../build/MessageBus.js');

onconnect = function (event) {

  var port = event.ports[0];
      bus  = MessageBus.create(port);

  port.start();

  self.addEventListener("error", function (e) {
    bus.emit("error", e);
  });

  var success = function () {
    bus.emit('success', null);
  };

  var error = function (err) {
    bus.emit('error', err);
  };

  bus.on('undefined-message', function (payload) {
    if (typeof payload === 'undefined') {
      success();
    } else {
      error();
    }
  });

  bus.on('null-message', function (payload) {
    if (payload === null) {
      success();
    } else {
      error();
    }
  });

  bus.on('string-message', function (payload) {
    if (typeof payload === 'string') {
      success();
    } else {
      error();
    }
  });

  bus.on('number-message', function (payload) {
    if (typeof payload === 'number') {
      success();
    } else {
      error();
    }
  });

  bus.on('object-message', function (payload) {
    if (typeof payload === 'object') {
      success();
    } else {
      error();
    }
  });

  bus.on('ping', function () {
    bus.emit('pong', null);
  });

};


