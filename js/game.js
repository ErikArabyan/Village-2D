// Конфигурация
const CONFIG = {
	TILE_SIZE: 8,
	BLOCK_SIZE: 16,
	ICONS: ['https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/wood.png', 'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/rock.png', 'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/diamond.png'],
}

let position
let num = 1

// Объекты
const player = new Player()
const resources = new Resources(540, 0, 104, 100)
const settings = new Settings(0, 0, 640, 480)
const background = new Map()

// установка колизии
Collisions.col(collisions)

// отображение всех предметов и очередь отображения
const draw = () => {
	background.draw()
	// отрисовка границ колизии не нужно
	Collisions.boundaries.forEach(b => b.draw())

	const objects = [player, ...Collisions.items]

	objects.sort((a, b) => {
		const aY = a.boundaries ? a.mapPosition.y + a.boundaries[0].height : a.mapPosition.y + a.colHeight
		const bY = b.boundaries ? b.mapPosition.y + b.boundaries[0].height : b.mapPosition.y + b.colHeight
		return aY - bY
	})

	objects.forEach(obj => obj.draw())
}

// Функция для анимации
function animate(time) {
	let deltaTime = (time - lastTime) / 1000
	lastTime = time
	moveSpeed = player.speed * deltaTime

	ctx.clearRect(0, 0, Map.WIDTH, Map.HEIGHT)
	draw()
	player.updateFrame()
	resources.draw()
	settings.handleInput()
	keyDown(moveSpeed)
	window.requestAnimationFrame(animate)
}

// Функция для движения игрока
const movePlayer = (dx = 0, dy = 0) => {
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
init(Map.ID, Map.WIDTH, Map.HEIGHT)
let lastTime = 0
window.requestAnimationFrame(animate)
