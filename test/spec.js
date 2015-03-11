
describe('MessageBus', function () {

  var worker = new Worker('base/test/worker.js'),
      bus;

  beforeEach(function () {
    bus = MessageBus.create(worker);
  });

  afterEach(function () {
    bus.close();
  });

  var throwIt = function (err) {
    throw err;
  };

  it('should send an undefined message', function (done) {
    bus.on('success', done);
    bus.on('error', throwIt);
    bus.emit('undefined-message', undefined);
  });

  it('should send a null message', function (done) {
    bus.on('success', done);
    bus.on('error', throwIt);
    bus.emit('null-message', null);
  });

  it('should send a string message', function (done) {
    bus.on('success', done);
    bus.on('error', throwIt);
    bus.emit('string-message', 'a string');
  });

  it('should send a number message', function (done) {
    bus.on('success', done);
    bus.on('error', throwIt);
    bus.emit('number-message', 123);
  });

  it('should send an object message', function (done) {
    bus.on('success', done);
    bus.on('error', throwIt);
    bus.emit('object-message', {});
  });

  it('should recieve errors on "error"', function (done) {
    bus.on('error', function (err) {
      done();
    });
    bus.emit('throw-error');
  });

  it('should recieve multiple message', function (done) {
    var messageCount = 0,
        i;

    bus.on('pong', function (payload) {
      messageCount++;
      if (messageCount === 10) {
        done();
      }
    });

    for (i = 0; i < 100; i++) {
      bus.emit('ping', null);
    }
  });

  it('should work with multiple listeners', function (done) {
    var messageCount = 0;

    var listener = function (payload) {
      messageCount++;
      if (messageCount === 3) {
        done();
      }
    };

    bus.on('pong', listener);
    bus.on('pong', listener);
    bus.on('pong', listener);

    bus.emit('ping', null);

  });

  it('should recieve its own messages', function (done) {
    bus.on('test', function (payload) {
      done();
    });
    bus.emit('test', null);
  });

});
