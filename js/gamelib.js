let ctx

/**
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
function init(id) {
	let canvas = document.getElementById(id)
	ctx = canvas.getContext('2d')
	canvas.width = GameSettings.windowWidth
	canvas.height = GameSettings.windowHeight

	function updateCanvasSize() {
		ctx.imageSmoothingEnabled = false
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
	}
	updateCanvasSize()

	window.addEventListener('resize', e => {
		updateCanvasSize()
	})
}

// -----------------------------------------------------------------------------

class Vector2 {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	set(x, y) {
		this.x = x
		this.y = y
	}
}

// -----------------------------------------------------------------------------
// класс для отображения карты
class Sprite {
	/**
	 * @param {string} path
	 * @param {number} mapX // позиция на карте
	 * @param {number} mapY // позиция на карте
	 * @param {number} frame // позиция среза
	 * @param {number} move // позиция среза
	 * @param {number} frameWidth // размер среза
	 * @param {number} moveHeight // размер среза
	 * @param {number} width // размер на карте
	 * @param {number} height // размер на карте
	 */

	constructor(path, mapX, mapY, width, height, frame, move, frameWidth, moveHeight) {
		this.image = new Image()
		this.image.src = path
		this.mapPosition = new Vector2(mapX * GameSettings.scale, mapY * GameSettings.scale)
		this.frame = frame
		this.move = move
		this.frameWidth = frameWidth
		this.moveHeight = moveHeight
		this.width = width * GameSettings.scale
		this.height = height * GameSettings.scale
	}

	draw() {
		if (this.frameWidth) {
			ctx.drawImage(this.image, this.frame, this.move, this.frameWidth, this.moveHeight, this.mapPosition.x, this.mapPosition.y, this.width, this.height)
		} else if (this.width) {
			ctx.drawImage(this.image, this.mapPosition.x, this.mapPosition.y, this.width, this.height)
		} else {
			ctx.drawImage(this.image, this.mapPosition.x, this.mapPosition.y)
		}
	}
}

// -----------------------------------------------------------------------------
// класс для отображения существ
class Animation extends Sprite {
	constructor(paths, delay, pic_width, pic_height, width, height, x, y, speed, sideCound = 4) {
		super(paths[0], x, y, width, height, 0, 0, pic_width, pic_height)
		this.images = paths
		this.timer = new Timer(delay)
		this.side = null
		this.action = null
		this.speed = speed
		this.sideCound = sideCound
	}

	updateFrame() {
		this.timer.doTick()
		if (this.timer.tick()) {
			this.frame = (this.frame + this.picWidth) % (this.picWidth * 6)
			this.timer.reset()
		}
	}

	changeState(x, ismove = false) {
		if (!this.action || !keys.KeyE) {
			this.side = x
			const moveValues = [0, 32, 64, 96, 128, 160, 192, 224]
			this.move = moveValues[x] + (ismove ? (this.sideCound == 8 ? 256 : 128) : 0)
		}
	}
}

// -----------------------------------------------------------------------------
// класс для отображения предметов на карте
class MapItem extends Sprite {
	static TILE_SIZE = 8
	static BLOCK_SIZE = 16
	constructor(x, y, imgPosX, imgPosY, picWidth, picHeight, boundaryConfigs, imageSrc, hide = 0) {
		super(imageSrc, x * MapItem.BLOCK_SIZE + GameMap.offsetX, y * MapItem.BLOCK_SIZE + GameMap.offsetY, picWidth * MapItem.TILE_SIZE, picHeight * MapItem.TILE_SIZE, imgPosX * MapItem.TILE_SIZE, imgPosY * MapItem.TILE_SIZE, picWidth * MapItem.TILE_SIZE, picHeight * MapItem.TILE_SIZE)
		this.boundaries = boundaryConfigs.map(
			config =>
				new Boundary({
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

// -----------------------------------------------------------------------------

class Action {
	static handlers = {
		2: () => {
			Collisions.col(collisions)
		},
		3: () => {
			Collisions.col(colissionsTree)
		},
		4: () => {
			Collisions.col(collisionsJewerly)
		},
		5: () => {
			Collisions.col(collisionsStones)
		},
	}

	static move(dx, dy, speed) {
		const smooth = 2
		speed /= smooth
		player.smoothMove(dx, dy, speed, smooth)
		background.smoothMove(dx, dy, speed)
	}

	static processObject(row, col, cell) {
		switch (cell[0]) {
			case 100:
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
					return [Collisions.createBoundary(row, col, cell)]
				}
				return []
		}
	}

	static execute(action, t) {
		background.image.src = GameMap.MAPS[action - 2] || background.image.src
		this.handlers[action]?.()

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
class Boundary {
	/**
	 * @param {object} mapPosition
	 * @param {number | undefined} action
	 * @param {number} width
	 * @param {number} height
	 */
	static width = 16
	static height = 16
	constructor({ x, y, action = undefined, width = 16, height = 16, teleport }) {
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

	collide(px, py, pw, ph) {		
		player.action = undefined
		if (px < this.mapPosition.x + this.width - 12 * GameSettings.scale && px + pw > this.mapPosition.x + 12 * GameSettings.scale && py < this.mapPosition.y + this.height - 18 * GameSettings.scale && py + ph > this.mapPosition.y + 9 * GameSettings.scale) {
			if (this.action !== 1) {				
				player.action = this.action
				if (this.teleport) Action.execute(this.action, this.teleport)
			}
			return true
		}
		return false
	}

	draw() {
		ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
		ctx.fillRect(this.mapPosition.x, this.mapPosition.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------
// Класс для создания и управления коллизиями карты
class Collisions {
	static boundaries = []
	static items = []

	static createBoundary(row, col, cell) {
		const width = typeof cell === 'object' ? cell[1] * 16 : 16
		const height = typeof cell === 'object' ? cell[2] * 16 : 16

		return new Boundary({
			x: row * Boundary.width,
			y: col * Boundary.height,
			action: typeof cell === 'object' ? cell[0] : cell,
			width: width,
			height: height,
		})
	}

	static col(collisions) {
		Collisions.items = []
		Collisions.boundaries = collisions.reduce((acc, cell, index) => {
			const col = Math.floor(index / 40)
			const row = index % 40

			const newBoundaries = Action.processObject(row, col, cell)
			acc.push(...newBoundaries)

			return acc
		}, [])
	}
}

// -----------------------------------------------------------------------------

class Menu {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {string[]} items
	 */
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	draw() {
		ctx.fillStyle = 'rgba(77, 77, 77, 0.9)'
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------

class Sound {
	/**
	 * @param {string} path
	 */
	constructor(path) {
		this.audio = new Audio(path)
		this.audio.volume = 0.3
	}

	/**
	 * @param {boolean} value
	 */
	loop(value) {
		this.audio.loop = value
	}

	/**
	 * @param {number} value Volume [0.0; 1.0]
	 */
	volume(value) {
		this.audio.volume = value
	}

	play() {
		this.audio.play()
	}

	playEffect() {
		this.audio.cloneNode().play()
	}

	pause() {
		this.audio.pause()
	}

	stop() {
		this.audio.pause()
		this.audio.currentTime = 0
	}
}

// -----------------------------------------------------------------------------

class Text {
	constructor(text, x, y) {
		this.text = text
		this.font = 'Arial'
		this.size = 20
		this.mapPosition = new Vector2(x, y)
		this.color = 'white'
	}

	setText(text) {
		this.text = text
	}

	draw() {
		ctx.font = `${this.size}px ${this.font}`
		ctx.fillStyle = this.color
		ctx.textAlign = 'left'
		ctx.textBaseline = 'top'
		ctx.fillText(this.text, this.mapPosition.x, this.mapPosition.y)
	}
}

// -----------------------------------------------------------------------------

class Timer {
	/**
	 * @param {number} delay
	 */
	constructor(delay) {
		this.delay = delay
		this.elapsed = 0
	}

	reset() {
		this.elapsed = 0
	}

	doTick() {
		this.elapsed += 1
	}

	/**
	 * @return {boolean}
	 */
	tick() {
		if (this.elapsed >= this.delay) {
			this.elapsed = 0
			return true
		}
		return false
	}

	update() {
		if (this.elapsed < this.delay) {
			this.elapsed += 17 // 1000 ms / 60 fps = 16.7
		}
	}
}

// -----------------------------------------------------------------------------

class List {
	constructor() {
		this.items = []
	}

	/**
	 * @param {Object} item
	 */
	add(item) {
		this.items.push(item)
	}

	clear() {
		this.items = []
	}

	/**
	 * @param {number} index
	 * @return {Object}
	 */
	get(index) {
		if (index >= 0 && index < this.items.length) {
			return this.items[index]
		}
	}

	/**
	 * @param {requestCallback} callback
	 */
	filter(callback) {
		this.items = this.items.filter(callback)
	}

	/**
	 * @param {requestCallback} callback
	 */
	forEach(callback) {
		this.items.forEach(callback)
	}

	/**
	 * @return {number}
	 */
	count() {
		return this.items.length
	}

	/**
	 * @param {number} index
	 */
	remove(index) {
		if (index >= 0 && index < this.items.length) {
			this.items.splice(index, 1)
		}
	}
}

// -----------------------------------------------------------------------------

class Storage {
	constructor() {}

	/**
	 * @param {string} key
	 * @param {Object} value
	 */
	save(key, value) {
		localStorage.setItem(key, value)
	}

	/**
	 * @param {string} key
	 * @return {Object}
	 */
	load(key) {
		let value = localStorage.getItem(key)
		return value
	}

	/**
	 * @param {string} key
	 */
	remove(key) {
		localStorage.removeItem(key)
	}

	clear() {
		localStorage.clear()
	}
}
