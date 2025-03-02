class GameSettings {
	static scale = 1
	static windowWidth = window.innerWidth
	static windowHeight = window.innerHeight
}

class Map extends Sprite {
	static MAPS = ['https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/maps/village_style_game.jpg', 'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/maps/ForestMap.png', 'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/maps/JewerlyMap.png', 'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/maps/StoneMap.png']
	static width = 640
	static height = 480
	static offsetX = (GameSettings.windowWidth - Map.width * GameSettings.scale) / 2 / GameSettings.scale
	static offsetY = (GameSettings.windowHeight - Map.height * GameSettings.scale) / 2 / GameSettings.scale
	static ID = 'stage'
	constructor() {
		super(Map.MAPS[0], Map.offsetX, Map.offsetY, Map.width, Map.height)
	}
}

class Home extends MapItem {
	constructor(mapPosX, mapPosY, action, teleportX, teleportY) {
		super(
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
			'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/map_items/TopdownForest-Props.png'
		)
	}
}

class Tree extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			mapPosX,
			mapPosY,
			12, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			4,
			[{ x: 6, y: 20, width: 18, height: 12, action: 7 }], // bsize
			'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/map_items/TopdownForest-Props.png'
		)
	}
}


class Stamp extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			mapPosX,
			mapPosY,
			8, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			4,
			[{ x: 7, y: 13, width: 18, height: 12, action: 7 }], // bsize
			'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/map_items/TopdownForest-Props.png',
			-12 // hide height
		)
	}
}

class Player extends Animation {
	static DEFAULT_SIZE = 32
	static COLLECT_SIZE = 48
	constructor() {
		super(['https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/players/Player1.png', 'https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/players/Player_Actions.png'], 10, 32, 32, 32, 32, (GameSettings.windowWidth / 2 - 16 * GameSettings.scale) / GameSettings.scale, (GameSettings.windowHeight / 2 - 16 * GameSettings.scale) / GameSettings.scale, 80*GameSettings.scale)
		this.collecting = false
		this.colHeight = 0
	}

	_setSize(size) {
		!this.collecting ? (this.image.src = this.images[1]) : (this.image.src = this.images[0])
		this.moveHeight = size
		this.frameWidth = size
		this.width = size * GameSettings.scale
		this.height = size * GameSettings.scale
		this.frame = 0
	}

	endState() {
		if (this.action && !keys.KeyE && this.collecting) {
			this._setSize(Player.DEFAULT_SIZE)
			this.move = (this.move / 3) * 2
			this.mapPosition.set(this.mapPosition.x + 8 * GameSettings.scale, this.mapPosition.y + 8 * GameSettings.scale)
			this.collecting = false
			this.colHeight -= 8 * GameSettings.scale
		}
	}

	updateFrame() {
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

	collect(num) {
		if (this.action && keys.KeyE && !this.collecting) {
			this.side = num
			this._setSize(Player.COLLECT_SIZE)
			this.move = (this.move / 2) * 3
			this.mapPosition.set(this.mapPosition.x - 8 * GameSettings.scale, this.mapPosition.y - 8 * GameSettings.scale)
			this.collecting = true
			const collectMoveValues = [144, 0, 96, 48]
			this.move = collectMoveValues[this.side]
			this.colHeight += 8

			if (this.action === 7 && this.move < 192) {
				this.move += 192
			}
		}
	}
}

class Resource {
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

class Resources extends Menu {
	constructor(x, y, width, height) {
		super(x, y, width, height)

		this.items = {
			7: new Resource('https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/wood.png', x + 4, y),
			8: new Resource('https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/rock.png', x + 4, y + 32),
			9: new Resource('https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/diamond.png', x + 4, y + 64),
		}
	}

	draw() {
		super.draw()
		Object.values(this.items).forEach(i => i.draw())
	}
}

class Option {
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

class Settings extends Menu {
	constructor(x, y, width, height) {
		super(x, y, width, height)
		this.music = new Sound('https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/music/funny-bgm.mp3')
		this.help = [new Sprite('https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/enter.png', ((x + width) / 2 - 86) / GameSettings.scale, ((y + height) / 2 - 100) / GameSettings.scale), new Sprite('https://raw.githubusercontent.com/ErikArabyan/Village-2D/refs/heads/main/assets/Items/arrows.png', ((x + width) / 2 - 10) / GameSettings.scale, ((y + height) / 2 - 146) / GameSettings.scale)]
		this.items = [new Option('Play Music (Enter)', (x + width) / 2 - 86, (y + height) / 2 - 32, () => this.music.play(), 0), new Option('Pause Music (Enter)', (x + width) / 2 - 86, (y + height) / 2, () => this.music.pause(), 1), new Option('Volume Change (<-- -->)', (x + width) / 2 - 86, (y + height) / 2 + 32, () => this.volume(), 2)]
		this.activeItem = 0
		this.show = false
	}

	handleInput() {
		if (keys.Escape) {
			this.show = !this.show
			keys.Escape = false
		}
		if (this.show) {
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

	volume() {
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
