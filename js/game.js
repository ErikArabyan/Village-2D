// Конфигурация
const CONFIG = {
	TILE_SIZE: 8,
	BLOCK_SIZE: 16,
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
		START_X: 640 / 2 - 16,
		START_Y: 480 / 2 - 38,
		IMAGES: ['assets/players/Player.png', 'assets/players/Player_Actions.png'],
		SPEED: 50,
	},
	MAPS: ['assets/maps/village_style_game.jpg', 'assets/maps/ForestMap.png', 'assets/maps/JewerlyMap.png', 'assets/maps/StoneMap.png'],
	ICONS: ['https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/wood.png', 'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/rock.png', 'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/diamond.png'],
	BG_SONG: 'assets/music/funny-bgm.mp3',
}
let position
let num = 1

// Объекты
const player = new Animation(CONFIG.PLAYER.IMAGES, 10, CONFIG.PLAYER.PICWIDTH, CONFIG.PLAYER.PICHEIGHT, CONFIG.PLAYER.ACTUALWIDTH, CONFIG.PLAYER.ACTUALHEIGHT, CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y, CONFIG.PLAYER.SPEED)
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

// установка колизии
Collisions.col(collisions)

// отображение всех предметов и очередь отображения
const draw = () => {
	background.draw()
	// отрисовка границ колизии не нужно
	Collisions.boundaries.forEach(b => b.draw())

	const objects = [player, ...Collisions.items]

	objects.sort((a, b) => {
		const aY = a.boundaries ? a.mapPosition.y + a.boundaries[0].height : a.mapPosition.y
		const bY = b.boundaries ? b.mapPosition.y + b.boundaries[0].height : b.mapPosition.y
		return aY - bY
	})

	objects.forEach(obj => obj.draw())
}

// Функция для анимации
function animate(time) {
	let deltaTime = (time - lastTime) / 1000
	lastTime = time
	moveSpeed = player.speed * deltaTime

	ctx.clearRect(0, 0, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
	draw()
	player.updateFrame()
	items.drawResources()
	if (keys.Esc.pressed) {
		menu.draw()
		menu.update()
	}
	keyDown(moveSpeed)
	window.requestAnimationFrame(animate)
}

// Функция для движения игрока
const movePlayer = (dx = 0, dy = 0) => {
	// console.log(Collisions.boundaries);

	if (!Collisions.boundaries.some(b => b.collide(player.mapPosition.x + dx, player.mapPosition.y + dy, player.width, player.height))) {
		player.mapPosition.set(player.mapPosition.x + dx, player.mapPosition.y + dy)
	}
}

// Обработчик событий для клавиш
const keyDown = (moveSpeed) => {
	const dir = { dx: 0, dy: 0 }
	const directions = [
		{ key: keys.W, axis: 'dy', value: -1, stateNum: 0 },
		{ key: keys.S, axis: 'dy', value: 1, stateNum: 1 },
		{ key: keys.D, axis: 'dx', value: 1, stateNum: 3 },
		{ key: keys.A, axis: 'dx', value: -1, stateNum: 2 },
	]

	directions.forEach(({ key, axis, value, stateNum }) => {
		if (key.pressed && dir[axis] !== value && !player.collecting) {
			dir[axis] += value * moveSpeed
			num = stateNum
		}
	})
	if (dir.dx && dir.dy) {
		dir.dx *= 7 / 10
		dir.dy *= 7 / 10
	}
	if (dir.dx) movePlayer(dir.dx, 0)
	if (dir.dy) movePlayer(0, dir.dy)

	player.changeState(num, dir.dx || dir.dy)
}

const keyActions = {
	KeyW: { keyDown: () => keys.W.keyDownHandler(), keyUp: () => keys.W.keyUpHandler() },
	KeyS: { keyDown: () => keys.S.keyDownHandler(), keyUp: () => keys.S.keyUpHandler() },
	KeyA: { keyDown: () => keys.A.keyDownHandler(), keyUp: () => keys.A.keyUpHandler() },
	KeyD: { keyDown: () => keys.D.keyDownHandler(), keyUp: () => keys.D.keyUpHandler() },
	KeyE: {
		keyDown: () => {
			keys.E.keyDownHandler()
			player.collect()
		},
		keyUp: () => {
			keys.E.keyUpHandler()
			player.endState()
		},
	},
	ArrowUp: { keyDown: () => keys.ArrowUp.keyDownHandler(), keyUp: () => keys.ArrowUp.keyUpHandler() },
	ArrowDown: { keyDown: () => keys.ArrowDown.keyDownHandler(), keyUp: () => keys.ArrowDown.keyUpHandler() },
	ArrowLeft: { keyDown: () => keys.ArrowLeft.keyDownHandler(), keyUp: () => keys.ArrowLeft.keyUpHandler() },
	ArrowRight: { keyDown: () => keys.ArrowRight.keyDownHandler(), keyUp: () => keys.ArrowRight.keyUpHandler() },
	Enter: { keyDown: () => keys.Enter.keyDownHandler(), keyUp: () => keys.Enter.keyUpHandler() },
	Escape: { keyDown: () => keys.Esc.keyPressChange() },
}

// События
window.addEventListener('keydown', e => {
	if (!e.repeat) {
		keyActions[e.code]?.keyDown?.(e)
	}
})

window.addEventListener('keyup', e => {
	if (!e.repeat) {
		keyActions[e.code]?.keyUp?.(e)
	}
})

// Инициализация
init(CONFIG.STAGE.ID, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
let lastTime = 0
window.requestAnimationFrame(animate)
