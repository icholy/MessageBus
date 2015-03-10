
importScripts('../build/MessageBus.js');

var bus = MessageBus.create(self);

var success = function () {
  bus.publish('success', null);
};

var error = function (err) {
  bus.publish('error', err);
};

bus.subscribe('string-message', function (data) {
  if (typeof data === 'string') {
    success();
  } else {
    error();
  }
});

bus.subscribe('number-message', function (data) {
  if (typeof data === 'number') {
    success();
  } else {
    error();
  }
});

bus.subscribe('object-message', function (data) {
  if (typeof data === 'object') {
    success();
  } else {
    error();
  }
});

bus.subscribe('throw-error', function (data) {
  throw new Error('an error');
});

bus.subscribe('ping', function (data) {
  bus.publish('pong', null);
});

