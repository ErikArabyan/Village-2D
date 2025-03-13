import { init, GameSettings } from './gamelib.js'
import { Player, Resources, Settings } from './items.js'
import { Action, Boundary, Collisions } from './utils.js'
import { GameMap } from './MapItems.js'
import collisions from '../collisions/collisions.json'

Collisions.col(GameMap, collisions.object)

// Объекты
const player = new Player()
export const resources = new Resources(GameSettings.windowWidth - 104, 0, 104, 100)
const settings = new Settings(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
const background = new GameMap()

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

// отображение всех предметов и очередь отображения
const draw = () => {
	background.draw(GameMap.width * GameSettings.scale, GameMap.height * GameSettings.scale)
	// отрисовка границ колизии не нужно
	for (const i of Collisions.boundaries) i.draw(ctx)

	const objects = [player, ...Collisions.items]

	objects.sort((a, b) => {
		// item , player
		const aY = a.boundaries ? a.mapPosition.y + a.height - 6 * GameSettings.scale + a.hide : a.mapPosition.y + a.height / 2
		const bY = b.boundaries ? b.mapPosition.y + b.height - 6 * GameSettings.scale + b.hide : b.mapPosition.y + b.height / 2
		return aY - bY
	})
	
	for (const i of objects) i.draw()
	resources.draw()

	settings.draw(keys)
}

// Функция для анимации
function animate(time) {
	if (!lastTime) lastTime = time
	const deltaTime = (time - lastTime) / 1000
	lastTime = time

	const moveSpeed = player.speed * deltaTime

	ctx.clearRect(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
	draw()
	if (!GameSettings.pause) keyDown(moveSpeed)
	player.updateFrame(moveSpeed, keys)
	requestAnimationFrame(animate)
}
// Функция для движения игрока
const movePlayer = (dx = 0, dy = 0, speed) => {
	if (!Collisions.boundaries.some(b => b.collide(GameMap, player, background, player.mapPosition.x + 2 * dx, player.mapPosition.y + 2 * dy, player.width, player.height))) {
		Action.move(player, background, dx, dy, speed)
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
		dir.dx /= 13 / 7
		dir.dy /= 13 / 7
	}

	if (dir.dx) movePlayer(dir.dx, 0, moveSpeed)
	if (dir.dy) movePlayer(0, dir.dy, moveSpeed)

	keys.KeyE ? player.collect(keys, num) : player.endState(keys)

	player.changeState(keys, num, dir.dx || dir.dy)
}

// События клавиатуры
export let keys = {}
addEventListener('keydown', e => {
	if (!e.repeat) {
		keys[e.code] = true
	}
})

addEventListener('keyup', e => {
	if (!e.repeat) {
		keys[e.code] = false
	}
})

document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		GameSettings.pause = true
		for (let i in keys) {
			keys[i] = false
		}
	} else {
		GameSettings.pause = false
	}
})

// Инициализация
let ctx = init(GameMap.ID)

let lastTime = 0
requestAnimationFrame(animate)

document.addEventListener(
	'wheel',
	function (event) {
		event.preventDefault()
	},
	{ passive: false }
)
