// Конфигурация
const CONFIG = {
	STAGE: { ID: 'stage', WIDTH: 640, HEIGHT: 480 },
	PLAYER: { PICWIDTH: 32, PICHEIGHT: 32, ACTUALWIDTH: 32, ACTUALHEIGHT: 32, START_X: 640 / 2 - 16, START_Y: 480 / 2 - 38, IMAGES: ['assets/players/Player.png', 'assets/players/Player_Actions.png'] },
	MAPS: ['assets/maps/village_style_game.jpg', 'assets/maps/ForestMap.png', 'assets/maps/JewerlyMap.png', 'assets/maps/StoneMap.png'],
	ICONS: ['assets/items/wood.png', 'assets/items/rock.png', 'assets/items/diamond.png'],
	BG_SONG: 'assets/funny-bgm.mp3',
}
let num = 1

// Объекты
const player = new Animation(CONFIG.PLAYER.IMAGES, 10, CONFIG.PLAYER.PICWIDTH, CONFIG.PLAYER.PICHEIGHT, CONFIG.PLAYER.ACTUALWIDTH, CONFIG.PLAYER.ACTUALHEIGHT)
const music = new Sound(CONFIG.BG_SONG)
const menu = new Menu(CONFIG.STAGE.WIDTH / 2, CONFIG.STAGE.HEIGHT / 2, ['Play Music (Enter)', 'Pause Music (Enter)', 'Volume Change (<-- -->)'])
const items = new Menu(575, 20, [0, 0, 0], CONFIG.ICONS)
const background = new Sprite(CONFIG.MAPS[0], CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
const keys = {
	W: new Key('KeyW'),
	S: new Key('KeyS'),
	A: new Key('KeyA'),
	D: new Key('KeyD'),
	E: new Key('KeyE'),
	Esc: new Key('Escape'),
	ArrowUp: new Key('ArrowUp'),
	ArrowDown: new Key('ArrowDown'),
	ArrowLeft: new Key('ArrowLeft'),
	ArrowRight: new Key('ArrowRight'),
	Enter: new Key('Enter'),
}

player.position.set(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y)

// Функция для создания границ
const createBoundary = collisions => {
	const boundaries = collisions.reduce((acc, symbol, index) => {
		if (symbol !== 0) {
			const row = Math.floor(index / 40)
			const col = index % 40
			acc.push(
				new Boundary({
					position: { x: col * Boundary.width, y: row * Boundary.height },
					action: typeof symbol === 'object' ? symbol[0] : symbol,
					width: typeof symbol === 'object' ? symbol[1] * 16 : 16,
					height: typeof symbol === 'object' ? symbol[2] * 16 : 16,
				})
			)
		}
		return acc
	}, [])

	// Добавление границ карты
	const perimeterBoundaries = [new Boundary({ position: { x: 0, y: 14 }, action: 1, width: 40 * 16, height: 0 }), new Boundary({ position: { x: 4, y: 0 }, action: 1, width: 0, height: 30 * 16 }), new Boundary({ position: { x: 0, y: 30 * 16 }, action: 1, width: 40 * 16, height: 0 }), new Boundary({ position: { x: 40 * 16 - 4, y: 0 }, action: 1, width: 0, height: 30 * 16 })]

	return [...boundaries, ...perimeterBoundaries]
}

let boundaries = createBoundary(collisions)

// Функция для анимации
const animate = () => {
	ctx.clearRect(0, 0, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
	background.draw()
	// отрисовка границ колизии
	// boundaries.forEach(b => b.draw());  // Можно оставить на будущее
	player.draw()
	player.updateFrame()
	items.drawResources()
	if (keys.Esc.pressed) {
		menu.draw()
		menu.update()
	}
	keyDown()
	window.requestAnimationFrame(animate)
}

// Функция для движения игрока
const movePlayer = (dx = 0, dy = 0) => {
	if (!boundaries.some(b => b.collide(player.position.x + dx, player.position.y + dy, player.width, player.height))) {
		player.position.set(player.position.x + dx, player.position.y + dy)
	}
}

// Универсальный обработчик для всех клавиш
const handleKeyAction = (keyCode, handlerType) => {
	if (keyActions[keyCode] && keyActions[keyCode][handlerType]) {
		keyActions[keyCode][handlerType]()
	}
}

// Обработчик событий для клавиш
const keyDown = () => {
	const dir = { dx: 0, dy: 0 }
	const directions = [
		{ key: keys.W, axis: 'dy', value: -1, stateNum: 0 },
		{ key: keys.S, axis: 'dy', value: 1, stateNum: 1 },
		{ key: keys.D, axis: 'dx', value: 1, stateNum: 3 },
		{ key: keys.A, axis: 'dx', value: -1, stateNum: 2 },
	]

	directions.forEach(({ key, axis, value, stateNum }) => {
		if (key.pressed && dir[axis] !== value) {
			dir[axis] += value
			num = stateNum
		}
	})

	// Если игрок двигается по обеим осям, уменьшаем скорость по диагонали
	if (dir.dx && dir.dy) {
		dir.dx *= 7 / 10
		dir.dy *= 7 / 10
	}

	// Перемещение игрока
	if (dir.dx) movePlayer(dir.dx, 0)
	if (dir.dy) movePlayer(0, dir.dy)

	player.changeState(num, dir.dx || dir.dy)
}

// События
window.addEventListener('keydown', e => {
	if (!e.repeat) handleKeyAction(e.code, 'keyDown')
})

window.addEventListener('keyup', e => {
	if (!e.repeat) handleKeyAction(e.code, 'keyUp')
})

// Инициализация
init(CONFIG.STAGE.ID, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
animate()
