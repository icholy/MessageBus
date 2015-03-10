
importScripts('../build/MessageBus.js');

var bus = MessageBus.create(self);

var success = function () {
  bus.emit('success', null);
};

var error = function (err) {
  bus.emit('error', err);
};

bus.on('null-message', function (data) {
  if (data === null) {
    success();
  } else {
    error();
  }
});

bus.on('string-message', function (data) {
  if (typeof data === 'string') {
    success();
  } else {
    error();
  }
});

bus.on('number-message', function (data) {
  if (typeof data === 'number') {
    success();
  } else {
    error();
  }
});

bus.on('object-message', function (data) {
  if (typeof data === 'object') {
    success();
  } else {
    error();
  }
});

bus.on('throw-error', function (data) {
  throw new Error('an error');
});

bus.on('ping', function (data) {
  bus.emit('pong', null);
});

