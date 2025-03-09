class GameMap extends Sprite {
	static MAPS = ['https://erikarabyan.github.io/Village-2D/assets/maps/Base.png', 'https://erikarabyan.github.io/Village-2D/assets/maps/ForestMap.png', 'https://erikarabyan.github.io/Village-2D/assets/maps/JewerlyMap.png', 'https://erikarabyan.github.io/Village-2D/assets/maps/StoneMap.png']
	static width = 1920
	static height = 1088
	static offsetX = (GameSettings.windowWidth - GameMap.width * GameSettings.scale) / 2 / GameSettings.scale
	static offsetY = (GameSettings.windowHeight - GameMap.height * GameSettings.scale) / 2 / GameSettings.scale
	// static offsetX = -2000
	// static offsetY = -2000
	static offsetY = 0
	static offsetX = -500

	static ID = 'stage'
	constructor() {
		super(GameMap.MAPS[0], GameMap.offsetX, GameMap.offsetY, GameMap.width, GameMap.height)
	}

	smoothMove(x, y, speed) {
		const { windowWidth, windowHeight } = GameSettings

		// останавливаем карту если игрок находится дальше границы
		let dx = player.mapPosition.x + 30 >= Player.actualPosX && player.mapPosition.x - 30 <= Player.actualPosX ? x : 0
		let dy = player.mapPosition.y + 30 >= Player.actualPosY && player.mapPosition.y - 30 <= Player.actualPosY ? y : 0

		// не дает выходить за границу
		dx = this.mapPosition.x - dx <= 0 ? dx : (this.mapPosition.x = 0)
		dy = this.mapPosition.y - dy <= 0 ? dy : (this.mapPosition.y = 0)
		dx = windowWidth + dx - this.mapPosition.x < this.width ? dx : (this.mapPosition.x = 0)
		dy = windowHeight + dy - this.mapPosition.y < this.height ? dy : (this.mapPosition.y = 0)

		// плавное движение
		const calcX = Player.actualPosX - player.mapPosition.x
		const calcY = Player.actualPosY - player.mapPosition.y
		if (x === 0 && Math.abs(calcX) >= 8 && this.mapPosition.x != 0) calcX > 0 ? (dx = -speed / 2) : (dx = speed / 2)
		if (y === 0 && Math.abs(calcY) >= 8 && this.mapPosition.y != 0) calcY > 0 ? (dy = -speed / 2) : (dy = speed / 2)

		this.mapPosition.set(this.mapPosition.x - dx, this.mapPosition.y - dy)
		;[...Collisions.items, ...Collisions.boundaries].forEach(i => i.moveItem(dx, dy))
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
			'https://erikarabyan.github.io/Village-2D/assets/map_items/TopdownForest-Props.png'
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
			'https://erikarabyan.github.io/Village-2D/assets/map_items/TopdownForest-Props.png'
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
			'https://erikarabyan.github.io/Village-2D/assets/map_items/TopdownForest-Props.png',
			-12 // hide height
		)
	}
}
