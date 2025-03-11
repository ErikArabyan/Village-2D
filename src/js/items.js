import { Sprite, Menu, Animation, Text, Sound, GameSettings } from './gamelib.js'
import { GameMap } from './MapItems.js'
import { resources } from './game.js'

// -----------------------------------------------------------------------------

export class Player extends Animation {
	static DEFAULT_SIZE = 32
	static COLLECT_SIZE = 48
	static initialPosX = (GameSettings.windowWidth / 2 - 16 * GameSettings.scale) / GameSettings.scale
	static initialPosY = (GameSettings.windowHeight / 2 - 16 * GameSettings.scale) / GameSettings.scale
	static actualPosX = Player.initialPosX * GameSettings.scale
	static actualPosY = Player.initialPosY * GameSettings.scale
	constructor() {
		super(['https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/players/Player1.png?raw=true', 'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/players/Player_Actions.png?raw=true'], 35, 32, 32, 32, 32, Player.initialPosX, Player.initialPosY, 60 * GameSettings.scale, 8)
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
			this.ima
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
			7: new Resource('https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/Items/wood.png?raw=true', x + 4, y),
			8: new Resource('https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/Items/rock.png?raw=true', x + 4, y + 32),
			9: new Resource('https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/Items/diamond.png?raw=true', x + 4, y + 64),
		}
	}

	draw() {
		super.draw()
		for (const i of Object.values(this.items)) i.draw()
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
		for (let i of [...this.help, ...this.items]) item.draw(this.activeItem)
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
