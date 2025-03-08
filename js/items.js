class GameMap extends Sprite {
	static MAPS = ['assets/maps/base.png', 'assets/maps/ForestMap.png', 'assets/maps/JewerlyMap.png', 'assets/maps/StoneMap.png']
	static width = 1920
	static height = 1088
	// static offsetX = (GameSettings.windowWidth - GameMap.width * GameSettings.scale) / 2 / GameSettings.scale
	// static offsetY = (GameSettings.windowHeight - GameMap.height * GameSettings.scale) / 2 / GameSettings.scale
	static offsetX = -10
	static offsetY = -500
	static ID = 'stage'
	constructor() {
		super(GameMap.MAPS[0], GameMap.offsetX, GameMap.offsetY, GameMap.width, GameMap.height)
	}

	smoothMove(dx, dy, speed) {
		const { windowWidth, windowHeight } = GameSettings
		const x = dx
		const y = dy

		// не дает выходить за границу
		dx = this.mapPosition.x - dx <= 0 ? dx : this.mapPosition.x
		dy = this.mapPosition.y - dy <= 0 ? dy : this.mapPosition.y
		dx = -this.mapPosition.x + windowWidth + dx < this.width ? dx : dx + this.width - windowWidth + this.mapPosition.x
		dy = -this.mapPosition.y + windowHeight + dy < this.height ? dy : dy + this.height - windowHeight + this.mapPosition.y

		// плавное движение
		const calcX = Player.actualPosX - player.mapPosition.x
		const calcY = Player.actualPosY - player.mapPosition.y
		if (x === 0 && Math.abs(calcX) >= 8) dx = calcX > 0 ? -speed / 2 : speed / 2
		if (y === 0 && Math.abs(calcY) >= 8) dy = calcY > 0 ? -speed / 2 : speed / 2

		// останавливаем игрока если он находится дальше своей границы
		
		dx = player.mapPosition.x <= Player.actualPosX+30 && player.mapPosition.x >= Player.actualPosX-30 ? dx : 0
		dy = player.mapPosition.y <= Player.actualPosY+30 && player.mapPosition.y >= Player.actualPosY-30 ? dy : 0
		
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
			'assets/map_items/TopdownForest-Props.png'
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
			'assets/map_items/TopdownForest-Props.png'
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
			'assets/map_items/TopdownForest-Props.png',
			-12 // hide height
		)
	}
}
