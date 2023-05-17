const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

console.log(collisions)

const collisionsMap = []

for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))
}

class Boundary {
    static width = 48
    static height = 48
    constructor({position}) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
const offset = {
    x: -785,
    y: -650
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            }
          })
        )
    })
  })

console.log(collisionsMap)

canvas.fillStyle = 'white'

const image = new Image()
image.src = './img/pelletTown.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

const keys = {
    w : {
        pressed: false,
    },
    a: {
        preseed: false,
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}


class Sprite {
    constructor({position, velocity, image, frames = {max: 1}}) {
        this.position = position
        this.image = image
        this.frames = frames
    }
    draw() {
        context.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height, 
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
    }
}

// canvas.width / 2 - (this.image.width / 4) / 2, 
// canvas.height / 2 - this.image.height / 2,

const player = new Sprite({
    position: {
      x: canvas.width / 2 - 192 / 4 / 2,
      y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const testBoundary = new Boundary({
    position: {
        x: 400,
        y: 400
    }
})

const movables = [background, testBoundary]

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    // boundaries.forEach(boundary => boundary.draw())
    testBoundary.draw()
    player.draw()
    // if (player.position.x + player.width) {

    // }

    if (keys.w.pressed && lastKey === 'w') {
        movables.forEach(movables => (movables.position.y += 3))
    } else if (keys.a.pressed && lastKey === 'a') {
        movables.forEach(movables => (movables.position.x += 3))
    } else if (keys.s.pressed && lastKey === 's') {
        movables.forEach(movables => (movables.position.y -= 3))
    } else if (keys.d.pressed && lastKey === 'd') {
        movables.forEach(movables => (movables.position.x -= 3))
    }
}

animate()

let lastKey = ''

window.addEventListener('keydown', (event) => {
   switch(event.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
   }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
         case 'w':
             keys.w.pressed = false
             break
         case 'a':
             keys.a.pressed = false
             break
         case 's':
             keys.s.pressed = false
             break
         case 'd':
             keys.d.pressed = false
             break
    }
 })