
describe('MessageBus', function () {

  describe('with Worker', function () {

    var worker, bus;

    before(function () {
      worker = new Worker('base/test/worker.js');
    });

    after(function () {
      worker.terminate();
    });

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
      bus.emit('undefined-message');
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

      bus.on('pong', function () {
        messageCount++;
        if (messageCount === 10) {
          done();
        }
      });

      for (i = 0; i < 10; i++) {
        bus.emit('ping');
      }
    });

    it('should work with multiple listeners', function (done) {
      var messageCount = 0;

      var listener = function () {
        messageCount++;
        if (messageCount === 3) {
          done();
        }
      };

      bus.on('pong', listener);
      bus.on('pong', listener);
      bus.on('pong', listener);

      bus.emit('ping');

    });

  });

  describe('with SharedWorker', function () {

    var worker, bus;

    before(function () {
      worker = new SharedWorker('base/test/shared-worker.js');
      worker.port.start();
    });

    beforeEach(function () {
      bus = MessageBus.create(worker.port);
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
      bus.emit('undefined-message');
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

    it.only('should recieve errors on "error"', function (done) {
      bus.on('error', function (err) {
        done();
      });
      bus.emit('throw-error');
    });

    it('should recieve multiple message', function (done) {
      var messageCount = 0,
          i;

      bus.on('pong', function () {
        messageCount++;
        if (messageCount === 10) {
          done();
        }
      });

      for (i = 0; i < 10; i++) {
        bus.emit('ping');
      }
    });

    it('should work with multiple listeners', function (done) {
      var messageCount = 0;

      var listener = function () {
        messageCount++;
        if (messageCount === 3) {
          done();
        }
      };

      bus.on('pong', listener);
      bus.on('pong', listener);
      bus.on('pong', listener);

      bus.emit('ping');

    });

  });

});
