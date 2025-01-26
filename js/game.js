// Конфигурация
const CONFIG = {
	STAGE: {
		ID: 'stage',
		WIDTH: 640,
		HEIGHT: 480,
	},
	PLAYER: {
		PICWIDTH: 32,
		PICHEIGHT: 32,
		ACTUALWIDTH: 32,
		ACTUALHEIGHT: 32,
		START_X: 640 / 2 - 8,
		START_Y: 480 / 2 - 38,
		IMAGES: ['assets/players/Player.png', 'assets/players/Player_Actions.png'],
	},
	MAPS: ['assets/maps/village_style_game.jpg', 'assets/maps/ForestMap.png', 'assets/maps/JewerlyMap.png', 'assets/maps/StoneMap.png'],
	ICONS: ['assets/items/wood.png', 'assets/items/rock.png', 'assets/items/diamond.png'],
	BG_SONG: 'assets/funny-bgm.mp3',
}

// Controlliamo se giocatore si muove e no, e se aperto menu e no
const state = {
	move: true,
	setmenu: false,
}

// Объекты
const player = new Animation(CONFIG.PLAYER.IMAGES, 10, CONFIG.PLAYER.PICWIDTH, CONFIG.PLAYER.PICHEIGHT, CONFIG.PLAYER.ACTUALWIDTH, CONFIG.PLAYER.ACTUALHEIGHT)
const music = new Sound(CONFIG.BG_SONG)
const menu = new Menu(CONFIG.STAGE.WIDTH / 2, CONFIG.STAGE.HEIGHT / 2, ['Play Music (Enter)', 'Pause Music (Enter)', 'Volume Change (<-- -->)'])
const items = new Menu(575, 20, [0, 0, 0], CONFIG.ICONS)
const background = new Sprite(CONFIG.MAPS[0], CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
player.position.set(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y)

	// Функция для создания границ
const col = collisions =>
	collisions.reduce((boundaries, symbol, index) => { // математические действия над списком	
		if (symbol !== 0) {
			const row = Math.floor(index / 40)
			const col = index % 40
			boundaries.push(
				new Boundary({
					position: { x: col * Boundary.width, y: row * Boundary.height },
					action: typeof symbol == 'object' ? symbol[0] : symbol, 
					width: typeof symbol == 'object' ? symbol[1] * 16 : 16,
					height: typeof symbol == 'object' ? symbol[2] * 16 : 16,
				})
			)
		}
		return boundaries
	}, [])

// Обработка столкновений
let boundaries = col(collisions)

// Функция для анимации
const animate = () => {
	ctx.clearRect(0, 0, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
	background.draw()
	boundaries.forEach(b => b.draw())   //   отрисовка границ колизии не нужно
	player.draw()
	player.update()
	items.drawResources()
	// player.update()

	if (state.setmenu) menu.draw()

	if (state.setmenu) {
		const menuActions = {
			0: () => menu.choose.pressed && music.play(),
			1: () => menu.choose.pressed && music.pause(),
			2: () => {
				if (menu.ArrowLeft.pressed) {
					music.volume(Math.max(music.audio.volume - 0.08, 0)) // уменьшаем громкость, но не ниже 0
				}
				if (menu.ArrowRight.pressed) {
					music.volume(Math.min(music.audio.volume + 0.08, 1)) // увеличиваем громкость, но не выше 1
				}
			},
		}
		menuActions[menu.index]() 
	}
	window.requestAnimationFrame(animate)
}

// Функция для движения игрока
const movePlayer = (dx, dy, num) => {
	state.move = !boundaries.some(b => b.collide(player.position.x + dx, player.position.y + dy, player.width, player.height))
	if (state.move && background.collide(player.position.x + dx, player.position.y + dy, player.width, player.height)) {
		player.position.set(player.position.x + dx, player.position.y + dy)
	}
	player.update(num+1)
}

// Обработчик событий для клавиш
const keyDown = (e, key, num) => {
	const directions = [
		{ dx: 0, dy: -4 }, // Вверх
		{ dx: 0, dy: 4 }, // Вниз
		{ dx: -4, dy: 0 }, // Влево
		{ dx: 4, dy: 0 }, // Вправо
	]

	const { dx, dy } = directions[num-1]
	key.keyDownHandler(e)
	movePlayer(dx, dy, num-1)
	player.changeState(num, true)
}

const keyActions = {
	KeyW: { keyDown: e => keyDown(e, new Key('w'), 1), keyUp: () => player.changeState(1) },
	KeyS: { keyDown: e => keyDown(e, new Key('s'), 2), keyUp: () => player.changeState(2) },
	KeyA: { keyDown: e => keyDown(e, new Key('a'), 3), keyUp: () => player.changeState(3) },
	KeyD: { keyDown: e => keyDown(e, new Key('d'), 4), keyUp: () => player.changeState(4) },
	Escape: { keyDown: () => (state.setmenu = !state.setmenu) },
	ArrowUp: { keyDown: menuHandler },
	ArrowDown: { keyDown: menuHandler },
	ArrowLeft: { keyDown: menuHandler, keyUp: menuHandler },
	ArrowRight: { keyDown: menuHandler, keyUp: menuHandler },
	Enter: { keyDown: menuHandler, keyUp: menuHandler },
}

function menuHandler(e) {
	menu.keyDownHandler(e)
	menu.update()
	setTimeout(() => {
		menu.keyUpHandler(e)
	}, 10)
}

// События
window.addEventListener('keydown', e => {
	state.move = true
	keyActions[e.code]?.keyDown?.(e)
	
})

window.addEventListener('keyup', e => {
	keyActions[e.code]?.keyUp?.(e)
})

// Инициализация
init(CONFIG.STAGE.ID, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
animate()

