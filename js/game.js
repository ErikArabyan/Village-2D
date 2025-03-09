// Объекты
const player = new Player()
const resources = new Resources(GameSettings.windowWidth - 104, 0, 104, 100)
const settings = new Settings(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
const background = new GameMap()
let position
let num = 0
const movementMap = {
	S: { dx: 0, dy: 1, num: 0 },
	D: { dx: 1, dy: 0, num: 1 },
	A: { dx: -1, dy: 0, num: 2 },
	W: { dx: 0, dy: -1, num: 3 },
	SD: { dx: 1, dy: 1, num: 4 },
	WD: { dx: 1, dy: -1, num: 5 },
	AS: { dx: -1, dy: 1, num: 6 },
	WA: { dx: -1, dy: -1, num: 7 },
}

// установка колизии
Collisions.col(collisions)

// отображение всех предметов и очередь отображения
const draw = () => {
	background.draw(GameMap.width * GameSettings.scale, GameMap.height * GameSettings.scale)
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

	settings.draw()
}

// Функция для анимации
function animate(time) {
	if (!lastTime) lastTime = time
	const deltaTime = (time - lastTime) / 1000
	lastTime = time

	moveSpeed = player.speed * deltaTime

	ctx.clearRect(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
	draw()
	if (!GameSettings.pause) keyDown(moveSpeed)

	window.requestAnimationFrame(animate)
}
// Функция для движения игрока
const movePlayer = (dx = 0, dy = 0, speed) => {
	if (!Collisions.boundaries.some(b => b.collide(player.mapPosition.x + 2 * dx, player.mapPosition.y + 2 * dy, player.width, player.height))) {
		Action.move(dx, dy, speed)
	}
}

// Обработчик событий для клавиш
const keyDown = moveSpeed => {
	const dir = { dx: 0, dy: 0 }

	const keysPressed = [keys.KeyW || keys.ArrowUp ? 'W' : null, keys.KeyA || keys.ArrowLeft ? 'A' : null, keys.KeyS || keys.ArrowDown ? 'S' : null, keys.KeyD || keys.ArrowRight ? 'D' : null].filter(Boolean)

	if (keysPressed.length) {
		
		const keyCombination = keysPressed.join('')
		const move = movementMap[keyCombination] || null

		if (move) {			
			dir.dx = move.dx * moveSpeed
			dir.dy = move.dy * moveSpeed
			num = move.num
		}
	}

	// Коррекция скорости по диагонали
	if (dir.dx && dir.dy) {
		dir.dx *= Math.SQRT1_2
		dir.dy *= Math.SQRT1_2
	}

	if (dir.dx) movePlayer(dir.dx, 0, moveSpeed)
	if (dir.dy) movePlayer(0, dir.dy, moveSpeed)

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

document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		GameSettings.pause = true
		for (i in keys) {
			keys[i] = false
		}
	} else {
		GameSettings.pause = false
	}
})

// Инициализация
init(GameMap.ID)

let lastTime = 0
window.requestAnimationFrame(animate)
