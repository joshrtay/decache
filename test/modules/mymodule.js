var hello = require('./othermodule.js') // require a second ("child") module

var runcount = false

var get = function () {
  return runcount
}

var set = function () {
  runcount = runcount + 1
  return runcount
}

module.exports = {
  get, set, hello
}
