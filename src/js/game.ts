import { init, GameSettings } from './gamelib.ts'
import { Action, Collisions } from './utils.ts'
import { Player, Resources, Settings } from './items.ts'
import { GameMap, MapItem } from './MapItems.ts'
import collisions from '../collisions/collisions.json'


// Объекты
const player = new Player()
export const resources = new Resources(GameSettings.windowWidth - 104, 0, 104, 100)
const settings = new Settings(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
const background = new GameMap()
Collisions.col(background, collisions.object)

let num = 0

type MovementKey = 'S' | 'D' | 'A' | 'W' | 'SD' | 'WD' | 'AS' | 'WA'
const movementMap: Record<MovementKey, { dx: number; dy: number; num: number }> = {
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
	background.draw()
	// отрисовка границ колизии не нужно
	for (const i of Collisions.boundaries) i.draw(ctx)

	const objects: (Player | MapItem)[] = [player, ...Collisions.items]

	objects.sort((a, b) => {
		// item , player
		const aY = a instanceof Player ? a.mapPosition.y + a.height! / 2 : a.mapPosition.y + a.height! - 6 * GameSettings.scale + a.hide!
		const bY = b instanceof Player ? b.mapPosition.y + b.height! / 2 : b.mapPosition.y + b.height! - 6 * GameSettings.scale + b.hide!
		return aY - bY
	})

	for (const i of objects) i.draw()
	resources.draw()

	settings.draw(keys)
}

// Функция для анимации
function animate(time: number) {
	if (!lastTime) lastTime = time
	const deltaTime = (time - lastTime) / 1000
	lastTime = time

	const moveSpeed = player.speed * deltaTime

	ctx.clearRect(0, 0, GameSettings.windowWidth, GameSettings.windowHeight)
	draw()
	if (!GameSettings.pause) keyDown(moveSpeed)
	player.updateFrame(moveSpeed, keys, resources)
	requestAnimationFrame(animate)
}
// Функция для движения игрока
const movePlayer = (dx = 0, dy = 0, speed: number) => {
	if (!Collisions.boundaries.some(b => b.collide(player, background, player.mapPosition.x + 2 * dx, player.mapPosition.y + 2 * dy, player.width!, player.height!, collisions.object))) {
		Action.move(player, background, dx, dy, speed)
	}
}

// Обработчик событий для клавиш
const keyDown = (moveSpeed: number) => {
	const dir = { dx: 0, dy: 0 }

	const keysPressed = [(keys.KeyW || keys.ArrowUp) && !(keys.KeyS || keys.ArrowDown) ? 'W' : null, (keys.KeyA || keys.ArrowLeft) && !(keys.KeyD || keys.ArrowRight) ? 'A' : null, (keys.KeyS || keys.ArrowDown) && !(keys.KeyW || keys.ArrowUp) ? 'S' : null, (keys.KeyD || keys.ArrowRight) && !(keys.KeyA || keys.ArrowLeft) ? 'D' : null].filter(Boolean)

	if (keysPressed.length) {
		const keyCombination = keysPressed.join('') as MovementKey
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

	player.changeState(keys, num, Boolean(dir.dx || dir.dy))
}

// События клавиатуры
export let keys = {} as Record<string, boolean>
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
