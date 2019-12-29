const JsCodeRunner = require('./runner/jsCodeRunner').default;
module.exports = (options) => new JsCodeRunner(options);