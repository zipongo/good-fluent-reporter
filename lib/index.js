var Hoek = require('hoek');
var logger = require('fluent-logger')
var Squeeze = require('good-squeeze').Squeeze;
var Through = require('through2');

// Declare internals

var internals = {
    defaults: {
        host: 'localhost',
        port: 24224,
        timeout: 30 * 1000,
        reconnectInterval: 1 * 1000,
        filter: function() {
          return true;
        },
        map: function(data) {
          return data;
        }
    }
};

module.exports = internals.GoodFluent = function (events, config) {
    if (!(this instanceof internals.GoodFluent)) {
        return new internals.GoodFluent(events, config);
    }

    config = config || {};
    Hoek.assert(typeof config.tag === 'string', 'tag must be a string');

    if (config.hasOwnProperty('filter')) {
      Hoek.assert(typeof config.filter === 'function', 'filter must be a function');
    }

    if (config.hasOwnProperty('map')) {
      Hoek.assert(typeof config.map === 'function', 'map must be a function');
    }

    this._settings = Hoek.applyToDefaults(internals.defaults, config);
    this._squeeze = new Squeeze(events);
};


internals.GoodFluent.prototype.init = function (stream, emitter, callback) {
    var sender = logger.createFluentSender(this._settings.tag);
    var self = this;
    
    if (!stream._readableState.objectMode) {
        return callback(new Error('stream must be in object mode'));
    }

    stream
      .pipe(this._squeeze)
      .pipe(Through.obj(function(data, enc, callback) {
          if (self._settings.filter(data)) {
            sender.emit(data.event, self._settings.map(data));
          }

          callback();
      }));

    callback();
};
