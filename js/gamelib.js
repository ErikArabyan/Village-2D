/**
 * Libreria JavaScript per lo sviluppo di videogiochi 2D.
 * @author Fabio Barosi
 * @version 1.0
 */

let ctx
let raf

/**
 * Inizializza il canvas di disegno e le variabili globali.
 * @param {string} id - ID dell'elemento html canvas.
 * @param {number} x - Posizione x del canvas.
 * @param {number} y - Posizione y del canvas.
 * @param {number} width - Larghezza del canvas.
 * @param {number} height - Altezza del canvas.
 */
function init(id, x, y, width, height) {
	let canvas = document.getElementById(id)
	ctx = canvas.getContext('2d')
	canvas.style.position = 'absolute'
	canvas.style.left = x + 'px'
	canvas.style.top = y + 'px'
	canvas.width = width
	canvas.height = height
	raf = undefined
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un vettore 2D.
 */
class Vector2 {
	/**
	 * Crea un nuovo oggetto Vector2.
	 */
	constructor() {
		this.x = 0
		this.y = 0
	}

	/**
	 * Imposta le componenti x e y del vettore.
	 * @param {number} x - Componente x del vettore.
	 * @param {number} y - Componente y del vettore.
	 */
	set(x, y) {
		this.x = x
		this.y = y
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di uno sprite.
 */
class Sprite {
	/**
	 * Crea un nuovo oggetto Sprite.
	 * @param {string} path - Percorso della risorsa.
	 * @param {number} width - Larghezza dello sprite.
	 * @param {number} height - Altezza dello sprite.
	 */

	constructor(path, width, height) {
		this.image = new Image()
		this.image.src = path
		this.position = new Vector2()
		this.width = width
		this.height = height
		this.speed = new Vector2()
	}

	/**
	 * Verifica la collisione tra due sprite.
	 * @param {Sprite} sprite - Sprite con cui verificare la collisione.
	 * @return {boolean} true se i due sprite collidono, altrimenti false.
	 */
	collide(px, py) {
		return px < this.position.x + this.width - 12 && px > this.position.x - 4 && py < this.position.y + this.height - 21 && py > this.position.y - 2
	}

	/**
	 * Disegna lo sprite.
	 */
	draw(x = this.position.x, y = this.position.y) {
		ctx.drawImage(this.image, x, y)
	}
}

// -----------------------------------------------------------------------------

class Boundary {
	/**
	 * @param {object} position
	 * @param {string} isAction
	 * @param {number} width
	 * @param {number} height
	 */
	static width = 16
	static height = 16
	constructor({ position, map = '' }) {
		this.position = position
		this.map = map
		this.width = 16
		this.height = 16
	}

	collide(px, py, ph, pw) {
		if (this.map == '') {
			return !(
				(
					px < this.position.x + this.width - 6 && //right border
					px > this.position.x - this.width + 6 && //left border
					py < this.position.y - this.height + 16 && //bottom border
					py > this.position.y - 22
				) //top border
			)
		} else {
			if (
				this.map &&
				px < this.position.x + this.width - 6 && //right border
				px > this.position.x - this.width + 6 && //left border
				py < this.position.y - this.height + 16 && //bottom border
				py > this.position.y - 22
			) {
				background.image.src = this.map
				switch (this.map) {
					case 'assets/maps/ForestMap.jpg':
						[boundaries, battleZones] = col(colissionsTree)
						battleZones = []
						//console.log(boundaries);	
						break
					case 'assets/maps/JewerlyMap.png':
						;[boundaries, battleZones] = col(collisionsJewerly)
						battleZones = []
						//console.log(boundaries);
						break
					case 'assets/maps/StoneMap.jpg':
						;[boundaries, battleZones] = col(collisionsStones)
						battleZones = []
						//console.log(boundaries);
						
						break
				}
				console.log(this.map)
			}
			return true
		}
	}

	draw() {
		ctx.fillStyle = 'rgba(255, 0, 0, 0.0)'
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un tasto.
 */
class Key {
	/**
	 * Crea un nuovo oggetto Key.
	 * @param {string} key - Codice o carattere associato al tasto.
	 * @param {boolean} pressed - Codice o carattere associato al tasto.
	 */
	constructor(key) {
		this.key = key
		this.pressed = false
	}

	/**
	 * Gestisce l'evento relativo alla pressione del tasto.
	 * @param {Object} e - Parametro relativo all'evento.
	 */
	keyDownHandler(e) {
		if (e.key == this.key) {
			this.pressed = true
		}
	}

	/**
	 * Gestisce l'evento relativo al rilascio del tasto.
	 * @param {Object} e - Parametro relativo all'evento.
	 */
	keyUpHandler(e) {
		if (e.key == this.key) {
			this.pressed = false
		}
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un suono.
 */
class Sound {
	/**
	 * Crea un nuovo oggetto Sound.
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

/**
 * Classe per la gestione di un testo.
 */
class Text {
	/**
	 * Crea un nuovo oggetto Text.
	 */
	constructor() {
		this.position = new Vector2()
		this.text = ''
		this.font = 'Arial'
		this.size = 20
		this.color = 'white'
	}

	/**
	 * Disegna il testo.
	 */
	draw() {
		//ctx.drawImage(this.image, точка начала обрезки, размер окна обрезки, расположение на карте, масштаб);
		//this.images[this.frame].onload = () =>{
		ctx.font = this.size + 'px ' + this.font
		ctx.fillStyle = this.color
		ctx.fillText(this.text, this.position.x, this.position.y)
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un timer.
 */
class Timer {
	/**
	 * Crea un nuovo oggetto Timer.
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
		this.elapsed = this.delay + 1
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
 * Classe per la gestione di un'animazione.
 */
class Animation {
	/**
	 * Crea un nuovo oggetto Animation.
	 * @param {string[]} path - Percorso delle risorse.
	 * @param {number} delay - Tempo di attesa dell'animazione.
	 */
	constructor(path, delay, player_width, player_height) {
		this.images = []
		for (let e of path) {
			let img = new Image()
			img.src = e
			this.images.push(img)
		}
		this.frame = 0
		this.frames = this.images.length
		this.timer = new Timer(delay)
		this.position = new Vector2()
		this.rotation = 1
		this.width = player_width
		this.height = player_height
	}

	/**
	 * Resetta l'animazione.
	 */
	reset() {
		this.frame = 0
		//this.timer.reset();
	}

	/**
	 * Aggiorna l'animazione.
	 */
	// update() {
	// 	this.timer.update();
	// 	if (this.timer.tick()) {
	// 		this.frame = (this.frame + 1) % this.frames;
	// 	}
	// }
	update() {
		//		this.timer.update();
		//		if (this.timer.tick()) {
		this.frame = (this.frame + 48) % 192
		//		}
	}
	changeState(x) {
		this.rotation = x
	}

	/**
	 * Disegna l'animazione.
	 */
	draw() {
		//const img = this.images[this.frame];
		//if (img.complete) {		);

		ctx.drawImage(this.images[this.rotation], this.frame, 0, this.width, this.height, this.position.x, this.position.y, 16, 24) // 192 68
		//        } else {
		//            ctx.drawImage(img, 0, 0, 50, 80, this.position.x, this.position.y, 16, 24);

		//ctx.drawImage(this.image, точка начала обрезки, размер окна обрезки, расположение на карте, масштаб);
		//this.images[this.frame].onload = () =>{
		// ctx.drawImage(this.images[this.frame], 0,0);

		//ctx.drawImage(this.images[this.frame], 0, 0, 50, 80, this.position.x, this.position.y, 16, 24);
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
 * Classe per la gestione di un menu.
 */
class Menu {
	/**
	 * Crea un nuovo oggetto Menu.
	 * @param {number} x - Posizione x del menu.
	 * @param {number} y - Posizione y del menu.
	 * @param {string[]} items - Voci di menu.
	 */
	constructor(x, y, items) {
		this.items = items
		this.x = x
		this.y = y
		this.up = new Key('ArrowUp')
		this.down = new Key('ArrowDown')
		this.ArrowLeft = new Key('ArrowLeft')
		this.ArrowRight = new Key('ArrowRight')
		this.choose = new Key('Enter')
		this.font = 'Arial'
		this.size = 22
		this.standardColor = 'white'
		this.selectedColor = 'red'
		this.index = 0
	}

	/**
	 * Gestisce l'evento relativo al rilascio dei tasti up e down.
	 * @param {Object} e - Parametro relativo all'evento.
	 */
	keyDownHandler(e) {
		this.up.keyDownHandler(e)
		this.down.keyDownHandler(e)
		this.choose.keyDownHandler(e)
		this.ArrowLeft.keyDownHandler(e)
		this.ArrowRight.keyDownHandler(e)
	}

	/**
	 * Gestisce l'evento relativo alla pressione dei tasti up e down.
	 * @param {Object} e - Parametro relativo all'evento.
	 */
	keyUpHandler(e) {
		this.up.keyUpHandler(e)
		this.down.keyUpHandler(e)
		this.choose.keyUpHandler(e)
		this.ArrowLeft.keyUpHandler(e)
		this.ArrowRight.keyUpHandler(e)
	}

	/**
	 * Aggiorna lo stato del menu.
	 */
	update() {
		if (this.up.pressed) {
			this.index--
			if (this.index == -1) {
				this.index = this.items.length - 1
			}
			this.up.pressed = false
		}
		if (this.down.pressed) {
			this.index++
			if (this.index == this.items.length) {
				this.index = 0
			}
			this.down.pressed = false
		}
	}

	/**
	 * Disegna il menu.
	 */
	draw() {
		let y = this.y
		ctx.font = this.size + 'px ' + this.font
		ctx.fillStyle = 'rgba(77, 77, 77, 0.9)'
		ctx.fillRect(0, 0, 640, 480)
		for (let i = 0; i < this.items.length; i++) {
			ctx.fillStyle = this.standardColor
			if (i == this.index) {
				ctx.fillStyle = this.selectedColor
			}
			ctx.fillText(this.items[i], this.x, y)
			y += this.size + 10
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
