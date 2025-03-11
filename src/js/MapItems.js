import { Sprite, GameSettings, Animation } from './gamelib.js'
import { Player } from './items.js'
import { Collisions } from './utils.js'
import { Boundary } from './utils.js'

export class GameMap extends Sprite {
	static MAPS = ['https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/maps/Base.png?raw=true', 'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/maps/ForestMap.png', 'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/maps/JewerlyMap.png', 'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/maps/StoneMap.png']
	static width = 1920
	static height = 1088
	static offsetX = (GameSettings.windowWidth - GameMap.width * GameSettings.scale) / 2 / GameSettings.scale
	static offsetY = (GameSettings.windowHeight - GameMap.height * GameSettings.scale) / 2 / GameSettings.scale
	static offsetX = -1200
	// static offsetX = -100
	// static offsetY = -150
	// static offsetY = 0

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
		for (let i of [...Collisions.items, ...Collisions.boundaries]) i.moveItem(dx, dy)
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

	updateFrame() {
		this.timer.doTick()
		if (this.timer.tick()) {
			this.frame = (this.frame + this.picWidth) % (this.picWidth * 6)
			this.timer.reset()
		}
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
			8, // imgPosition X, Y
			0,
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

export class OldTree extends MapItem {
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

export class Tree extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 1,
			20, // imgPosition X, Y
			0,
			2, // picWidth, picHeight
			4,
			[{ x: 3, y: 20, width: 10, height: 8, action: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true'
		)
	}
}

export class Tree1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 1,
			18, // imgPosition X, Y
			0,
			2, // picWidth, picHeight
			4,
			[{ x: 3, y: 20, width: 10, height: 8, action: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true'
		)
	}
}

export class Ice extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			22, // imgPosition X, Y
			4,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 6, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}
export class Ice1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			22, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 1, y: 6, width: 14, height: 9 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class Bone extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			0, // imgPosition X, Y
			4,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 10, width: 12, height: 5 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class Stone extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			6, // imgPosition X, Y
			4,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 5, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class Stone3 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 1,
			2, // imgPosition X, Y
			4,
			4, // picWidth, picHeight
			4,
			[{ x: 4, y: 16, width: 24, height: 13 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class Emerald1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			8, // imgPosition X, Y
			4,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 5, width: 12, height: 8, action: 9 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}
export class Emerald2 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			10, // imgPosition X, Y
			4,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 5, width: 12, height: 8, action: 9 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}
export class Emerald3 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			8, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 5, width: 12, height: 8, action: 9 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}
export class Emerald4 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			10, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 5, width: 12, height: 8, action: 9 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class StreetLight extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 2,
			22, // imgPosition X, Y
			16,
			2, // picWidth, picHeight
			6,
			[{ x: 3, y: 40, width: 9, height: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true'
		)
	}
}

export class GreenTree extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 1,
			10, // imgPosition X, Y
			0,
			2, // picWidth, picHeight
			4,
			[{ x: 3, y: 20, width: 10, height: 8, action: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true'
		)
	}
}

export class OrangeTree extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 1,
			12, // imgPosition X, Y
			0,
			2, // picWidth, picHeight
			4,
			[{ x: 3, y: 20, width: 10, height: 8, action: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true'
		)
	}
}

export class PinkTree extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 1,
			14, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			4,
			[{ x: 11, y: 20, width: 10, height: 8, action: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true'
		)
	}
}

export class Grass extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			22, // imgPosition X, Y
			0,
			2, // picWidth, picHeight
			2,
			[{ x: 3, y: 5, width: 10, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class Grass1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			22, // imgPosition X, Y
			2,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 6, width: 12, height: 9 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class Stamp extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			16, // imgPosition X, Y
			20,
			2, // picWidth, picHeight
			2,
			[{ x: 1, y: 6, width: 14, height: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

// export class Stamp extends MapItem {
// 	constructor(mapPosX, mapPosY) {
// 		super(
// 			GameMap,
// 			mapPosX,
// 			mapPosY,
// 			8, // imgPosition X, Y
// 			0,
// 			4, // picWidth, picHeight
// 			4,
// 			[{ x: 7, y: 13, width: 18, height: 12 }], // bsize
// 			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true',
// 			-12 // hide height
// 		)
// 	}
// }

export class Stone2 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			20, // imgPosition X, Y
			20,
			2, // picWidth, picHeight
			2,
			[{ x: 1, y: 6, width: 14, height: 6 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class CampFire extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			10, // imgPosition X, Y
			12,
			2, // picWidth, picHeight
			2,
			[{ x: 1, y: 6, width: 14, height: 10 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5Bresources%5D.png?raw=true',
			-12 // hide height
		)
	}
}

export class BarierLeft extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			2, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 5, y: 9, width: 11, height: 4 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class BarierMiddle extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			4, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 0, y: 9, width: 16, height: 4 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class BarierRight extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			6, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 0, y: 9, width: 11, height: 4 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class BarierTop extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			0, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 5, y: 12, width: 6, height: 4 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class BarierVerticalMiddle extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			0, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[{ x: 5, y: 0, width: 6, height: 16 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true',
			-1000
		)
	}
}

export class BarierDown extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			0, // imgPosition X, Y
			10,
			2, // picWidth, picHeight
			2,
			[{ x: 5, y: 0, width: 6, height: 14 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true',
			-1000
		)
	}
}

export class BarierTopLeft extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			2, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[
				{ x: 5, y: 12, width: 6, height: 4 },
				{ x: 11, y: 12, width: 5, height: 4 },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class BarierTopRight extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			6, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[
				{ x: 5, y: 12, width: 6, height: 4 },
				{ x: 0, y: 12, width: 5, height: 4 },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class BarierDownLeft extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			2, // imgPosition X, Y
			12,
			2, // picWidth, picHeight
			2,
			[
				{ x: 5, y: 0, width: 6, height: 13 },
				{ x: 11, y: 9, width: 5, height: 4 },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class BarierDownRight extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			6, // imgPosition X, Y
			12,
			2, // picWidth, picHeight
			2,
			[
				{ x: 5, y: 0, width: 6, height: 13 },
				{ x: 0, y: 9, width: 5, height: 4 },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/TopdownForest-Props.png?raw=true'
		)
	}
}

export class BarierLeft1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			2, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[{ x: 5, y: 12, width: 11, height: 4 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true'
		)
	}
}

export class BarierMiddle1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			2, // imgPosition X, Y
			14,
			2, // picWidth, picHeight
			2,
			[{ x: 0, y: 8, width: 16, height: 4 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true'
		)
	}
}

export class BarierRight1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			6, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[{ x: 0, y: 12, width: 11, height: 4 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true'
		)
	}
}

export class BarierTop1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			0, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 5, y: 12, width: 6, height: 4 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true'
		)
	}
}

export class BarierVerticalMiddle1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			6, // imgPosition X, Y
			10,
			2, // picWidth, picHeight
			2,
			[{ x: 5, y: 0, width: 6, height: 16 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true',
			-1000
		)
	}
}

export class BarierDown1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			0, // imgPosition X, Y
			10,
			2, // picWidth, picHeight
			2,
			[{ x: 5, y: 0, width: 6, height: 14 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true',
			-1000
		)
	}
}

export class BarierTopLeft1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			0, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[
				{ x: 5, y: 8, width: 6, height: 8 },
				{ x: 11, y: 8, width: 5, height: 4 },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true'
		)
	}
}

export class BarierTopRight1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			4, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[
				{ x: 5, y: 8, width: 6, height: 8 },
				{ x: 0, y: 8, width: 5, height: 4 },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true'
		)
	}
}

export class BarierDownLeft1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			0, // imgPosition X, Y
			12,
			2, // picWidth, picHeight
			2,
			[
				{ x: 5, y: 0, width: 6, height: 12 },
				{ x: 11, y: 8, width: 5, height: 4 },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true'
		)
	}
}

export class BarierDownRight1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			4, // imgPosition X, Y
			12,
			2, // picWidth, picHeight
			2,
			[
				{ x: 5, y: 0, width: 6, height: 12 },
				{ x: 0, y: 8, width: 5, height: 4 },
			], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/cave_%20%5BbridgeHorizontal%5D.png?raw=true'
		)
	}
}

export class CristmasTree1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 2,
			14, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			6,
			[{ x: 10, y: 38, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class CristmasTree2 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 2,
			18, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			6,
			[{ x: 10, y: 38, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class CristmasTree3 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 2,
			22, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			6,
			[{ x: 10, y: 38, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class CristmasTree4 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 2,
			26, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			6,
			[{ x: 10, y: 38, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}

export class SmallBush1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			14, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class SmallBush2 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			16, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class SmallBush3 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			18, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class SmallBush4 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			20, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class BigBush1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			14, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class BigBush2 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			16, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class BigBush3 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			18, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}
export class BigBush4 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			20, // imgPosition X, Y
			8,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/Resources%202.png?raw=true'
		)
	}
}

export class Cactus1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			6, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true'
		)
	}
}
export class Cactus2 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			8, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true'
		)
	}
}
export class Cactus3 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			10, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true'
		)
	}
}
export class Cactus4 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			12, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true'
		)
	}
}
export class DesertStone1 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			14, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 1, y: 8, width: 13, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true'
		)
	}
}
export class DesertStone2 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			16, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 12, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true', -16
		)
	}
}
export class DesertStone3 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			18, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 0, y: 8, width: 16, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true'
		)
	}
}

export class Palm2 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY,
			22, // imgPosition X, Y
			6,
			2, // picWidth, picHeight
			2,
			[{ x: 2, y: 8, width: 10, height: 8 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true'
		)
	}
}
export class Palm3 extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			GameMap,
			mapPosX,
			mapPosY - 1,
			24, // imgPosition X, Y
			4,
			2, // picWidth, picHeight
			4,
			[{ x: 2, y: 24, width: 12, height: 8, action: 7 }], // bsize
			'https://github.com/ErikArabyan/Village-2D/blob/main/src/assets/map_items/DesertTilemapBlankBackground.png?raw=true'
		)
	}
}
