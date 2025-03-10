import { Vector2, Sprite, Menu, Animation, Text, Sound, GameSettings } from './gamelib.js'

// -----------------------------------------------------------------------------

export class GameMap extends Sprite {
	static MAPS = ['https://erikarabyan.github.io/Village-2D/assets/maps/Base.png', 'https://erikarabyan.github.io/Village-2D/assets/maps/ForestMap.png', 'https://erikarabyan.github.io/Village-2D/assets/maps/JewerlyMap.png', 'https://erikarabyan.github.io/Village-2D/assets/maps/StoneMap.png']
	static width = 1920
	static height = 1088
	static offsetX = (GameSettings.windowWidth - GameMap.width * GameSettings.scale) / 2 / GameSettings.scale
	static offsetY = (GameSettings.windowHeight - GameMap.height * GameSettings.scale) / 2 / GameSettings.scale
	// static offsetX = -2000
	// static offsetY = -2000
	static offsetY = 0
	static offsetX = -10

	static ID = 'stage'
	constructor() {
		super(GameMap.MAPS[0], GameMap.offsetX, GameMap.offsetY, GameMap.width, GameMap.height)
	}

	smoothMove(player, x, y, speed) {
		const { windowWidth, windowHeight } = GameSettings

		// останавливаем карту если игрок находится дальше границы
		let dx = player.mapPosition.x + 30 >= Player.actualPosX && player.mapPosition.x - 30 <= Player.actualPosX ? x : 0
		let dy = player.mapPosition.y + 30 >= Player.actualPosY && player.mapPosition.y - 30 <= Player.actualPosY ? y : 0

		// плавное движение
		const calcX = Player.actualPosX - player.mapPosition.x
		const calcY = Player.actualPosY - player.mapPosition.y
		if (x === 0 && Math.abs(calcX) >= 8 && this.mapPosition.x != 0) calcX > 0 ? (dx = -speed / 2) : (dx = speed / 2)
		if (y === 0 && Math.abs(calcY) >= 8 && this.mapPosition.y != 0) calcY > 0 ? (dy = -speed / 2) : (dy = speed / 2)

		// не дает выходить за границу
		dx = this.mapPosition.x - dx <= 0 ? dx : (this.mapPosition.x = 0)
		dy = this.mapPosition.y - dy <= 0 ? dy : (this.mapPosition.y = 0)
		dx = windowWidth + dx - this.mapPosition.x < this.width ? dx : this.width - (GameSettings.windowWidth - this.mapPosition.x)
		dy = windowHeight + dy - this.mapPosition.y < this.height ? dy : this.height - (GameSettings.windowHeight - this.mapPosition.y)

		this.mapPosition.set(this.mapPosition.x - dx, this.mapPosition.y - dy)
		;[...Collisions.items, ...Collisions.boundaries].forEach(i => i.moveItem(dx, dy))
	}
}



export class Player extends Animation {
	static DEFAULT_SIZE = 32
	static COLLECT_SIZE = 48
	static initialPosX = (GameSettings.windowWidth / 2 - 16 * GameSettings.scale) / GameSettings.scale
	static initialPosY = (GameSettings.windowHeight / 2 - 16 * GameSettings.scale) / GameSettings.scale
	static actualPosX = Player.initialPosX * GameSettings.scale
	static actualPosY = Player.initialPosY * GameSettings.scale
	constructor() {
		super(['https://erikarabyan.github.io/Village-2D/assets/players/Player1.png', 'https://erikarabyan.github.io/Village-2D/assets/players/Player_Actions.png'], 35, 32, 32, 32, 32, Player.initialPosX, Player.initialPosY, 60 * GameSettings.scale, 8)
		this.collecting = false
		this.colHeight = 0
		this.moveX = 0
		this.moveY = 0
	}

	_setSize(size) {
		!this.collecting ? (this.image.src = this.images[1]) : (this.image.src = this.images[0])
		this.moveHeight = size
		this.frameWidth = size
		this.width = size * GameSettings.scale
		this.height = size * GameSettings.scale
		this.frame = 0
	}

	endState(keys) {
		if (this.action && !keys.KeyE && this.collecting) {
			this._setSize(Player.DEFAULT_SIZE)
			this.move = (this.move / 3) * 2
			this.mapPosition.set(this.mapPosition.x + 8 * GameSettings.scale, this.mapPosition.y + 8 * GameSettings.scale)
			this.collecting = false
			this.colHeight -= 8 * GameSettings.scale
		}
	}

	updateFrame(keys) {
		this.timer.doTick()
		if (this.timer.tick()) {
			if (this.action && keys.KeyE) {
				if (resources.items[this.action] !== 100) {
					resources.items[this.action].collect()
				}
				this.frame = this.frame === 0 ? this.frameWidth : 0
			} else {
				this.frame = (this.frame + this.frameWidth) % (this.frameWidth * 6)
			}
			this.timer.reset()
		}
	}

	collect(keys, num) {
		if (this.action && keys.KeyE && !this.collecting) {
			this.side = num
			this._setSize(Player.COLLECT_SIZE)
			this.move = (this.move / 2) * 3
			this.mapPosition.set(this.mapPosition.x - 8 * GameSettings.scale, this.mapPosition.y - 8 * GameSettings.scale)
			this.collecting = true
			const collectMoveValues = [0, 48, 96, 144]
			this.move = collectMoveValues[this.side]
			this.colHeight += 8

			if (this.action === 7 && this.move < 192) {
				this.move += 192
			}
		}
	}

	smoothMove(background, x, y, speed, smooth) {
		x /= smooth
		y /= smooth
		speed /= smooth
		const { windowWidth, windowHeight, scale } = GameSettings
		const { mapPosition } = background

		// не дает выходить за границу
		const calcX = Player.actualPosX - this.mapPosition.x
		const calcY = Player.actualPosY - this.mapPosition.y
		let dx = Math.abs(calcX - x) <= 30 ? x : mapPosition.x == 0 || GameMap.width * scale == windowWidth - mapPosition.x ? x * 2 : 0
		let dy = Math.abs(calcY - y) <= 30 ? y : mapPosition.y == 0 || GameMap.height * scale == windowHeight - mapPosition.y ? y * 2 : 0

		// плавное движение
		if (x === 0 && Math.abs(calcX) >= 8 && mapPosition.x != 0 && GameMap.width * scale != windowWidth - mapPosition.x) calcX > 0 ? (dx = speed) : (dx = -speed)
		if (y === 0 && Math.abs(calcY) >= 8 && mapPosition.y != 0 && GameMap.height * scale != windowHeight - mapPosition.y) calcY > 0 ? (dy = speed) : (dy = -speed)

		// не дает выходить за экран
		if (this.mapPosition.x + dx >= 0 && this.mapPosition.x + this.width + dx <= GameSettings.windowWidth) {
			this.mapPosition.x += dx
		}
		if (this.mapPosition.y + dy >= 0 && this.mapPosition.y + this.height + dy <= GameSettings.windowHeight) {
			this.mapPosition.y += dy
		}
	}
}

// -----------------------------------------------------------------------------
// класс для отображения предметов на карте
export class MapItem extends Sprite {
	static TILE_SIZE = 8
	static BLOCK_SIZE = 16
	constructor(GameMap, x, y, imgPosX, imgPosY, picWidth, picHeight, boundaryConfigs, imageSrc, hide = 0) {
		super(imageSrc, x * MapItem.BLOCK_SIZE + GameMap.offsetX, y * MapItem.BLOCK_SIZE + GameMap.offsetY, picWidth * MapItem.TILE_SIZE, picHeight * MapItem.TILE_SIZE, imgPosX * MapItem.TILE_SIZE, imgPosY * MapItem.TILE_SIZE, picWidth * MapItem.TILE_SIZE, picHeight * MapItem.TILE_SIZE)
		this.boundaries = boundaryConfigs.map(
			config =>
				new Boundary({
					GameMap,
					x: x * MapItem.BLOCK_SIZE + config.x,
					y: y * MapItem.BLOCK_SIZE + config.y,
					action: config.action ? config.action : 1,
					width: config.width,
					height: config.height,
					teleport: config.teleport,
				})
		)
		this.hide = hide
	}

	moveItem(x, y) {
		this.mapPosition.set(this.mapPosition.x - x, this.mapPosition.y - y)
	}

	// draw() {
	// границы колизии предмета
	// this.boundaries[0].draw()
	// if (this.boundaries[1]) {
	// this.boundaries[1].draw()
	// }
}

export class Home extends MapItem {
	constructor(mapPosX, mapPosY, action, teleportX, teleportY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			12, // imgPosition X, Y
			4,
			8, // picWidth, picHeight
			8,
			[
				{ x: 9, y: 35, width: 45, height: 26 },
				{ x: 20, y: 61, width: 22, height: 2, action: action, teleport: [teleportX, teleportY] },
			], // bsize
			'https://erikarabyan.github.io/Village-2D/assets/map_items/TopdownForest-Props.png'
		)
	}
}

export class Tree extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY-3,
			12, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			4,
			[{ x: 6, y: 20, width: 18, height: 12, action: 7 }], // bsize
			'https://erikarabyan.github.io/Village-2D/assets/map_items/TopdownForest-Props.png'
		)
	}
}

export class Stamp extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			8, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			4,
			[{ x: 7, y: 13, width: 18, height: 12, action: 7 }], // bsize
			'https://erikarabyan.github.io/Village-2D/assets/map_items/TopdownForest-Props.png',
			-12 // hide height
		)
	}
}

export class Resource {
	constructor(img, x, y) {
		this.sprite = new Sprite(img, x / GameSettings.scale, y / GameSettings.scale, 32 / GameSettings.scale, 32 / GameSettings.scale)
		this.collected = 0
		this.inventorySize = 10
		this.text = new Text(`${this.collected} / ${this.inventorySize}`, x + 36, y + 7)
	}

	collect() {
		if (this.collected <= this.inventorySize * 10) {
			this.collected++
			this.text.setText(`${Math.floor(this.collected / 10)} / ${this.inventorySize}`)
			if (this.collected === this.inventorySize * 10) {
				this.text.color = 'green'
			}
		}
	}

	draw() {
		this.sprite.draw(32 / GameSettings.scale, 32 / GameSettings.scale)
		this.text.draw()
	}
}

export class Resources extends Menu {
	constructor(x, y, width, height) {
		super(x, y, width, height)

		this.items = {
			7: new Resource('https://erikarabyan.github.io/Village-2D/assets/Items/wood.png', x + 4, y),
			8: new Resource('https://erikarabyan.github.io/Village-2D/assets/Items/rock.png', x + 4, y + 32),
			9: new Resource('https://erikarabyan.github.io/Village-2D/assets/Items/diamond.png', x + 4, y + 64),
		}
	}

	draw() {
		super.draw()
		Object.values(this.items).forEach(i => i.draw())
	}
}

export class Option {
	constructor(text, x, y, action, num) {
		this.text = new Text(text, x, y)
		this.action = action
		this.number = num
	}

	draw(num) {
		if (this.number == num) {
			this.text.color = 'red'
		} else {
			this.text.color = 'white'
		}
		this.text.draw()
	}
}

export class Settings extends Menu {
	constructor(x, y, width, height) {
		super(x, y, width, height)
		this.music = new Sound('assets/music/funny-bgm.mp3')
		this.help = [new Sprite('assets/Items/enter.png', ((x + width) / 2 - 86) / GameSettings.scale, ((y + height) / 2 - 100) / GameSettings.scale), new Sprite('assets/Items/arrows.png', ((x + width) / 2 - 10) / GameSettings.scale, ((y + height) / 2 - 146) / GameSettings.scale)]
		this.items = [new Option('Play Music (Enter)', (x + width) / 2 - 86, (y + height) / 2 - 32, () => this.music.play(), 0), new Option('Pause Music (Enter)', (x + width) / 2 - 86, (y + height) / 2, () => this.music.pause(), 1), new Option('Volume Change (<-- -->)', (x + width) / 2 - 86, (y + height) / 2 + 32, () => this.volume(), 2)]
		this.activeItem = 0
	}

	draw(keys) {
		if (keys.Escape) {
			GameSettings.pause = !GameSettings.pause
			keys.Escape = false
		}
		if (GameSettings.pause) {
			this._draw()
			if (keys.Enter) {
				this.items[this.activeItem].action()
				keys.Enter = false
			}
			if (keys.ArrowUp) {
				this.activeItem = (this.activeItem - 1 + this.items.length) % this.items.length
				keys.ArrowUp = false
			}
			if (keys.ArrowDown) {
				this.activeItem = (this.activeItem + 1) % this.items.length
				keys.ArrowDown = false
			}
			if ((keys.ArrowLeft || keys.ArrowRight) && this.activeItem === 2) {
				this.items[this.activeItem].action()
			}
		}
	}

	_draw() {
		super.draw()
		this.help.forEach(h => h.draw())
		this.items.forEach(item => item.draw(this.activeItem))
	}

	volume(keys) {
		if (keys.ArrowLeft) {
			this.music.volume(Math.max(this.music.audio.volume - 0.08, 0))
			keys.ArrowLeft = false
		}
		if (keys.ArrowRight) {
			this.music.volume(Math.min(this.music.audio.volume + 0.08, 1))
			keys.ArrowRight = false
		}
	}
}

// -----------------------------------------------------------------------------

export class Action {
	
	static handlers = {
		2: (GameMap) => {
			Collisions.col(GameMap, collisions)
		},
		3: (GameMap) => {
			Collisions.col(GameMap, colissionsTree)
		},
		4: (GameMap) => {
			Collisions.col(GameMap, collisionsJewerly)
		},
		5: (GameMap) => {
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
			case 2439:
				const home = new Home(row, col, cell[1], cell[2], cell[3])
				Collisions.items.push(home)
				this.teleport = home.teleportPosition
				return home.boundaries

			case 101:
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