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
	if (menu.show(keys.Escape)) {
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
const keyDown = moveSpeed => {
	const dir = { dx: 0, dy: 0 }
	const directions = [
		{ key: keys.KeyW || keys.ArrowUp, axis: 'dy', value: -1, stateNum: 0 },
		{ key: keys.KeyS || keys.ArrowDown, axis: 'dy', value: 1, stateNum: 1 },
		{ key: keys.KeyD || keys.ArrowRight, axis: 'dx', value: 1, stateNum: 3 },
		{ key: keys.KeyA || keys.ArrowLeft, axis: 'dx', value: -1, stateNum: 2 },
	]

	directions.forEach(({ key, axis, value, stateNum }) => {
		if (key && dir[axis] !== value && !player.collecting) {
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

	if (keys.KeyE) {
		player.collect(num)
	} else {
		player.endState()
	}
	player.changeState(num, dir.dx || dir.dy)
}

// События клавиатуры
let keys = {}
window.addEventListener('keydown', e => {
	if (!e.repeat) {
		keys[e.code] = true
	}
})

window.addEventListener('keyup', e => {
	if (!e.repeat) {
		keys[e.code] = false
	}
})

// Инициализация
init(CONFIG.STAGE.ID, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT)
let lastTime = 0
window.requestAnimationFrame(animate)
