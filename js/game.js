// Объекты
const player = new Player()
const resources = new Resources(GameSettings.windowWidth - 104, 0, 104, 100)
const settings = new Settings(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
const background = new Map()
let position
let num = 1
let called

// установка колизии
Collisions.col(collisions)

// отображение всех предметов и очередь отображения
const draw = () => {
	background.draw(Map.width * GameSettings.scale, Map.height * GameSettings.scale)
	// отрисовка границ колизии не нужно
	Collisions.boundaries.forEach(b => b.draw())

	const objects = [player, ...Collisions.items]

	objects.sort((a, b) => {
		// item , player
		const aY = a.boundaries ? a.mapPosition.y + a.height - 6 * GameSettings.scale + a.hide : a.mapPosition.y + a.height / 2
		const bY = b.boundaries ? b.mapPosition.y + b.height - 6 * GameSettings.scale + b.hide : b.mapPosition.y + b.height / 2
		return aY - bY
	})

	objects.forEach(obj => obj.draw())
	player.updateFrame()
	resources.draw()
}

// Функция для анимации
function animate(time) {
	let deltaTime = (time - lastTime) / 1000
	lastTime = time
	moveSpeed = player.speed * deltaTime

	ctx.clearRect(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
	draw()
	settings.handleInput()
	keyDown(moveSpeed)
	window.requestAnimationFrame(animate)
}

// Функция для движения игрока
const movePlayer = (dx = 0, dy = 0) => {
	if (!Collisions.boundaries.some(b => b.collide(player.mapPosition.x + dx, player.mapPosition.y + dy, player.width, player.height))) {
		Action.move(dx, dy)
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
	if (!dir.dx && !dir.dy && !called) player.smoothStop(moveSpeed)

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
init(Map.ID, Map.WIDTH, Map.HEIGHT)
ctx.imageSmoothingEnabled = false
let lastTime = 0
window.requestAnimationFrame(animate)