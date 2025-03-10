import { Sprite, GameSettings } from './gamelib.js'
import { Player } from './items.js'
import { Collisions } from './utils.js'
import { Boundary } from './utils.js'

export class GameMap extends Sprite {
	static MAPS = ['https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/maps/Base.png?raw=true', 'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/maps/ForestMap.png', 'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/maps/JewerlyMap.png', 'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/maps/StoneMap.png']
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
			mapPosY - 3,
			12, // imgPosition X, Y
			4,
			8, // picWidth, picHeight
			8,
			[
				{ x: 9, y: 35, width: 45, height: 26 },
				{ x: 20, y: 61, width: 22, height: 2, action: action, teleport: [teleportX, teleportY] },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class Tree extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 3,
			12, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			4,
			[{ x: 6, y: 20, width: 18, height: 12, action: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}
// export class Tree extends MapItem {
// 	constructor(mapPosX, mapPosY) {
// 		super(
// 			GameMap,
// 			mapPosX,
// 			mapPosY - 3,
// 			12, // imgPosition X, Y
// 			0,
// 			4, // picWidth, picHeight
// 			4,
// 			[{ x: 6, y: 20, width: 18, height: 12, action: 7 }], // bsize
// 			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
// 		)
// 	}
// }

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
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true',
			-12 // hide height
		)
	}
}
