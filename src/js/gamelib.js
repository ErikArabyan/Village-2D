let ctx

/**
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
export function init(id) {
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
	return ctx
}

// -----------------------------------------------------------------------------

export class GameSettings {
	static scale = 4
	static windowWidth = window.innerWidth
	static windowHeight = window.innerHeight
	static pause = false
}

// -----------------------------------------------------------------------------

export class Vector2 {
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
export class Sprite {
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
export class Animation extends Sprite {
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

	changeState(keys, x, ismove = false) {
		if (!this.action || !keys.KeyE) {
			this.side = x
			const moveValues = [0, 32, 64, 96, 128, 160, 192, 224]
			this.move = moveValues[x] + (ismove ? (this.sideCound == 8 ? 256 : 128) : 0)
		}
	}
}

// -----------------------------------------------------------------------------

export class Menu {
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

export class Sound {
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

export class Text {
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

export class Timer {
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

export class List {
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

export class Storage {
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
