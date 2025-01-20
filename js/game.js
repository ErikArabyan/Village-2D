/**
 * Implementazione del videogioco Pong.
 * @author Siarou ALiaksandr
 * @version 1.0
 */
const STAGE_ID = 'stage'
const STAGE_WIDTH = 640
const STAGE_HEIGHT = 480
const STARTPOS_X = STAGE_WIDTH / 2 - 8
const STARTPOS_Y = STAGE_HEIGHT / 2 - 38
const MAP = 'assets/maps/village_style_game.png'
const MAP1 = 'assets/maps/ForestMap.jpg'
const MAP2 = 'assets/maps/JewerlyMap.png'
const MAP3 = 'assets/maps/StoneMap.jpg'
const BALL = 'assets/ball.png'
const HIT = 'assets/hit.wav'
const BG_SONG = 'assets/funny-bgm.mp3'
const player_width = 48
const player_height = 68
const playerIMG = ['assets/players/playerUp.png', 'assets/players/playerDown.png', 'assets/players/playerLeft.png', 'assets/players/playerRight.png']
let move = true
let setmenu = false

init(STAGE_ID, 0, 0, STAGE_WIDTH, STAGE_HEIGHT)
let background = new Sprite(MAP, STAGE_WIDTH, STAGE_HEIGHT)
const music = new Sound(BG_SONG)
const menu = new Menu(STARTPOS_X, STARTPOS_Y, ['Play Music (Enter)', 'Pause Music (Enter)', 'Volume Change (<-- -->)'])


col = (collisions) => {
	const collisionsMap = []
	for (let i = 0; i < collisions.length; i += 40) {
		collisionsMap.push(collisions.slice(i, 40 + i))
	}

	const boundaries = []
	const offset = {
		x: 0, // misure della mappa
		y: 0,
	}

	collisionsMap.forEach((row, i) => {
		row.forEach((symbol, j) => {
			if (symbol == 1)
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + offset.x,
							y: i * Boundary.height + offset.y,
						},
					})
				)
			else if (symbol > 1)
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + offset.x,
							y: i * Boundary.height + offset.y,
						},
						map: symbol === 2 ? MAP1 : symbol === 3 ? MAP : symbol === 4 ? MAP2 : symbol === 5 ? MAP3 : null,
					})
				)
		})
	})

	return boundaries
}

let boundaries = col(collisions)

const w = new Key('w')
const a = new Key('a')
const s = new Key('s')
const d = new Key('d')
const ArrowUp = new Key('ArrowUp')
const ArrowDown = new Key('ArrowDown')

const player = new Animation(playerIMG, 1, player_width, player_height)

player.position.set(STARTPOS_X, STARTPOS_Y)

function animate() {
	ctx.clearRect(0, 0, 640, 400)
	background.draw()
	if (setmenu) {
		menu.draw()
		switch (menu.index) {
			case 0:
				if (menu.choose.pressed) {
					music.play()
				}
				break
			case 1:
				if (menu.choose.pressed) {
					music.pause()
				}
				break
			case 2:
				if (menu.ArrowLeft.pressed && music.audio.volume > 0.006) {
					music.volume(music.audio.volume - 0.005)
				} else if (menu.ArrowRight.pressed && music.audio.volume < 0.993) {
					music.volume(music.audio.volume + 0.005)
				}
				break
		}
	}
	boundaries.forEach(boundary => {
		boundary.draw()
	})

	player.draw()
	window.requestAnimationFrame(animate)
}

animate()

function keyDown(e, key, num) {
	key.keyDownHandler(e)
	for (let i of boundaries) {
		if (num == 0) {
			if (!i.collide(player.position.x, player.position.y - 4, player.height, player.width)) {
				move = false
				break
			}
			if (!background.collide(player.position.x, player.position.y - 4, player.height, player.width)) {
				move = false
				break
			}
		} else if (num == 1) {
			if (!i.collide(player.position.x, player.position.y + 4, player.height, player.width)) {
				move = false
				break
			}
			if (!background.collide(player.position.x, player.position.y + 4, player.height, player.width)) {
				move = false
				break
			}
		} else if (num == 2) {
			if (!i.collide(player.position.x - 4, player.position.y, player.height, player.width)) {
				move = false
				break
			}
			if (!background.collide(player.position.x - 4, player.position.y, player.height, player.width)) {
				move = false
				break
			}
		} else if (num == 3) {
			if (!i.collide(player.position.x + 4, player.position.y, player.height, player.width)) {
				move = false
				break
			}
			if (!background.collide(player.position.x + 4, player.position.y, player.height, player.width)) {
				move = false
				break
			}
		}
	}
	if (move) {
		if (num == 0) {
			player.position.set(player.position.x, player.position.y - 4)
		} else if (num == 1) {
			player.position.set(player.position.x, player.position.y + 4)
		} else if (num == 2) {
			player.position.set(player.position.x - 4, player.position.y)
		} else if (num == 3) {
			player.position.set(player.position.x + 4, player.position.y)
		}
	}
	player.update()
	player.changeState(num)
}

window.addEventListener('keydown', e => {
	switch (e.key) {
		case 'w':
			move = true
			keyDown(e, w, 0)
			break
		case 's':
			move = true
			keyDown(e, s, 1)
			break
		case 'a':
			move = true
			keyDown(e, a, 2)
			break

		case 'd':
			move = true
			keyDown(e, d, 3)
			break
		case 'Escape':
			if (setmenu) {
				setmenu = false
			} else {
				setmenu = true
			}
			break
		case 'ArrowUp':
			menu.keyDownHandler(e)
			menu.update()
			break
		case 'ArrowDown':
			menu.keyDownHandler(e)
			menu.update()
			break
		case 'ArrowLeft':
			menu.keyDownHandler(e)
			menu.update()
			break
		case 'ArrowRight':
			menu.keyDownHandler(e)
			menu.update()
			break
		case 'Enter':
			menu.keyDownHandler(e)
			menu.update()
			break
	}
})

window.addEventListener('keyup', e => {
	switch (e.key) {
		case 'w':
			w.keyUpHandler(e)
			player.changeState(0)
			player.reset()
			break
		case 'a':
			a.keyUpHandler(e)
			player.changeState(2)
			player.reset()
			break
		case 's':
			s.keyUpHandler(e)
			player.changeState(1)
			player.reset()
			break
		case 'd':
			d.keyUpHandler(e)
			player.changeState(3)
			player.reset()
			break
		case 'ArrowUp':
			menu.keyUpHandler(e)
			menu.update()
			break
		case 'ArrowDown':
			menu.keyUpHandler(e)
			menu.update()
			break
		case 'ArrowLeft':
			menu.keyUpHandler(e)
			menu.update()
			break
		case 'ArrowRight':
			menu.keyUpHandler(e)
			menu.update()
			break
		case 'Enter':
			menu.keyUpHandler(e)
			menu.update()
			break
	}
})
