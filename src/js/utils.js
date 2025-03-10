import { Vector2, GameSettings } from "./gamelib.js"
import { Home, Tree } from './MapItems.js'


export class Action {
	static handlers = {
		2: GameMap => {
			Collisions.col(GameMap, collisions)
		},
		3: GameMap => {
			Collisions.col(GameMap, colissionsTree)
		},
		4: GameMap => {
			Collisions.col(GameMap, collisionsJewerly)
		},
		5: GameMap => {
			Collisions.col(GameMap, collisionsStones)
		},
	}

	static move(player, background, dx, dy, speed) {
		const smooth = 2
		speed /= smooth
		player.smoothMove(background, dx, dy, speed, smooth)
		background.smoothMove(player, dx, dy, speed)
	}
	static processObject(GameMap, row, col, cell) {
		switch (cell[0]) {
			case 2472:
				const home = new Home(row, col, cell[1], cell[2], cell[3])
				Collisions.items.push(home)
				this.teleport = home.teleportPosition
				return home.boundaries

			case 2536:
				const tree = new Tree(row, col)
				Collisions.items.push(tree)
				return tree.boundaries

			case 102:
				const stamp = new Stamp(row, col)
				Collisions.items.push(stamp)
				return stamp.boundaries

			default:
				if (cell !== 0) {
					return [Collisions.createBoundary(GameMap, row, col, cell)]
				}
				return []
		}
	}

	static execute(GameMap, background, action, t) {
		background.image.src = GameMap.MAPS[action - 2] || background.image.src
		this.handlers[action]?.(GameMap)

		const deviationX = GameMap.offsetX * GameSettings.scale
		const deviationY = GameMap.offsetY * GameSettings.scale

		t[0] = GameSettings.windowWidth / 2 - t[0] * GameSettings.scale
		t[1] = GameSettings.windowHeight / 2 - t[1] * GameSettings.scale

		background.mapPosition.set(t[0], t[1])
		;[...Collisions.boundaries, ...Collisions.items].forEach(i => {
			i.mapPositionyx += t[0] - deviationX
			i.mapPosition.y += t[1] - deviationY
		})
	}
}

// -----------------------------------------------------------------------------
// ОДИН объект колизии
export class Boundary {
	/**
	 * @param {object} mapPosition
	 * @param {number | undefined} action
	 * @param {number} width
	 * @param {number} height
	 */
	static width = 16
	static height = 16
	constructor({ GameMap, x, y, action = undefined, width = 16, height = 16, teleport }) {
		this.mapPosition = new Vector2(x * GameSettings.scale + GameMap.offsetX * GameSettings.scale, y * GameSettings.scale + GameMap.offsetY * GameSettings.scale)
		this.action = action
		this.width = width * GameSettings.scale
		this.height = height * GameSettings.scale
		this.teleport = teleport
		if (this.width < 0) {
			this.mapPosition.x += this.width + 16 * GameSettings.scale
			this.width *= -1
		}
		if (this.height < 0) {
			this.mapPosition.y += this.height + 16 * GameSettings.scale
			this.height *= -1
		}
	}

	moveItem(x, y) {
		this.mapPosition.set(this.mapPosition.x - x, this.mapPosition.y - y)
	}

	collide(GameMap, player, background, px, py, pw, ph) {
		player.action = undefined
		if (px < this.mapPosition.x + this.width - 12 * GameSettings.scale && px + pw > this.mapPosition.x + 12 * GameSettings.scale && py < this.mapPosition.y + this.height - 18 * GameSettings.scale && py + ph > this.mapPosition.y + 9 * GameSettings.scale) {
			if (this.action !== 1) {
				player.action = this.action
				if (this.teleport) Action.execute(GameMap, background, this.action, this.teleport)
			}
			return true
		}
		return false
	}

	draw(ctx) {
		ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
		ctx.fillRect(this.mapPosition.x, this.mapPosition.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------
// Класс для создания и управления коллизиями карты
export class Collisions {
	static boundaries = []
	static items = []
	static width = 120
	static height = 68

	static createBoundary(GameMap, row, col, cell) {
		const width = typeof cell === 'object' ? cell[1] * 16 : 16
		const height = typeof cell === 'object' ? cell[2] * 16 : 16

		return new Boundary({
			GameMap,
			x: row * Boundary.width,
			y: col * Boundary.height,
			action: typeof cell === 'object' ? cell[0] : cell,
			width: width,
			height: height,
		})
	}

	static col(GameMap, collisions) {
		Collisions.items = []
		Collisions.boundaries = collisions.reduce((acc, cell, index) => {
			const row = index % Collisions.width
			const col = Math.floor(index / Collisions.width)

			const newBoundaries = Action.processObject(GameMap, row, col, cell)
			acc.push(...newBoundaries)

			return acc
		}, [])
	}
}
