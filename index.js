var createStore = require('minidux')
var gameloop = require('gameloop')
var extend = require('xtend')
var keyboard = require('./controller-keyboard')()

var canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var game = gameloop({
  renderer: canvas.getContext('2d')
})

var player = {
  move: function (state, action) {
    var p = state.player
    var input = action.value
    if (!(Object.keys(input).length)) return state

    if (input['W']) p.position.y -= p.speed
    if (input['S']) p.position.y += p.speed
    if (input['A']) p.position.x -= p.speed
    if (input['D']) p.position.x += p.speed

    return extend(state, { player: p, input: { keyboard: input } })
  },
  draw: function (ctx, state) {
    var p = state.player
    ctx.fillStyle = p.color;
    ctx.fillRect(p.position.x, p.position.y, p.size.width, p.size.height);
  }
}

function reducer (state, action) {
  if (action.type === 'input') {
    return player.move(state, action)
  } else {
    return state
  }
}

var store = createStore(reducer, {
  game: {
    backgroundColor: 'pink',
    width: canvas.width,
    height: canvas.height
  },
  player: {
    position: { x: 50, y: 50 },
    size: { width: 100, height: 100 },
    color: 'white',
    speed: 5
  },
  input: {
    keyboard: {}
  }
})

keyboard.subscribe(function (input, active) {
  store.dispatch({ type: 'input', value: active })
})

game.on('draw', function (ctx) {
  var state = store.getState()
  ctx.fillStyle = state.game.backgroundColor;
  ctx.fillRect(0, 0, state.game.width, state.game.height);
  player.draw(ctx, state)
})

game.start()
