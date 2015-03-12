
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

  describe('with an EchoEndpoint', function () {

    var EchoEndpoint = function () {
      this._listeners = [];
    };

    EchoEndpoint.prototype.addEventListener = function (name, listener) {
      if (name === 'message') {
        this._listeners.push(listener);
      }
    };

    EchoEndpoint.prototype.removeEventListener = function (name, listener) {
      if (name === 'message') {
        var index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }
    };

    EchoEndpoint.prototype.postMessage = function (data) {
      this._listeners.forEach(function (listener) {
        listener({ data: data });
      });
    };

    EchoEndpoint.prototype.numListener = function () {
      return this._listeners.length;
    };

    var echo, bus;

    before(function () {
      echo = new EchoEndpoint();
    });

    beforeEach(function () {
      bus = MessageBus.create(echo);
    });

    afterEach(function () {
      bus.close();
    });

    var throwIt = function (err) {
      throw err;
    };

    it('should send an undefined message', function (done) {
      bus.on('undefined-message', function (payload) {
        if (typeof payload === 'undefined') {
          done();
        } else {
          throw new Error();
        }
      });
      bus.emit('undefined-message');
    });

    it('should send a null message', function (done) {
      bus.on('null-message', function (payload) {
        if (payload === null) {
          done();
        } else {
          throw new Error();
        }
      });
      bus.emit('null-message', null);
    });

    it('should send a string message', function (done) {
      bus.on('string-message', function (payload) {
        if (typeof payload === 'string') {
          done();
        } else {
          throw new Error();
        }
      });
      bus.emit('string-message', 'a string');
    });

    it('should send a number message', function (done) {
      bus.on('number-message', function (payload) {
        if (typeof payload === 'number') {
          done();
        } else {
          throw new Error();
        }
      });
      bus.emit('number-message', 123);
    });

    it('should send an object message', function (done) {
      bus.on('object-message', function (payload) {
        if (typeof payload === 'object') {
          done();
        } else {
          throw new Error();
        }
      })
      bus.emit('object-message', {});
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
        bus.emit('pong');
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

      bus.emit('pong');

    });

  });

});
