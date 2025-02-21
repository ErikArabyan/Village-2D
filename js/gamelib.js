/**
 * Libreria JavaScript per lo sviluppo di videogiochi 2D.
 * @author Fabio Barosi
 * @version 1.0
 */

let ctx

/**
 * Inizializza il canvas di disegno e le variabili globali.
 * @param {string} id - ID dell'elemento html canvas.
 * @param {number} x - Posizione x del canvas.
 * @param {number} y - Posizione y del canvas.
 * @param {number} width - Larghezza del canvas.
 * @param {number} height - Altezza del canvas.
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

class Sprite {
	/**
	 * @param {string} path
	 * @param {number} width
	 * @param {number} height
	 */

	constructor(path, width, height) {
		this.image = new Image()
		this.image.src = path
		this.mapPosition = new Vector2()
		this.width = width
		this.height = height
		// this.speed = new Vector2()
	}

	draw(x = this.mapPosition.x, y = this.mapPosition.y) {
		ctx.drawImage(this.image, x, y)
	}
}

// -----------------------------------------------------------------------------

class Animation {
	static DEFAULT_SIZE = 32
	static COLLECT_SIZE = 48

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
		this.collecting = false
		this.speed = speed
	}

	_setSize(size, frameReset = 0) {
		;[this.images[0], this.images[1]] = [this.images[1], this.images[0]]
		this.picWidth = size
		this.picHeight = size
		this.width = size
		this.height = size
		this.frame = frameReset
	}

	updateFrame() {
		this.timer.doTick()

		if (this.timer.tick()) {
			if (this.action && keys.KeyE) {
				if (items.items[this.action - 7] !== 100) {
					items.items[this.action - 7] += 1
				}
				this.frame = this.frame === 0 ? this.picWidth : 0
			} else {
				this.frame = (this.frame + this.picWidth) % (this.picWidth * 6)
			}
			this.timer.reset()
		}
	}

	endState() {
		if (this.action && !keys.KeyE && this.collecting) {
			this._setSize(Animation.DEFAULT_SIZE)
			this.move = (this.move / 3) * 2
			this.mapPosition.set(this.mapPosition.x + 8, this.mapPosition.y + 8)
			keys.KeyE = false
			this.collecting = false
		}
	}

	changeState(x, ismove = false) {
		if (!this.action || !keys.KeyE) {
			this.side = x
			const moveValues = [96, 0, 64, 32]
			this.move = moveValues[x] + (ismove ? 128 : 0)
		}
	}

	collect(num) {
		if (this.action && keys.KeyE && !this.collecting) {
			this.side = num
			this._setSize(Animation.COLLECT_SIZE)
			this.move = (this.move / 2) * 3
			this.mapPosition.set(this.mapPosition.x - 8, this.mapPosition.y - 8)
			this.collecting = true
			const collectMoveValues = [144, 0, 96, 48]
			this.move = collectMoveValues[this.side]

			if (this.action === 7 && this.move < 192) {
				this.move += 192
			}
		}
	}

	draw() {
		ctx.drawImage(this.images[0], this.frame, this.move, this.picWidth, this.picHeight, this.mapPosition.x, this.mapPosition.y, this.width, this.height)
	}
}


// -----------------------------------------------------------------------------

class Collisions {
	static boundaries = []
	static items = []

	static col(collisions, ...boundaries) {
		Collisions.items = []
		Collisions.boundaries = collisions.reduce((acc, cell, index) => {
			const row = Math.floor(index / 40)
			const col = index % 40
			if (cell[0] == 100) {
				const x = new Home(col, row, cell[1])
				Collisions.items.push(x)
				x.boundaries.map(i => acc.push(i))
			} else if (cell[0] == 101) {
				const x = new Tree(col, row)
				Collisions.items.push(x)
				x.boundaries.map(i => acc.push(i))
			} else if (cell !== 0) {
				acc.push(
					new Boundary({
						mapPosition: new Vector2(col * Boundary.width, row * Boundary.height),
						action: typeof cell == 'object' ? cell[0] : cell,
						width: typeof cell == 'object' ? cell[1] * 16 : 16,
						height: typeof cell == 'object' ? cell[2] * 16 : 16,
					})
				)
				acc.push(new Boundary({ mapPosition: { x: 0, y: 14 }, action: 1, width: 40 * 16, height: 0 }), new Boundary({ mapPosition: { x: 4, y: 0 }, action: 1, width: 0, height: 30 * 16 }), new Boundary({ mapPosition: { x: 0, y: 30 * 16 }, action: 1, width: 40 * 16, height: 0 }), new Boundary({ mapPosition: { x: 40 * 16 - 4, y: 0 }, action: 1, width: 0, height: 30 * 16 }))
				acc.push(...boundaries)
			}
			return acc
		}, [])
	}

	static draw(mapItems) {
		Collisions.items = mapItems.reduce((acc, cell) => {
			if (cell[0] == 100) {
				acc.push(new Home(...cell.slice(1)))
			}
			if (cell[0] == 101) {
				acc.push(new Tree(...cell.slice(1)))
			}
			return acc
		}, [])
	}
}
// -----------------------------------------------------------------------------

class Boundary {
	/**
	 * @param {object} mapPosition
	 * @param {number | undefined} action
	 * @param {number} width
	 * @param {number} height
	 */
	static width = 16
	static height = 16
	constructor({ mapPosition, action = undefined, width = 16, height = 16 }) {
		this.mapPosition = mapPosition
		this.action = action
		this.width = width
		this.height = height
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
			if (this.action == 1) return true
			background.image.src = CONFIG.MAPS[this.action - 2] ? CONFIG.MAPS[this.action - 2] : background.image.src

			switch (this.action) {
				case 2:
					player.mapPosition.set(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y)
					Collisions.col(collisions)
					break
				case 3:
					player.mapPosition.set(220, 200)
					Collisions.col(colissionsTree)
					break
				case 4:
					player.mapPosition.set(310, 230)
					Collisions.col(collisionsJewerly)
					break
				case 5:
					player.mapPosition.set(100, 150)
					Collisions.col(collisionsStones)
					break
				default:
					player.action = this.action
					return true
			}
		}
		return false
	}

	draw() {
		ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
		ctx.fillRect(this.mapPosition.x, this.mapPosition.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------

class Menu {
	/**
	 * @param {number} x - Posizione x del menu.
	 * @param {number} y - Posizione y del menu.
	 * @param {string[]} items - Voci di menu.
	 */
	constructor(x, y, items, icons = []) {
		this.items = items
		this.x = x
		this.y = y
		this.font = 'Arial'
		this.size = 22
		this.standardColor = 'white'
		this.selectedColor = 'red'
		this.index = 0
		this.showMenu = false
		this.previousKey = false
		this.images = icons.map(src => {
			const img = new Image()
			img.src = src
			return img
		})
	}

	show(key) {
		if (key && !this.previousKey) {
			this.showMenu = !this.showMenu
		}
		this.previousKey = key
		return this.showMenu
	}

	update() {
		if (keys.ArrowUp) {
			this.index = (this.index - 1 + this.items.length) % this.items.length
			keys.ArrowUp = false
		}
		if (keys.ArrowDown) {
			this.index = (this.index + 1) % this.items.length
			keys.ArrowDown = false
		}
		if (keys.Enter) {
			switch (this.index) {
				case 0:
					music.play()
					break
				case 1:
					music.pause()
					break
			}
			keys.Enter = false
		}
		if (keys.ArrowLeft) {
			music.volume(Math.max(music.audio.volume - 0.08, 0))
			keys.ArrowLeft = false
		}
		if (keys.ArrowRight) {
			music.volume(Math.min(music.audio.volume + 0.08, 1))
			keys.ArrowRight = false
		}
	}

	draw() {
		if (this.showMenu) {
			let y = this.y
			ctx.font = `${this.size}px ${this.font}`
			ctx.fillStyle = 'rgba(77, 77, 77, 0.9)'
			ctx.textAlign = 'center'
			ctx.fillRect(0, 0, 640, 480)
			for (let i = 0; i < this.items.length; i++) {
				ctx.fillStyle = i === this.index ? this.selectedColor : this.standardColor
				ctx.fillText(this.items[i], this.x, y)
				y += this.size + 10
			}
		}
	}

	drawResources() {
		let y = this.y
		ctx.font = `${this.size}px ${this.font}`
		ctx.fillStyle = 'rgba(77, 77, 77, 0.9)'
		ctx.fillRect(540, 0, 100, 90)
		for (let i = 0; i < this.items.length; i++) {
			ctx.fillStyle = this.standardColor
			ctx.drawImage(this.images[i], 545, y - 18, 24, 24)
			ctx.fillStyle = this.items[i] == 100 ? 'green' : 'red'
			ctx.fillText(Math.floor(this.items[i] / 10), this.x, y)
			ctx.fillText(['/', '/', '/'][i], this.x + (this.items[i] == 100 ? 30 : 15), y)
			ctx.fillText(10, this.x + (this.items[i] == 100 ? 40 : 25), y)
			y += this.size + 10
		}
	}
}

// -----------------------------------------------------------------------------

class Sound {
	/**
	 * @param {string} path - Percorso della risorsa.
	 */
	constructor(path) {
		this.audio = new Audio(path)
	}

	/**
	 * Imposta il loop (true o false) del suono.
	 * @param {boolean} value - Loop (true o false) del suono.
	 */
	loop(value) {
		this.audio.loop = value
	}

	/**
	 * Imposta il volume [0.0; 1.0] del suono.
	 * @param {number} value - Volume [0.0; 1.0] del suono.
	 */
	volume(value) {
		this.audio.volume = value
	}

	/**
	 * Esegue il suono.
	 */
	play() {
		this.audio.play()
	}

	/**
	 * Esegue il suono senza attendere che il precedente sia terminato.
	 */
	playEffect() {
		this.audio.cloneNode().play()
	}

	/**
	 * Mette in pausa il suono.
	 */
	pause() {
		this.audio.pause()
	}

	/**
	 * Interrompe il suono.
	 */
	stop() {
		this.audio.pause()
		this.audio.currentTime = 0
	}
}

// -----------------------------------------------------------------------------

class Text {
	/**
	 * Crea un nuovo oggetto Text.
	 */
	constructor() {
		this.mapPosition = new Vector2()
		this.text = ''
		this.font = 'Arial'
		this.size = 20
		this.color = 'white'
	}

	/**
	 * Disegna il testo.
	 */
	draw() {
		ctx.font = `${this.size}px ${this.font}`
		ctx.fillStyle = this.color
		ctx.fillText(this.text, this.mapPosition.x, this.mapPosition.y)
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un timer.
 */
class Timer {
	/**
	 * @param {number} delay - Tempo di attesa del timer.
	 */
	constructor(delay) {
		this.delay = delay
		this.elapsed = 0
	}

	/**
	 * Resetta il timer.
	 */
	reset() {
		this.elapsed = 0
	}

	/**
	 * Attiva il tick del timer.
	 */
	doTick() {
		this.elapsed += 1
	}

	/**
	 * Verifica il tick del timer.
	 * @return {boolean} true se il timer ha eseguito un tick, altrimenti false.
	 */
	tick() {
		if (this.elapsed >= this.delay) {
			this.elapsed = 0
			return true
		}
		return false
	}

	/**
	 * Aggiorna il timer.
	 */
	update() {
		if (this.elapsed < this.delay) {
			this.elapsed += 17 // 1000 ms / 60 fps = 16.7
		}
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di una lista di elementi.
 */
class List {
	/**
	 * Crea un nuovo oggetto List.
	 */
	constructor() {
		this.items = []
	}

	/**
	 * Aggiunge un nuovo elemento alla lista.
	 * @param {Object} item - Elemento da aggiungere alla lista.
	 */
	add(item) {
		this.items.push(item)
	}

	/**
	 * Svuota la lista.
	 */
	clear() {
		this.items = []
	}

	/**
	 * Ritorna l'elemento in posizione index della lista.
	 * @param {number} index - Indice della lista.
	 * @return {Object} Elemento in posizione index della lista.
	 */
	get(index) {
		if (index >= 0 && index < this.items.length) {
			return this.items[index]
		}
	}

	/**
	 * Applica il metodo filter alla lista.
	 * @param {requestCallback} callback - Callback applicata al metodo filter.
	 */
	filter(callback) {
		this.items = this.items.filter(callback)
	}

	/**
	 * Esegue il metodo forEach alla lista.
	 * @param {requestCallback} callback - Callback applicata al metodo forEach.
	 */
	forEach(callback) {
		this.items.forEach(callback)
	}

	/**
	 * Ritorna il numero di elementi della lista.
	 * @return {number} Numero di elementi della lista.
	 */
	count() {
		return this.items.length
	}

	/**
	 * Rimuove l'elemento in posizione index della lista.
	 * @param {number} index - Indice della lista.
	 */
	remove(index) {
		if (index >= 0 && index < this.items.length) {
			this.items.splice(index, 1)
		}
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per il salvataggio e il caricamento di dati nello storage.
 */
class Storage {
	/**
	 * Crea un nuovo oggetto Storage.
	 */
	constructor() {}

	/**
	 * Memorizza un valore nello storage.
	 * @param {string} key - Chiave associata al valore da memorizzare nello storage.
	 * @param {Object} value - Valore da memorizzare nello storage.
	 */
	save(key, value) {
		localStorage.setItem(key, value)
	}

	/**
	 * Ritorna un valore memorizzato nello storage.
	 * @param {string} key - Chiave associata al valore memorizzato nello storage.
	 * @return {Object} Valore memorizzato nello storage.
	 */
	load(key) {
		let value = localStorage.getItem(key)
		return value
	}

	/**
	 * Cancella un valore memorizzato nello storage.
	 * @param {string} key - Chiave associata al valore memorizzato nello storage.
	 */
	remove(key) {
		localStorage.removeItem(key)
	}

	/**
	 * Cancella tutti i valori memorizzati nello storage.
	 */
	clear() {
		localStorage.clear()
	}
}
