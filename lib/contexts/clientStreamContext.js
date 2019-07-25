const grpc = require('grpc');

class ClientStreamContext {
  constructor(call, callback) {
    this.call = call;
    this.callback = callback;
  }
  
  on(event, callback) {
    this.call.on(event, callback)
  }

  throw(err) {
    if (!(err instanceof Error)) {
      throw(new Error(
          'Please pass your error details as an Error class. Firecomm supports adding additional error metadata in the trailers property using context.setStatus()'));
    }
    this.callback(err, {}, this.trailer);
  }

  setStatus(metaObject) {
    if (!this.trailer) {
      this.trailer = new grpc.Metadata();
      }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.trailer.set(keys[i], metaObject[keys[i]]);
    }
  }

  setMeta(metaObject) {
    if (!this.metaData) {
      this.metaData = new grpc.Metadata();
      }
    const keys = Object.keys(metaObject);
    for (let i = 0; i < keys.length; i++) {
      this.metaData.set(keys[i], metaObject[keys[i]]);
    }
  }

  send(message = {}) {
    if (this.metaData) {
      this.call.sendMetadata(this.metaData);
    }
    this.callback(this.err, message, this.trailer);
  }

  end() {
    this.call.end()
  }
}

module.exports = ClientStreamContext;