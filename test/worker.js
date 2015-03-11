
importScripts('../build/MessageBus.js');

var bus = MessageBus.create(self);

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

bus.on('throw-error', function () {
  throw new Error('an error');
});

bus.on('ping', function () {
  bus.emit('pong', null);
});

