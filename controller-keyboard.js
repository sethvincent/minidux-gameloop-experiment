var vkey = require('vkey')

module.exports = function createKeyboardController (options) {
  var listener = function () {}
  var active = {}

  document.addEventListener('keydown', function (e) {
    var value = vkey[e.keyCode]
    active[value] = true

    var action = {
      type: 'input:on',
      value: value,
      event: e
    }

    listener(action, active)
  }, false)

  document.addEventListener('keyup', function (e) {
    var value = vkey[e.keyCode]
    delete active[value]

    var action = {
      type: 'input:off',
      value: value,
      event: e
    }

    listener(action, active)
  }, false)

  return {
    subscribe: function (cb) {
      listener = cb
    }
  }
}
