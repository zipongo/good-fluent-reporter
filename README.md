# good-fluent-reporter

## Install

    $ npm install good-fluent-reporter

## Prerequistes

Fluent daemon should listen on TCP port.

## Usage

### Create the reporter for good

    var reporter = {
        reporter: require('good-fluent-reporter'),
        events: { log: '*', response: '*' },
        config: {
          tag: 'api',
        }
    };

    server.register({
      register: require('good'),
      options: {
        reporters: [reporter]
      },
    });

## License

Apache License, Version 2.0.

[good-fluent-reporter]: https://github.com/zipongo/good-fluent-reporter
