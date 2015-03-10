
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

  it('should send a string message', function (done) {
    bus.subscribe('success', done);
    bus.subscribe('error', throwIt);
    bus.publish('string-message', 'a string');
  });

  it('should send a number message', function (done) {
    bus.subscribe('success', done);
    bus.subscribe('error', throwIt);
    bus.publish('number-message', 123);
  });

  it('should send an object message', function (done) {
    bus.subscribe('success', done);
    bus.subscribe('error', throwIt);
    bus.publish('object-message', {});
  });

  it('should recieve errors on "error"', function (done) {
    bus.subscribe('error', function (err) {
      done();
    });
    bus.publish('throw-error');
  });

  it('should recieve multiple message', function (done) {
    var messageCount = 0,
        i;

    bus.subscribe('pong', function (data) {
      messageCount++;
      if (messageCount === 10) {
        done();
      }
    });

    for (i = 0; i < 100; i++) {
      bus.publish('ping', null);
    }
  });

  it('should work with multiple listeners', function (done) {
    var messageCount = 0;

    var listener = function (data) {
      messageCount++;
      if (messageCount === 3) {
        done();
      }
    };

    bus.subscribe('pong', listener);
    bus.subscribe('pong', listener);
    bus.subscribe('pong', listener);

    bus.publish('ping', null);

  });

});
