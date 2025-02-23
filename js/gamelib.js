let ctx

/**
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
function init(id, width, height) {
	let canvas = document.getElementById(id)
	ctx = canvas.getContext('2d')
	canvas.width = width
	canvas.height = height

	function updateCanvasSize() {
		const aspectRatio = 640 / 480
		const screenWidth = window.innerWidth
		const screenHeight = window.innerHeight

		if (screenWidth / screenHeight > aspectRatio) {
			canvas.style.height = `${screenHeight}px`
			canvas.style.width = `${screenHeight * aspectRatio}px`
		} else {
			canvas.style.width = `${screenWidth}px`
			canvas.style.height = `${screenWidth / aspectRatio}px`
		}
	}

	// Подстраиваем размер при загрузке
	updateCanvasSize()

	// Обновляем размер при изменении окна
	window.addEventListener('resize', updateCanvasSize)
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
	 * @param {number} width
	 * @param {number} height
	 */

	constructor(path, x, y) {
		this.image = new Image()
		this.image.src = path
		this.mapPosition = new Vector2(x, y)
	}

	draw(sx = 0, sy = 0, swidth = 0, sheight = 0) {
		if (sx !== 0 && swidth !== 0) {
			ctx.drawImage(this.image, sx, sy, swidth, sheight, this.mapPosition.x, this.mapPosition.y, this.width, this.height)
		} else if (sx !== 0) {
			ctx.drawImage(this.image, this.mapPosition.x, this.mapPosition.y, sx, sy)
		} else {
			ctx.drawImage(this.image, this.mapPosition.x, this.mapPosition.y)
		}
	}
}

// -----------------------------------------------------------------------------
// класс для отображения существ
class Animation {
	constructor(path, delay, pic_width, pic_height, p_width, p_height, posx, posy, speed) {
		this.images = path.map(src => {
			const img = new Image()
			img.src = src
			return img
		})

		this.frame = 0
		this.move = 0
		this.timer = new Timer(delay)
		this.mapPosition = new Vector2(posx, posy)
		this.picWidth = pic_width
		this.picHeight = pic_height
		this.width = p_width
		this.height = p_height
		this.side = undefined
		this.action = undefined
		this.speed = speed
	}

	updateFrame() {
		this.timer.doTick()
		this.frame = (this.frame + this.picWidth) % (this.picWidth * 6)
		this.timer.reset()
	}

	changeState(x, ismove = false) {
		if (!this.action || !keys.KeyE) {
			this.side = x
			const moveValues = [96, 0, 64, 32]
			this.move = moveValues[x] + (ismove ? 128 : 0)
		}
	}

	draw() {
		ctx.drawImage(this.images[0], this.frame, this.move, this.picWidth, this.picHeight, this.mapPosition.x, this.mapPosition.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------
// класс для отображения предметов на карте
class MapItem {
	image = new Image()

	constructor(mapPosX, mapPosY, imgPosX, imgPosY, picWidth, picHeight, boundaryConfigs, imageSrc) {
		this.mapPosition = new Vector2(mapPosX * CONFIG.BLOCK_SIZE, mapPosY * CONFIG.BLOCK_SIZE)
		this.imgPosition = new Vector2(imgPosX * CONFIG.TILE_SIZE, imgPosY * CONFIG.TILE_SIZE)
		this.picWidth = picWidth * CONFIG.TILE_SIZE
		this.picHeight = picHeight * CONFIG.TILE_SIZE
		this.height = this.picHeight - boundaryConfigs[0].height
		this.image.src = imageSrc
		this.boundaries = boundaryConfigs.map(
			config =>
				new Boundary({
					mapPosition: {
						x: this.mapPosition.x + config.x,
						y: this.mapPosition.y + config.y,
					},
					action: config.action ? config.action : 1,
					width: config.width,
					height: config.height,
					teleport: config.teleport,
				})
		)
	}

	draw() {
		// границы колизии предмета
		// this.boundaries[0].draw()
		// if (this.boundaries[1]) {
		// this.boundaries[1].draw()
		// }
		ctx.drawImage(this.image, this.imgPosition.x, this.imgPosition.y, this.picWidth, this.picHeight, this.mapPosition.x, this.mapPosition.y, this.picWidth, this.picHeight)
	}
}

// -----------------------------------------------------------------------------

class Action {
	static handlers = {
		2: () => {
			player.mapPosition.set(304, 204)
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

			default:
				if (cell !== 0) {
					return [Collisions.createBoundary(row, col, cell)]
				}
				return []
		}
	}

	static execute(action, t) {
		background.image.src = Map.MAPS[action - 2] ? Map.MAPS[action - 2] : background.image.src
		this.handlers[action]?.()
		if (t) player.mapPosition.set(...t)
	}
}

// -----------------------------------------------------------------------------
// ОДИН объект коллизии
class Boundary {
	/**
	 * @param {object} mapPosition
	 * @param {number | undefined} action
	 * @param {number} width
	 * @param {number} height
	 */
	static width = 16
	static height = 16
	constructor({ mapPosition, action = undefined, width = 16, height = 16, teleport }) {
		this.mapPosition = mapPosition
		this.action = action
		this.width = width
		this.height = height
		this.teleport = teleport
		if (this.width < 0) {
			this.mapPosition.x += this.width + 16
			this.width *= -1
		}
		if (this.height < 0) {
			this.mapPosition.y += this.height + 16
			this.height *= -1
		}
	}

	collide(px, py, pw, ph) {
		player.action = undefined
		if (px < this.mapPosition.x + this.width - 12 && px + pw > this.mapPosition.x + 12 && py < this.mapPosition.y + this.height - 18 && py + ph > this.mapPosition.y + 9) {
			if (this.action !== 1) {
				Action.execute(this.action, this.teleport)
				player.action = this.action
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
			mapPosition: new Vector2(row * Boundary.width, col * Boundary.height),
			action: typeof cell === 'object' ? cell[0] : cell,
			width: width,
			height: height,
		})
	}

	static addStaticBoundaries(acc) {
		acc.push(new Boundary({ mapPosition: { x: 0, y: 14 }, action: 1, width: 40 * 16, height: 0 }), new Boundary({ mapPosition: { x: 4, y: 0 }, action: 1, width: 0, height: 30 * 16 }), new Boundary({ mapPosition: { x: 0, y: 30 * 16 }, action: 1, width: 40 * 16, height: 0 }), new Boundary({ mapPosition: { x: 40 * 16 - 4, y: 0 }, action: 1, width: 0, height: 30 * 16 }))
	}

	static col(collisions) {
		Collisions.items = []

		Collisions.boundaries = collisions.reduce((acc, cell, index) => {
			const col = Math.floor(index / 40)
			const row = index % 40

			const newBoundaries = Action.processObject(row, col, cell)
			acc.push(...newBoundaries)

			if (cell !== 0) {
				Collisions.addStaticBoundaries(acc)
			}
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
