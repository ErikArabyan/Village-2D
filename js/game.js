// Объекты
const player = new Player()
const resources = new Resources(GameSettings.windowWidth - 104, 0, 104, 100)
const settings = new Settings(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
const background = new GameMap()
let position
let num = 0

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
const movePlayer = (dx = 0, dy = 0, speed) => {
	
	const canMoveX = !Collisions.boundaries.some(b => b.collide(player.mapPosition.x + dx, player.mapPosition.y, player.width, player.height))
	const canMoveY = !Collisions.boundaries.some(b => b.collide(player.mapPosition.x, player.mapPosition.y + dy, player.width, player.height))

	if (canMoveX && canMoveY) {
		Action.move(dx, dy, speed)
	} else if (canMoveX) {
		Action.move(dx, 0, speed)
	} else if (canMoveY) {
		Action.move(0, dy, speed)
	}
}

// Обработчик событий для клавиш
const keyDown = moveSpeed => {
	const dir = { dx: 0, dy: 0 }

	const keysPressed = [keys.KeyW || keys.ArrowUp ? 'W' : null, keys.KeyA || keys.ArrowLeft ? 'A' : null, keys.KeyS || keys.ArrowDown ? 'S' : null, keys.KeyD || keys.ArrowRight ? 'D' : null].filter(Boolean)

	if (keysPressed.length) {
		const keyCombination = keysPressed.join('')

		const movementMap = {
			W: { dx: 0, dy: -1, num: 3 },
			A: { dx: -1, dy: 0, num: 2 },
			S: { dx: 0, dy: 1, num: 0 },
			D: { dx: 1, dy: 0, num: 1 },
			WA: { dx: -1, dy: -1, num: 7 },
			WD: { dx: 1, dy: -1, num: 5 },
			AS: { dx: -1, dy: 1, num: 6 },
			SD: { dx: 1, dy: 1, num: 4 },
		}

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

	movePlayer(dir.dx, dir.dy, moveSpeed)	
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
init(GameMap.ID, GameMap.WIDTH, GameMap.HEIGHT)
ctx.imageSmoothingEnabled = false
let lastTime = 0
window.requestAnimationFrame(animate)
