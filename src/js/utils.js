import { Vector2, GameSettings } from './gamelib.js'
import * as MapItems from './MapItems.js'

export class Action {
	static handlers = {
		2: GameMap => {
			Collisions.col(GameMap, collisions)
		},
		3: GameMap => {
			Collisions.col(GameMap, colissionsTree)
		},
		4: GameMap => {
			Collisions.col(GameMap, collisionsJewerly)
		},
		5: GameMap => {
			Collisions.col(GameMap, collisionsStones)
		},
	}

	static move(player, background, dx, dy, speed) {
		const smooth = 2
		speed /= smooth
		player.smoothMove(background, dx, dy, speed, smooth)
		background.smoothMove(player, dx, dy, speed)
	}
	static processObject(GameMap, row, col, cell) {
		switch (cell[0]) {
			case 2472:
				const home = new MapItems.Home(row, col, cell[1], cell[2], cell[3])
				Collisions.items.push(home)
				this.teleport = home.teleportPosition
				return home.boundaries

			case 2536:
				const tree = new MapItems.Tree(row, col)
				Collisions.items.push(tree)
				return tree.boundaries

			case 2535:
				const tree1 = new MapItems.Tree1(row, col)
				Collisions.items.push(tree1)
				return tree1.boundaries

			case 2551:
				const ice = new MapItems.Ice(row, col)
				Collisions.items.push(ice)
				return ice.boundaries

			case 2565:
				const ice1 = new MapItems.Ice1(row, col)
				Collisions.items.push(ice1)
				return ice1.boundaries

			case 2540:
				const bone = new MapItems.Bone(row, col)
				Collisions.items.push(bone)
				return bone.boundaries

			case 2543:
				const stone = new MapItems.Stone(row, col)
				Collisions.items.push(stone)
				return stone.boundaries

			case 2663:
				const streetLight = new MapItems.StreetLight(row, col)
				Collisions.items.push(streetLight)
				return streetLight.boundaries

			case 2531:
				const greenTree = new MapItems.GreenTree(row, col)
				Collisions.items.push(greenTree)
				return greenTree.boundaries

			case 2532:
				const orangeTree = new MapItems.OrangeTree(row, col)
				Collisions.items.push(orangeTree)
				return orangeTree.boundaries

			case 2533:
				const pinkTree = new MapItems.PinkTree(row, col)
				Collisions.items.push(pinkTree)
				return pinkTree.boundaries

			case 2523:
				const grass = new MapItems.Grass(row, col)
				Collisions.items.push(grass)
				return grass.boundaries

			case 2537:
				const grass1 = new MapItems.Grass1(row, col)
				Collisions.items.push(grass1)
				return grass1.boundaries

			case 2660:
				const stamp = new MapItems.Stamp(row, col)
				Collisions.items.push(stamp)
				return stamp.boundaries

			case 2662:
				const stone2 = new MapItems.Stone2(row, col)
				Collisions.items.push(stone2)
				return stone2.boundaries

			case 2600:
				const campFire = new MapItems.CampFire(row, col)
				Collisions.items.push(campFire)
				return campFire.boundaries

			case 2469:
				const barierLeft = new MapItems.BarierLeft(row, col)
				Collisions.items.push(barierLeft)
				return barierLeft.boundaries

			case 2470:
				const barierMiddle = new MapItems.BarierMiddle(row, col)
				Collisions.items.push(barierMiddle)
				return barierMiddle.boundaries

			case 2471:
				const barierRight = new MapItems.BarierRight(row, col)
				Collisions.items.push(barierRight)
				return barierRight.boundaries

			case 2468:
				const barierTop = new MapItems.BarierTop(row, col)
				Collisions.items.push(barierTop)
				return barierTop.boundaries

			case 2479:
				const barierVerticalMiddle = new MapItems.BarierVerticalMiddle(row, col)
				Collisions.items.push(barierVerticalMiddle)
				return barierVerticalMiddle.boundaries

			case 2490:
				const barierDown = new MapItems.BarierDown(row, col)
				Collisions.items.push(barierDown)
				return barierDown.boundaries

			case 2480:
				const barierTopLeft = new MapItems.BarierTopLeft(row, col)
				Collisions.items.push(barierTopLeft)
				return barierTopLeft.boundaries

			case 2482:
				const barierTopRight = new MapItems.BarierTopRight(row, col)
				Collisions.items.push(barierTopRight)
				return barierTopRight.boundaries

			case 2502:
				const barierDownLeft = new MapItems.BarierDownLeft(row, col)
				Collisions.items.push(barierDownLeft)
				return barierDownLeft.boundaries

			case 2504:
				const barierDownRight = new MapItems.BarierDownRight(row, col)
				Collisions.items.push(barierDownRight)
				return barierDownRight.boundaries

			case 2827:
				const barierLeft1 = new MapItems.BarierLeft1(row, col)
				Collisions.items.push(barierLeft1)
				return barierLeft1.boundaries

			case 2828:
				const barierMiddle1 = new MapItems.BarierMiddle1(row, col)
				Collisions.items.push(barierMiddle1)
				return barierMiddle1.boundaries

			case 2829:
				const barierRight1 = new MapItems.BarierRight1(row, col)
				Collisions.items.push(barierRight1)
				return barierRight1.boundaries

			case 2779:
				const barierTop1 = new MapItems.BarierTop1(row, col)
				Collisions.items.push(barierTop1)
				return barierTop1.boundaries

			case 2796:
				const barierVerticalMiddle1 = new MapItems.BarierVerticalMiddle1(row, col)
				Collisions.items.push(barierVerticalMiddle1)
				return barierVerticalMiddle1.boundaries

			case 2813:
				const barierDown1 = new MapItems.BarierDown1(row, col)
				Collisions.items.push(barierDown1)
				return barierDown1.boundaries

			case 2776:
				const barierTopLeft1 = new MapItems.BarierTopLeft1(row, col)
				Collisions.items.push(barierTopLeft1)
				return barierTopLeft1.boundaries

			case 2778:
				const barierTopRight1 = new MapItems.BarierTopRight1(row, col)
				Collisions.items.push(barierTopRight1)
				return barierTopRight1.boundaries

			case 2810:
				const barierDownLeft1 = new MapItems.BarierDownLeft1(row, col)
				Collisions.items.push(barierDownLeft1)
				return barierDownLeft1.boundaries

			case 2812:
				const barierDownRight1 = new MapItems.BarierDownRight1(row, col)
				Collisions.items.push(barierDownRight1)
				return barierDownRight1.boundaries

			case 2555:
				const stone3 = new MapItems.Stone3(row, col)
				Collisions.items.push(stone3)
				return stone3.boundaries

			case 2544:
				const emerald1 = new MapItems.Emerald1(row, col)
				Collisions.items.push(emerald1)
				return emerald1.boundaries

			case 2545:
				const emerald2 = new MapItems.Emerald2(row, col)
				Collisions.items.push(emerald2)
				return emerald2.boundaries

			case 2558:
				const emerald3 = new MapItems.Emerald3(row, col)
				Collisions.items.push(emerald3)
				return emerald3.boundaries

			case 2559:
				const emerald4 = new MapItems.Emerald4(row, col)
				Collisions.items.push(emerald4)
				return emerald4.boundaries

			case 3164:
				const cristmasTree1 = new MapItems.CristmasTree1(row, col)
				Collisions.items.push(cristmasTree1)
				return cristmasTree1.boundaries

			case 3166:
				const cristmasTree2 = new MapItems.CristmasTree2(row, col)
				Collisions.items.push(cristmasTree2)
				return cristmasTree2.boundaries

			case 3168:
				const cristmasTree3 = new MapItems.CristmasTree3(row, col)
				Collisions.items.push(cristmasTree3)
				return cristmasTree3.boundaries

			case 3170:
				const cristmasTree4 = new MapItems.CristmasTree4(row, col)
				Collisions.items.push(cristmasTree4)
				return cristmasTree4.boundaries

			case 3179:
				const smallBush1 = new MapItems.SmallBush1(row, col)
				Collisions.items.push(smallBush1)
				return smallBush1.boundaries
			case 3180:
				const smallBush2 = new MapItems.SmallBush2(row, col)
				Collisions.items.push(smallBush2)
				return smallBush2.boundaries
			case 3181:
				const smallBush3 = new MapItems.SmallBush3(row, col)
				Collisions.items.push(smallBush3)
				return smallBush3.boundaries
			case 3182:
				const smallBush4 = new MapItems.SmallBush4(row, col)
				Collisions.items.push(smallBush4)
				return smallBush4.boundaries

			case 3194:
				const bigBush1 = new MapItems.BigBush1(row, col)
				Collisions.items.push(bigBush1)
				return bigBush1.boundaries
			case 3195:
				const bigBush2 = new MapItems.BigBush2(row, col)
				Collisions.items.push(bigBush2)
				return bigBush2.boundaries
			case 3196:
				const bigBush3 = new MapItems.BigBush3(row, col)
				Collisions.items.push(bigBush3)
				return bigBush3.boundaries
			case 3197:
				const bigBush4 = new MapItems.BigBush4(row, col)
				Collisions.items.push(bigBush4)
				return bigBush4.boundaries



			case 1136:
				const cactus1 = new MapItems.Cactus1(row, col)
				Collisions.items.push(cactus1)
				return cactus1.boundaries
			case 1137:
				const cactus2 = new MapItems.Cactus2(row, col)
				Collisions.items.push(cactus2)
				return cactus2.boundaries
			case 1138:
				const cactus3 = new MapItems.Cactus3(row, col)
				Collisions.items.push(cactus3)
				return cactus3.boundaries
			case 1139:
				const cactus4 = new MapItems.Cactus4(row, col)
				Collisions.items.push(cactus4)
				return cactus4.boundaries
			case 1140:
				const desertStone1 = new MapItems.DesertStone1(row, col)
				Collisions.items.push(desertStone1)
				return desertStone1.boundaries
			case 1141:
				const desertStone2 = new MapItems.DesertStone2(row, col)
				Collisions.items.push(desertStone2)
				return desertStone2.boundaries
			case 1142:
				const desertStone3 = new MapItems.DesertStone3(row, col)
				Collisions.items.push(desertStone3)
				return desertStone3.boundaries
			case 1144:
				const palm2 = new MapItems.Palm2(row, col)
				Collisions.items.push(palm2)
				return palm2.boundaries
			case 1145:
				const palm3 = new MapItems.Palm3(row, col)
				Collisions.items.push(palm3)
				return palm3.boundaries

			// case 102:
			// 	const stamp = new MapItems.Stamp(row, col)
			// 	Collisions.items.push(stamp)
			// 	return stamp.boundaries

			default:
				if (cell !== 0) {
					return [Collisions.createBoundary(GameMap, row, col, cell)]
				}
				return []
		}
	}

	static execute(GameMap, background, action, t) {
		background.image.src = GameMap.MAPS[action - 2] || background.image.src
		this.handlers[action]?.(GameMap)

		const deviationX = GameMap.offsetX * GameSettings.scale
		const deviationY = GameMap.offsetY * GameSettings.scale

		t[0] = GameSettings.windowWidth / 2 - t[0] * GameSettings.scale
		t[1] = GameSettings.windowHeight / 2 - t[1] * GameSettings.scale

		background.mapPosition.set(t[0], t[1])
		for (let i of [...Collisions.items, ...Collisions.boundaries]) {
			i.mapPositionyx += t[0] - deviationX
			i.mapPosition.y += t[1] - deviationY
		}
	}
}

// -----------------------------------------------------------------------------
// ОДИН объект колизии
export class Boundary {
	/**
	 * @param {object} mapPosition
	 * @param {number | undefined} action
	 * @param {number} width
	 * @param {number} height
	 */
	static width = 16
	static height = 16
	constructor({ GameMap, x, y, action = undefined, width = 16, height = 16, teleport }) {
		this.mapPosition = new Vector2(x * GameSettings.scale + GameMap.offsetX * GameSettings.scale, y * GameSettings.scale + GameMap.offsetY * GameSettings.scale)
		this.action = action
		this.width = width * GameSettings.scale
		this.height = height * GameSettings.scale
		this.teleport = teleport
		if (this.width < 0) {
			this.mapPosition.x += this.width + 16 * GameSettings.scale
			this.width *= -1
		}
		if (this.height < 0) {
			this.mapPosition.y += this.height + 16 * GameSettings.scale
			this.height *= -1
		}
	}

	moveItem(x, y) {
		this.mapPosition.set(this.mapPosition.x - x, this.mapPosition.y - y)
	}

	collide(GameMap, player, background, px, py, pw, ph) {
		player.action = undefined
		if (px < this.mapPosition.x + this.width - 12 * GameSettings.scale && px + pw > this.mapPosition.x + 12 * GameSettings.scale && py < this.mapPosition.y + this.height - 18 * GameSettings.scale && py + ph > this.mapPosition.y + 9 * GameSettings.scale) {
			if (this.action !== 1) {
				player.action = this.action
				if (this.teleport) Action.execute(GameMap, background, this.action, this.teleport)
			}
			return true
		}
		return false
	}

	draw(ctx) {
		ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
		ctx.fillRect(this.mapPosition.x, this.mapPosition.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------
// Класс для создания и управления коллизиями карты
export class Collisions {
	static boundaries = []
	static items = []
	static width = 120
	static height = 68

	static createBoundary(GameMap, row, col, cell) {
		const width = typeof cell === 'object' ? cell[1] * 16 : 16
		const height = typeof cell === 'object' ? cell[2] * 16 : 16

		return new Boundary({
			GameMap,
			x: row * Boundary.width,
			y: col * Boundary.height,
			action: typeof cell === 'object' ? cell[0] : cell,
			width: width,
			height: height,
		})
	}

	static col(GameMap, collisions) {
		Collisions.items = []
		Collisions.boundaries = collisions.reduce((acc, cell, index) => {
			const row = index % Collisions.width
			const col = Math.floor(index / Collisions.width)

			const newBoundaries = Action.processObject(GameMap, row, col, cell)
			acc.push(...newBoundaries)

			return acc
		}, [])
	}
}
