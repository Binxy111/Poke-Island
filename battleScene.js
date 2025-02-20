const battleBackgroundImage = new Image()
battleBackgroundImage.src = 'https://www.deviantart.com/aveontrainer/art/battlebgRoute-829526311'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

let draggle
let emby
let renderedSprites
let queue 

function initBattle(){
  document.querySelector("#userInterface").style.display = 'block'
  document.querySelector("#dialogueBox").style.display = 'none'
  document.querySelector("#enemyHealthBar").style.width = '100%'
  document.querySelector("#playerHealthBar").style.width = '100%' 
  document.querySelector("#attacksBox").replaceChildren()


  draggle = new Monster(monsters.Draggle)
  emby = new Monster(monsters.Emby)
  renderedSprites = [draggle, emby]
  queue = []
  emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector("#attacksBox").append(button)
  })

  document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', (event) => {
    const selectedAttack = attacks[event.currentTarget.innerHTML]
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites
    })

    if (draggle.health <= 0) {
      queue.push(() => {
        draggle.faint()
      })
      queue.push(() => {
        gsap.to("#overlappingDiv", {
          opacity: 1,
          onComplete: () => {
            cancelAnimationFrame(battleAnimationId)
            animate()
            document.querySelector("#userInterface").style.display = 'none' 

            gsap.to("#overlappingDiv", {
              opacity: 0
            })

            battle.intiated = false
            audio.Map.play()
          }
        })
      })
    }

    const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites
      })

      if (emby.health <= 0) {
        queue.push(() => {
          emby.faint()
        })

        queue.push(() => {
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector("#userInterface").style.display = 'none' 

              gsap.to("#overlappingDiv", {
                opacity: 0
              })

              battle.intiated = false
              audio.Map.play()
            }
          })
        })
      }
    })
  })

  button.addEventListener('mouseenter', (event) => {
      const selectedAttack = attacks[event.currentTarget.innerHTML]
      document.querySelector('#attackType').innerHTML = selectedAttack.type
      document.querySelector('#attackType').style.color = selectedAttack.color
  })
})
}

let battleAnimationId


function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw()
  draggle.draw()
  emby.draw()

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
 }

 animate()

document.querySelector('#dialogueBox').addEventListener('click', (event) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else {
    event.currentTarget.style.display = 'none'
  }
})
