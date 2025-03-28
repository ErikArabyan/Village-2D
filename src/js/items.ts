import { Sprite, Menu, MyText, Sound, GameSettings, Animation, Vector2 } from './gamelib.ts';
import { GameMap } from './MapItems.ts';
import { Boundary } from './utils.ts';

// -----------------------------------------------------------------------------

export class NPC extends Animation {
  collecting: boolean;
  colHeight: number;
  boundary: Boundary;
  oldMapPosition: Vector2;

  static DEFAULT_SIZE = 32;
  constructor() {
    super(
      ['players/Player.png', 'players/Player_Actions.png'],
      35,
      32,
      32,
      32,
      32,
      350,
      135,
      60 * GameSettings.scale,
      8
    );
    this.collecting = false;
    this.colHeight = 0;
    this.oldMapPosition = new Vector2(-754, -375);
    // this.boundary = new Boundary({
    //   x: Player.initialPosX - GameMap.offsetX + 11,
    //   y: Player.initialPosY - GameMap.offsetY + 21,
    //   width: 9,
    //   height: 3,
    // });
    this.boundary = new Boundary({
      x: 350 - GameMap.offsetX + 11,
      y: 135 - GameMap.offsetY + 21,
      width: 9,
      height: 3,
    });
  }
  smoothMove = (background: GameMap) => {
    this.mapPosition.set(
      this.mapPosition.x - (this.oldMapPosition.x - background.mapPosition.x),
      this.mapPosition.y - (this.oldMapPosition.y - background.mapPosition.y)
    );
    this.boundary.mapPosition.set(
      this.mapPosition.x - (this.oldMapPosition.x - background.mapPosition.x - 11 * GameSettings.scale),
      this.mapPosition.y - (this.oldMapPosition.y - background.mapPosition.y - 21 * GameSettings.scale)
    );
    this.oldMapPosition.set(background.mapPosition.x, background.mapPosition.y);
  };
  moveTowards(player: Player, background: GameMap, boundaries: Boundary[]) {
    this.smoothMove(background);

    const dx = player.mapPosition.x - this.mapPosition.x;
    const dy = player.mapPosition.y - this.mapPosition.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance > 0 && distance < 400) {
      const stepX = (dx / distance) * 1;
      const stepY = (dy / distance) * 1;

      let newX = this.mapPosition.x + stepX;
      let newY = this.mapPosition.y + stepY;

      const px = this.boundary.mapPosition.x + stepX * 2;
      const py = this.boundary.mapPosition.y + stepY * 2;

      if (!boundaries.some((b) => b.checkCollision(this, px, py))) {
        this.mapPosition.x = newX;
        this.mapPosition.y = newY;
      } else {
        // Пробуем двигаться в обход
        let alternativeX = this.mapPosition.x + stepX;
        let alternativeY = this.mapPosition.y;

        if (!boundaries.some((b) => b.checkCollision(this, alternativeX, this.mapPosition.y))) {
          this.mapPosition.x = alternativeX;
        } else if (!boundaries.some((b) => b.checkCollision(this, this.mapPosition.x, alternativeY))) {
          this.mapPosition.y = alternativeY;
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
export class Player extends Animation {
  collecting: boolean;
  colHeight: number;
  boundary: Boundary;

  static DEFAULT_SIZE = 32;
  static COLLECT_SIZE = 48;
  static actualPosX = GameSettings.windowWidth / 2 - 16 * GameSettings.scale;
  static actualPosY = GameSettings.windowHeight / 2 - 16 * GameSettings.scale;
  static initialPosX = Player.actualPosX / GameSettings.scale;
  static initialPosY = Player.actualPosY / GameSettings.scale;
  constructor() {
    super(
      ['players/Player.png', 'players/Player_Actions.png'],
      35,
      32,
      32,
      32,
      32,
      Player.initialPosX,
      Player.initialPosY,
      60 * GameSettings.scale,
      8
    );
    this.collecting = false;
    this.colHeight = 0;
    this.boundary = new Boundary({
      x: Player.initialPosX - GameMap.offsetX + 11,
      y: Player.initialPosY - GameMap.offsetY + 21,
      width: 9,
      height: 3,
    });
  }

  _setSize(size: number) {
    this.image.src = !this.collecting ? this.images[1] : this.images[0];
    this.moveHeight = size;
    this.frameWidth = size;
    this.width = size * GameSettings.scale;
    this.height = size * GameSettings.scale;
    this.frame = 0;
  }

  static calculateSide(input: number): number {
    const mapping: Record<number, number> = {
      0: 0,
      4: 1,
      1: 1,
      6: 2,
      2: 2,
      3: 3,
      5: 3,
      7: 3,
    };

    return mapping[input];
  }

  endState(keys: Record<string, boolean>) {
    if (!(this.action && !keys.KeyE && this.collecting)) return;
    if ([1, 2].includes(this.side)) this.boundary.mapPosition.y -= 64;
    this._setSize(Player.DEFAULT_SIZE);
    this.move = (this.move! / 3) * 2;
    this.mapPosition.set(this.mapPosition.x + 8 * GameSettings.scale, this.mapPosition.y + 8 * GameSettings.scale);
    this.collecting = false;
    this.colHeight -= 8 * GameSettings.scale;
  }

  collect(keys: Record<string, boolean>, num: number) {
    if (!(this.action && keys.KeyE && !this.collecting)) return;
    this.side = Player.calculateSide(num);
    if ([1, 2].includes(this.side)) this.boundary.mapPosition.y += 64;
    this._setSize(Player.COLLECT_SIZE);
    this.move = (this.move! / 2) * 3;
    this.mapPosition.set(this.mapPosition.x - 8 * GameSettings.scale, this.mapPosition.y - 8 * GameSettings.scale);
    this.collecting = true;
    const collectMoveValues = [0, 48, 96, 144];
    this.move = collectMoveValues[this.side];
    this.colHeight += 8;

    if (this.action === 7 && this.move < 192) this.move += 192;
  }

  updateFrame(time: number, keys?: Record<string, boolean>, resources?: Resources): void {
    this.timer.doTick(time);
    if (!this.timer.tick()) return;

    if (this.action && keys?.KeyE) {
      resources?.items[this.action].collect();
      this.frame = this.frame === 0 ? this.frameWidth : 0;
    } else {
      this.frame = (this.frame! + this.frameWidth!) % (this.frameWidth! * 6);
    }

    this.timer.reset();
  }

  smoothMove(background: GameMap, x: number, y: number, speed: number, smooth: number) {
    x /= smooth;
    y /= smooth;
    speed /= smooth;
    const { windowWidth, windowHeight, scale } = GameSettings;
    const { mapPosition } = background;
    const mapWidth = GameMap.width * scale;
    const mapHeight = GameMap.height * scale;
    const mapXEnd = windowWidth - mapPosition.x;
    const mapYEnd = windowHeight - mapPosition.y;

    // не дает выходить за границу
    const calcX = Player.actualPosX - this.mapPosition.x;
    const calcY = Player.actualPosY - this.mapPosition.y;
    let dx = Math.abs(calcX - x) <= 30 ? x : mapPosition.x == 0 || mapWidth == mapXEnd ? x * 2 : 0;
    let dy = Math.abs(calcY - y) <= 30 ? y : mapPosition.y == 0 || mapHeight == mapYEnd ? y * 2 : 0;

    // плавное движение
    if (x === 0 && Math.abs(calcX) >= 8 && mapPosition.x != 0 && mapWidth != mapXEnd) dx = calcX > 0 ? speed : -speed;
    if (y === 0 && Math.abs(calcY) >= 8 && mapPosition.y != 0 && mapHeight != mapYEnd) dy = calcY > 0 ? speed : -speed;

    // не дает выходить за экран
    if (this.mapPosition.x + dx >= 0 && this.mapPosition.x + this.width! + dx <= GameSettings.windowWidth) {
      this.mapPosition.x += dx;
      this.boundary.mapPosition.x += dx;
    }
    if (this.mapPosition.y + dy >= 0 && this.mapPosition.y + this.height! + dy <= GameSettings.windowHeight) {
      this.mapPosition.y += dy;
      this.boundary.mapPosition.y += dy;
    }
  }
}

// -----------------------------------------------------------------------------
// класс для отображения предметов на карте

export class Resource {
  sprite: Sprite;
  collected: number;
  inventorySize: number;
  text: MyText;
  constructor(img: string, x: number, y: number) {
    this.sprite = new Sprite(
      img,
      x / GameSettings.scale,
      y / GameSettings.scale,
      32 / GameSettings.scale,
      32 / GameSettings.scale
    );
    this.collected = 0;
    this.inventorySize = 10;
    this.text = new MyText(
      `${this.collected} / ${this.inventorySize}`,
      (x + 36) / GameSettings.scale,
      (y + 7) / GameSettings.scale
    );
  }

  collect() {
    if (this.collected <= this.inventorySize * 10) {
      this.collected++;
      this.text.setText(`${Math.floor(this.collected / 10)} / ${this.inventorySize}`);
      if (this.collected === this.inventorySize * 10) {
        this.text.color = 'green';
      }
    }
  }

  draw() {
    this.sprite.draw();
    this.text.draw();
  }
}

export class Resources extends Menu {
  items: Record<number, Resource>;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);

    this.items = {
      7: new Resource('Items/wood.png', x + 4, y),
      8: new Resource('Items/rock.png', x + 4, y + 32),
      9: new Resource('Items/diamond.png', x + 4, y + 64),
    };
  }

  draw() {
    super.draw();
    for (const i of Object.values(this.items)) i.draw();
  }
}

export class Option {
  sprite: Sprite;
  text: MyText;
  action: Function;
  number: number;
  constructor(
    imgConfigs: {
      img: string;
      mapX: number;
      mapY: number;
      width: number;
      height: number;
      imgPosX: number;
      imgPosY: number;
      scaleX: number;
      scaleY: number;
    },
    text: string,
    x: number,
    y: number,
    action: Function,
    num: number
  ) {
    this.sprite = new Sprite(
      imgConfigs.img,
      imgConfigs.mapX,
      imgConfigs.mapY,
      imgConfigs.scaleX,
      imgConfigs.scaleY,
      imgConfigs.imgPosX,
      imgConfigs.imgPosY,
      imgConfigs.width,
      imgConfigs.height
    );
    this.text = new MyText(text, x, y);
    this.action = action;
    this.number = num;
  }

  draw(num: number) {
    if (this.number == num) {
      this.text.color = 'red';
    } else {
      this.text.color = 'white';
    }
    this.sprite.draw();
    this.text.draw();
  }
}

export class Settings extends Menu {
  music: Sound;
  help: Sprite[];
  items: Option[];
  activeItem: number;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.music = new Sound('music/funny-bgm.mp3');
    this.help = [
      new Sprite(
        'Items/enter.png',
        ((x + width) / 2 - 86) / GameSettings.scale,
        ((y + height) / 2 - 100) / GameSettings.scale
      ),
      new Sprite(
        'Items/arrows.png',
        ((x + width) / 2 - 10) / GameSettings.scale,
        ((y + height) / 2 - 146) / GameSettings.scale
      ),
    ];
    this.items = [
      new Option(
        {
          img: 'UI/icons_16x16.png',
          mapX: ((x + width) / 2 - 82) / GameSettings.scale,
          mapY: ((y + height) / 2 - 38) / GameSettings.scale,
          imgPosX: 16,
          imgPosY: 16,
          width: 16,
          height: 16,
          scaleX: 8,
          scaleY: 8,
        },
        'Play Music',
        ((x + width) / 2 - 50) / GameSettings.scale,
        ((y + height) / 2 - 32) / GameSettings.scale,
        () => this.music.play(),
        0
      ),
      new Option(
        {
          img: 'UI/icons_16x16.png',
          mapX: ((x + width) / 2 - 82) / GameSettings.scale,
          mapY: ((y + height) / 2 - 6) / GameSettings.scale,
          imgPosX: 32,
          imgPosY: 16,
          width: 16,
          height: 16,
          scaleX: 8,
          scaleY: 8,
        },
        'Pause Music',
        ((x + width) / 2 - 50) / GameSettings.scale,
        (y + height) / 2 / GameSettings.scale,
        () => this.music.pause(),
        1
      ),
      new Option(
        {
          img: 'UI/icons_16x16.png',
          mapX: ((x + width) / 2 - 82) / GameSettings.scale,
          mapY: ((y + height) / 2 + 26) / GameSettings.scale,
          imgPosX: 16,
          imgPosY: 0,
          width: 16,
          height: 16,
          scaleX: 8,
          scaleY: 8,
        },
        'Volume Change',
        ((x + width) / 2 - 50) / GameSettings.scale,
        ((y + height) / 2 + 32) / GameSettings.scale,
        (keys: Record<string, boolean>) => this.volume(keys),
        2
      ),
    ];
    this.activeItem = 0;
  }

  draw(keys?: Record<string, Boolean>) {
    if (keys?.Escape) {
      GameSettings.pause = !GameSettings.pause;
      keys.Escape = false;
    }
    if (GameSettings.pause) {
      this._draw();
      if (keys?.Enter) {
        this.items[this.activeItem].action();
        keys.Enter = false;
      }
      if (keys?.ArrowUp) {
        this.activeItem = (this.activeItem - 1 + this.items.length) % this.items.length;
        keys.ArrowUp = false;
      }
      if (keys?.ArrowDown) {
        this.activeItem = (this.activeItem + 1) % this.items.length;
        keys.ArrowDown = false;
      }
      if ((keys?.ArrowLeft || keys?.ArrowRight) && this.activeItem === 2) {
        this.items[this.activeItem].action(keys);
      }
    }
  }

  _draw() {
    super.draw();
    for (const i of [...this.help, ...this.items]) i.draw(this.activeItem);
  }

  volume(keys: Record<string, boolean>) {
    if (keys.ArrowLeft) {
      this.music.volume(Math.max(this.music.audio.volume - 0.08, 0));
      keys.ArrowLeft = false;
    }
    if (keys.ArrowRight) {
      this.music.volume(Math.min(this.music.audio.volume + 0.08, 1));
      keys.ArrowRight = false;
    }
  }
}

// -----------------------------------------------------------------------------
