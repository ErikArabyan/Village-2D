import { Sprite, GameSettings, Timer, MyText } from './gamelib.ts';
import { Player } from './items.ts';
import { Collisions } from './utils.ts';
import { Boundary } from './utils.ts';

export class GameMap extends Sprite {
  static MAPS = ['maps/Base.png', 'maps/ForestMap.png', 'maps/JewerlyMap.png', 'maps/StoneMap.png'];
  static width = 1920;
  static height = 1088;
  static offsetX = (GameSettings.windowWidth - GameMap.width * GameSettings.scale) / 2 / GameSettings.scale;
  static offsetY = (GameSettings.windowHeight - GameMap.height * GameSettings.scale) / 2 / GameSettings.scale;
  // static offsetX = -1400
  // static offsetX = -50
  // static offsetY = -700
  // static offsetY = 0

  static ID = 'stage';
  constructor() {
    super(GameMap.MAPS[0], GameMap.offsetX, GameMap.offsetY, GameMap.width, GameMap.height);
  }

  smoothMove(player: Player, x: number, y: number, speed: number) {
    const { windowWidth, windowHeight } = GameSettings;

    // останавливаем карту если игрок находится дальше границы
    let dx = player.mapPosition.x + 30 >= Player.actualPosX && player.mapPosition.x - 30 <= Player.actualPosX ? x : 0;
    let dy = player.mapPosition.y + 30 >= Player.actualPosY && player.mapPosition.y - 30 <= Player.actualPosY ? y : 0;

    // плавное движение
    const calcX = Player.actualPosX - player.mapPosition.x;
    const calcY = Player.actualPosY - player.mapPosition.y;
    if (x === 0 && Math.abs(calcX) >= 8 && this.mapPosition.x != 0) calcX > 0 ? (dx = -speed / 2) : (dx = speed / 2);
    if (y === 0 && Math.abs(calcY) >= 8 && this.mapPosition.y != 0) calcY > 0 ? (dy = -speed / 2) : (dy = speed / 2);

    // не дает выходить за границу
    dx = this.mapPosition.x - dx <= 0 ? dx : (this.mapPosition.x = 0);
    dy = this.mapPosition.y - dy <= 0 ? dy : (this.mapPosition.y = 0);
    dx =
      windowWidth + dx - this.mapPosition.x < this.width!
        ? dx
        : this.width! - (GameSettings.windowWidth - this.mapPosition.x);
    dy =
      windowHeight + dy - this.mapPosition.y < this.height!
        ? dy
        : this.height! - (GameSettings.windowHeight - this.mapPosition.y);

    this.mapPosition.set(this.mapPosition.x - dx, this.mapPosition.y - dy);
    for (let i of [...Collisions.items, ...Collisions.boundaries]) i.moveItem(dx, dy);
  }
}

export class MapItem extends Sprite {
  boundaries: Boundary[];
  hide: number;
  timer: Timer;
  frameCount: number;
  startframe: number;
  static TILE_SIZE = 8;
  static BLOCK_SIZE = 16;
  constructor(
    x: number,
    y: number,
    imgPosX: number,
    imgPosY: number,
    picWidth: number,
    picHeight: number,
    boundaryConfigs: boundaryConfigs[],
    imageSrc: string,
    hide = -20,
    timer = 10,
    frameCount = 1
  ) {
    super(
      imageSrc,
      x * MapItem.BLOCK_SIZE + GameMap.offsetX,
      y * MapItem.BLOCK_SIZE + GameMap.offsetY,
      picWidth * MapItem.TILE_SIZE,
      picHeight * MapItem.TILE_SIZE,
      imgPosX * MapItem.TILE_SIZE,
      imgPosY * MapItem.TILE_SIZE,
      picWidth * MapItem.TILE_SIZE,
      picHeight * MapItem.TILE_SIZE
    );
    this.boundaries = boundaryConfigs.map(
      (config) =>
        new Boundary({
          x: x * MapItem.BLOCK_SIZE + config.x,
          y: y * MapItem.BLOCK_SIZE + config.y,
          action: config.action,
          width: config.width,
          height: config.height,
          teleport: config.teleport,
          helpButton: config.helpButton,
          text: config.text,
        })
    );
    this.hide = hide;
    this.timer = new Timer(timer);
    this.frameCount = frameCount;
    this.startframe = imgPosX * 8;
  }

  updateFrame(time = 1) {
    this.timer.doTick(1);
    if (this.timer.tick()) {
      this.frame =
        this.startframe + ((this.frame! - this.startframe + this.frameWidth!) % (this.frameWidth! * this.frameCount));
      this.timer.reset();
    }
    requestAnimationFrame((time) => this.updateFrame(time));
  }

  moveItem(x: number, y: number) {
    this.mapPosition.set(this.mapPosition.x - x, this.mapPosition.y - y);
  }

  // draw() {
  // границы колизии предмета
  // this.boundaries[0].draw()
  // if (this.boundaries[1]) {
  // this.boundaries[1].draw()
  // }
}

export class Home extends MapItem {
  constructor(mapPosX: number, mapPosY: number, action: number, teleportX: number, teleportY: number) {
    super(
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
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class OldTree extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 3,
      12, // imgPosition X, Y
      0,
      4, // picWidth, picHeight
      4,
      [{ x: 6, y: 20, width: 18, height: 12, action: 7 }], // bsize
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class Tree extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      20, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 3, y: 20, width: 10, height: 8, action: 7 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}

export class Tree1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      18, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 3, y: 20, width: 10, height: 8, action: 7 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}

export class Ice extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      22, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 6, width: 12, height: 8 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}
export class Ice1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      22, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 1, y: 6, width: 14, height: 9 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}

export class Bone extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 10, width: 12, height: 5 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}

export class Bone1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      2,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 10, width: 12, height: 5 }], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}
export class Bone2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      2, // imgPosition X, Y
      2,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 10, width: 12, height: 5 }], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}
export class Bone3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      4, // imgPosition X, Y
      2,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 10, width: 12, height: 4 }], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}
export class Bone4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      6, // imgPosition X, Y
      2,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 10, width: 12, height: 4 }], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}

export class Table1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [
        { x: 2, y: 12, width: 12, height: 3 },
        {
          x: -6,
          y: 15,
          action: 0,
          width: 26,
          height: 15,
          helpButton: new Sprite(
            'Items/E.png',
            mapPosX * MapItem.BLOCK_SIZE + GameMap.offsetX,
            mapPosY * MapItem.BLOCK_SIZE + GameMap.offsetY - 15,
            17,
            17
          ),
          text: [
            new MyText(
              "Hi It's Village 2D",
              mapPosX * MapItem.BLOCK_SIZE + GameMap.offsetX,
              mapPosY * MapItem.BLOCK_SIZE + GameMap.offsetY - 15
            ),
          ],
        },
      ], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}
export class Table2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      2, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 12, width: 12, height: 3 }], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}
export class Table3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      4, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 12, width: 12, height: 3 }], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}
export class Table4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      6, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 12, width: 12, height: 3 }], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}

export class Vase extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      2, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 10, width: 12, height: 6 }], // bsize
      'map_items/Resources2.png',
      -12 // hide height
    );
  }
}

export class DesertHouse1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 4,
      0, // imgPosition X, Y
      18,
      8, // picWidth, picHeight
      12,
      [{ x: 0, y: 40, width: 64, height: 40 }], // bsize
      'map_items/DesertTilemapBlankBackground.png',
      -52 // hide height
    );
  }
}

export class DesertHouse2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      8, // imgPosition X, Y
      22,
      4, // picWidth, picHeight
      5,
      [{ x: 0, y: 17, width: 33, height: 16 }], // bsize
      'map_items/DesertTilemapBlankBackground.png',
      -12 // hide height
    );
  }
}
export class DesertHouse3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      12, // imgPosition X, Y
      22,
      4, // picWidth, picHeight
      5,
      [{ x: 0, y: 17, width: 33, height: 16 }], // bsize
      'map_items/DesertTilemapBlankBackground.png',
      -12 // hide height
    );
  }
}
export class DesertHouse4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 2,
      16, // imgPosition X, Y
      20,
      6, // picWidth, picHeight
      7,
      [{ x: 0, y: 33, width: 49, height: 16 }], // bsize
      'map_items/DesertTilemapBlankBackground.png',
      -12 // hide height
    );
  }
}

export class Stone extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      6, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 5, width: 12, height: 8 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}

export class Stone3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      2, // imgPosition X, Y
      4,
      4, // picWidth, picHeight
      4,
      [{ x: 4, y: 16, width: 24, height: 13 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}

export class Emerald1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      8, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 5, width: 12, height: 8, action: 9 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}
export class Emerald2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      10, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 5, width: 12, height: 8, action: 9 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}
export class Emerald3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      8, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 5, width: 12, height: 8, action: 9 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}
export class Emerald4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      10, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 5, width: 12, height: 8, action: 9 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}

export class StreetLight extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 2,
      22, // imgPosition X, Y
      16,
      2, // picWidth, picHeight
      6,
      [{ x: 3, y: 40, width: 9, height: 7 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}

export class GreenTree extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      10, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 3, y: 20, width: 10, height: 8, action: 7 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}

export class OrangeTree extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      12, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 3, y: 20, width: 10, height: 8, action: 7 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}

export class PinkTree extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      14, // imgPosition X, Y
      0,
      4, // picWidth, picHeight
      4,
      [{ x: 11, y: 20, width: 10, height: 8, action: 7 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}

export class Grass extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      22, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      2,
      [{ x: 3, y: 5, width: 10, height: 8 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}

export class Grass1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      22, // imgPosition X, Y
      2,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 6, width: 12, height: 9 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}

export class Stamp extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      16, // imgPosition X, Y
      20,
      2, // picWidth, picHeight
      2,
      [{ x: 1, y: 6, width: 14, height: 7 }], // bsize
      'map_items/cave_resources.png',
      -12 // hide height
    );
  }
}

// export class Stamp extends MapItem {
// 	constructor(mapPosX: number, mapPosY: number) {
// 		super(
// 			GameMap,
// 			mapPosX,
// 			mapPosY,
// 			8, // imgPosition X, Y
// 			0,
// 			4, // picWidth, picHeight
// 			4,
// 			[{ x: 7, y: 13, width: 18, height: 12 }], // bsize
// 			'map_items/TopdownForest-Props.png',
// 			-12 // hide height
// 		)
// 	}
// }

export class Stone2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      20, // imgPosition X, Y
      20,
      2, // picWidth, picHeight
      2,
      [{ x: 1, y: 6, width: 14, height: 6 }], // bsize
      'map_items/cave_resources.png',
      -16 // hide height
    );
  }
}

export class CampFire extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      10, // imgPosition X, Y
      12,
      2, // picWidth, picHeight
      2,
      [{ x: 1, y: 6, width: 14, height: 10 }], // bsize
      'map_items/cave_resources.png',
      -12, // hide height
      14,
      4
    );
  }
}

export class BarierLeft extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      2, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 5, y: 9, width: 11, height: 4 }], // bsize
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class BarierMiddle extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      4, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 0, y: 9, width: 16, height: 4 }], // bsize
      'map_items/TopdownForest-Props.png',
      -12
    );
  }
}

export class BarierRight extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      6, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 0, y: 9, width: 11, height: 4 }], // bsize
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class BarierTop extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 5, y: 12, width: 6, height: 4 }], // bsize
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class BarierVerticalMiddle extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      8,
      2, // picWidth, picHeight
      2,
      [{ x: 5, y: 0, width: 6, height: 16 }], // bsize
      'map_items/TopdownForest-Props.png',
      -1000
    );
  }
}

export class BarierDown extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      10,
      2, // picWidth, picHeight
      2,
      [{ x: 5, y: 0, width: 6, height: 14 }], // bsize
      'map_items/TopdownForest-Props.png',
      -1000
    );
  }
}

export class BarierTopLeft extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
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
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class BarierTopRight extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
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
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class BarierDownLeft extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
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
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class BarierDownRight extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
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
      'map_items/TopdownForest-Props.png'
    );
  }
}

export class Fountain extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 4,
      0, // imgPosition X, Y
      29,
      8, // picWidth, picHeight
      9,
      [{ x: 0, y: 8, width: 64, height: 64 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -240,
      20,
      4
    );
  }
}

export class BarierLeft1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      2, // imgPosition X, Y
      8,
      2, // picWidth, picHeight
      2,
      [{ x: 5, y: 12, width: 11, height: 4 }], // bsize
      'map_items/cave_bridgeHorizontal.png'
    );
  }
}

export class BarierMiddle1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      2, // imgPosition X, Y
      14,
      2, // picWidth, picHeight
      2,
      [{ x: 0, y: 8, width: 16, height: 4 }], // bsize
      'map_items/cave_bridgeHorizontal.png'
    );
  }
}

export class BarierRight1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      6, // imgPosition X, Y
      8,
      2, // picWidth, picHeight
      2,
      [{ x: 0, y: 12, width: 11, height: 4 }], // bsize
      'map_items/cave_bridgeHorizontal.png'
    );
  }
}

export class BarierTop1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 5, y: 12, width: 6, height: 4 }], // bsize
      'map_items/cave_bridgeHorizontal.png'
    );
  }
}

export class BarierVerticalMiddle1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      6, // imgPosition X, Y
      10,
      2, // picWidth, picHeight
      2,
      [{ x: 5, y: 0, width: 6, height: 16 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -1000
    );
  }
}

export class BarierDown1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      10,
      2, // picWidth, picHeight
      2,
      [{ x: 5, y: 0, width: 6, height: 14 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -1000
    );
  }
}

export class BarierTopLeft1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
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
      'map_items/cave_bridgeHorizontal.png'
    );
  }
}

export class BarierTopRight1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
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
      'map_items/cave_bridgeHorizontal.png'
    );
  }
}

export class BarierDownLeft1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
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
      'map_items/cave_bridgeHorizontal.png'
    );
  }
}

export class BarierDownRight1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
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
      'map_items/cave_bridgeHorizontal.png'
    );
  }
}

export class CristmasTree1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 2,
      14, // imgPosition X, Y
      0,
      4, // picWidth, picHeight
      6,
      [{ x: 10, y: 38, width: 12, height: 8, action: 7 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class CristmasTree2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 2,
      18, // imgPosition X, Y
      0,
      4, // picWidth, picHeight
      6,
      [{ x: 10, y: 38, width: 12, height: 8, action: 7 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class CristmasTree3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 2,
      22, // imgPosition X, Y
      0,
      4, // picWidth, picHeight
      6,
      [{ x: 10, y: 38, width: 12, height: 8, action: 7 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class CristmasTree4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 2,
      26, // imgPosition X, Y
      0,
      4, // picWidth, picHeight
      6,
      [{ x: 10, y: 38, width: 12, height: 8, action: 7 }], // bsize
      'map_items/Resources2.png'
    );
  }
}

export class SmallBush1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      14, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class SmallBush2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      16, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class SmallBush3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      18, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class SmallBush4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      20, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class BigBush1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      14, // imgPosition X, Y
      8,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class BigBush2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      16, // imgPosition X, Y
      8,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class BigBush3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      18, // imgPosition X, Y
      8,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/Resources2.png'
    );
  }
}
export class BigBush4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      20, // imgPosition X, Y
      8,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/Resources2.png'
    );
  }
}

export class Cactus1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      6, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}
export class Cactus2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      8, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}
export class Cactus3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      10, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}
export class Cactus4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      12, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}
export class Cactus5 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      4, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 2, y: 20, width: 10, height: 8 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}
export class Cactus6 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      6, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 2, y: 20, width: 10, height: 8 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}
export class Cactus7 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      8, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 1, y: 19, width: 12, height: 9 }], // bsize
      'map_items/cave_resources.png'
    );
  }
}
export class DesertStone1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      14, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 1, y: 8, width: 13, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}
export class DesertStone2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      16, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 12, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png',
      -16
    );
  }
}
export class DesertStone3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      18, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 0, y: 8, width: 16, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}
export class DesertStone4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      22, // imgPosition X, Y
      8,
      6, // picWidth, picHeight
      4,
      [{ x: 7, y: 25, width: 32, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}

export class Palm2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      22, // imgPosition X, Y
      6,
      2, // picWidth, picHeight
      2,
      [{ x: 2, y: 8, width: 10, height: 8 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}
export class Palm3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      24, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      4,
      [{ x: 2, y: 24, width: 12, height: 8, action: 7 }], // bsize
      'map_items/DesertTilemapBlankBackground.png'
    );
  }
}

export class Bridge1 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      0, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 4, y: 4, width: 12, height: 9, action: 7 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -100
    );
  }
}
export class Bridge2 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      2, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 4, y: 4, width: 12, height: 9, action: 7 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -100
    );
  }
}
export class Bridge3 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      14, // imgPosition X, Y
      0,
      2, // picWidth, picHeight
      4,
      [{ x: 0, y: 4, width: 12, height: 9, action: 7 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -100
    );
  }
}
export class Bridge4 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      0, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      4,
      [{ x: 4, y: 4, width: 12, height: 9, action: 7 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -100
    );
  }
}
export class Bridge5 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      2, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      4,
      [
        { x: 4, y: 4, width: 12, height: 9, action: 7 },
        { x: 3, y: 8, width: 4, height: 24 },
      ], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -100
    );
  }
}
export class Bridge6 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      4, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      4,
      [{ x: 4, y: 4, width: 12, height: 9, action: 7 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -100
    );
  }
}
export class Bridge7 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 1,
      12, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      4,
      [
        { x: 4, y: 4, width: 12, height: 9, action: 7 },
        { x: 9, y: 8, width: 4, height: 24 },
      ], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -100
    );
  }
}

export class Bridge8 extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY,
      14, // imgPosition X, Y
      4,
      2, // picWidth, picHeight
      2,
      [{ x: 4, y: 4, width: 8, height: 9, action: 7 }], // bsize
      'map_items/cave_bridgeHorizontal.png',
      -14
    );
  }
}

export class YellowHouse extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 5,
      0, // imgPosition X, Y
      0,
      8, // picWidth, picHeight
      12,
      [{ x: 5, y: 44, width: 54, height: 45 }], // bsize
      'map_items/House_Yellow.png',
      -14
    );
  }
}

export class Statue extends MapItem {
  constructor(mapPosX: number, mapPosY: number) {
    super(
      mapPosX,
      mapPosY - 5,
      54, // imgPosition X, Y
      0,
      7, // picWidth, picHeight
      12,
      [{ x: 13, y: 70, width: 37, height: 23, action: 7 }], // bsize
      'map_items/TXProps.png',
      -14
    );
  }
}
