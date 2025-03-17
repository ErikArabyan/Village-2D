import { Vector2, GameSettings } from './gamelib.ts';
import { borders, ItemIDs } from './ItemIDs.ts';
import { Player } from './items.ts';
import * as MapItems from './MapItems.ts';

type classNames = Exclude<keyof typeof MapItems, 'Home' | 'GameMap' | 'MapItem'>;

// -----------------------------------------------------------------------------
// ОДИН объект колизии

export class Boundary {
  mapPosition: Vector2;
  action: number;
  width: number;
  height: number;
  teleport?: number[];
  text?: MyText[];
  helpButton?: Sprite;
  show: Boolean;
  showText: Boolean;
  static width = 16;
  static height = 16;
  constructor({ x, y, action = 1, width, height, teleport, helpButton, text }: boundaryConfigs) {
    this.mapPosition = new Vector2(x + MapItems.GameMap.offsetX, y + MapItems.GameMap.offsetY);
    this.action = action;
    this.width = width * GameSettings.scale;
    this.height = height * GameSettings.scale;
    this.teleport = teleport;
    this.helpButton = helpButton;
    this.text = text;
    this.show = false;
    this.showText = false;
    if (this.width < 0) {
      this.mapPosition.x += this.width + 16 * GameSettings.scale;
      this.width *= -1;
    }
    if (this.height < 0) {
      this.mapPosition.y += this.height + 16 * GameSettings.scale;
      this.height *= -1;
    }
  }

  moveItem(x: number, y: number) {
    this.mapPosition.set(this.mapPosition.x - x, this.mapPosition.y - y);
    if (!this.helpButton) return;
    this.helpButton.mapPosition.set(this.helpButton.mapPosition.x - x, this.helpButton.mapPosition.y - y);
    this.text![0].mapPosition.set(this.helpButton.mapPosition.x - x, this.helpButton.mapPosition.y - y);
  }

  showHelp(player: Player, keys: Record<string, boolean>) {
    if (!this.show) return;
    if (keys.KeyE) {
      this.showText = !this.showText;
      keys.KeyE = false;
    }
    // prettier-ignore
    this.showText
    ? this.text![0].draw()
    : this.helpButton?.draw();

    if (!this._collide(player, player.boundary.mapPosition.x, player.boundary.mapPosition.y)) {
      this.show = false;
      this.showText = false;
    }
  }

  collide(player: Player, background: MapItems.GameMap, dx: number, dy: number, collisions: (number | number[])[]) {
    player.action = undefined;
    const px = player.boundary.mapPosition.x + dx * 2;
    const py = player.boundary.mapPosition.y + dy * 2;
    if (!this._collide(player, px, py)) return false;
    if (this.action == 0) {
      this.show = true;
      return false;
    }
    if (this.action !== 1) {
      player.action = this.action;
      this.teleport && Action.execute(background, this.action!, this.teleport, collisions);
    }
    return true;
  }

  _collide(player: Player, px: number, py: number): boolean {
    return (
      px < this.mapPosition.x + this.width &&
      px + player.boundary.width > this.mapPosition.x &&
      py < this.mapPosition.y + this.height &&
      py + player.boundary.height > this.mapPosition.y
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.height) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(this.mapPosition.x, this.mapPosition.y, this.width, this.height);
    } else if (!this.height && this.width) {
      ctx.beginPath();
      ctx.arc(this.mapPosition.x + this.width / 2, this.mapPosition.y + this.width / 2, this.width / 2, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

// -----------------------------------------------------------------------------
// Класс для создания и управления коллизиями карты
export class Collisions {
  static boundaries: Boundary[] = [];
  static items: any[] = [];
  static action0: Boundary[] = [];
  static width = 120;
  static height = 68;

  static createBoundary(row: number, col: number, cell: number | number[]) {
    const width = typeof cell === 'object' ? cell[1] * 16 : 16;
    const height = typeof cell === 'object' ? cell[2] * 16 : 16;

    return new Boundary({
      x: row * Boundary.width,
      y: col * Boundary.height,
      action: typeof cell === 'object' ? cell[0] : cell,
      width: width,
      height: height,
    });
  }

  static col(collisions: (number | number[])[]) {
    Collisions.items = [];
    Collisions.boundaries = Object.entries(collisions).reduce((acc: Boundary[], [key, cell], index) => {
      const row = index % Collisions.width;
      const col = Math.floor(index / Collisions.width);

      // acc.push(
      // 	new Boundary({
      // 		GameMap,
      // 		x: 1400,
      // 		y: 500,
      // 		action: 1,
      // 		width: 100,
      // 	})
      // )

      const newBoundaries = Action.processObject(row, col, cell);
      acc.push(...newBoundaries);

      return acc;
    }, []);
  }
}

export class Action {
  static teleport?: number[];
  static handlers: { [key: number]: (GameMap: any, collisions: (number | number[])[]) => void } = {
    2: (collisions) => {
      Collisions.col(collisions);
    },
    3: (collisions) => {
      Collisions.col(collisions);
    },
    4: (collisions) => {
      Collisions.col(collisions);
    },
    5: (collisions) => {
      Collisions.col(collisions);
    },
  };

  static move(player: Player, background: MapItems.GameMap, dx: number, dy: number, speed: number) {
    const smooth = 2;
    speed /= smooth;
    player.smoothMove(background, dx, dy, speed, smooth);
    background.smoothMove(player, dx, dy, speed);
  }

  static execute(background: MapItems.GameMap, action: number, t: number[], collisions: (number | number[])[]) {
    const mapConstructor = background.constructor as unknown as GameMapConstructor;
    background.image.src = mapConstructor.MAPS[action - 2] || background.image.src;
    this.handlers[action]?.(mapConstructor, collisions);

    const deviationX = mapConstructor.offsetX * GameSettings.scale;
    const deviationY = mapConstructor.offsetY * GameSettings.scale;

    t[0] = GameSettings.windowWidth / 2 - t[0] * GameSettings.scale;
    t[1] = GameSettings.windowHeight / 2 - t[1] * GameSettings.scale;

    background.mapPosition.set(t[0], t[1]);
    for (let i of [...Collisions.items, ...Collisions.boundaries]) {
      i.mapPosition.x += t[0] - deviationX;
      i.mapPosition.y += t[1] - deviationY;
    }
  }

  static createItemBoundary(
    className: Exclude<keyof typeof MapItems, 'Home' | 'GameMap' | 'MapItem'>,
    row: number,
    col: number,
    isAnimated?: boolean
  ) {
    const ItemClass = MapItems[className];
    const item = new ItemClass(row, col);
    isAnimated && item.updateFrame();
    Collisions.items.push(item);
    item.boundaries.map((i) => i.action == 0 && Collisions.action0.push(i));
    return item.boundaries;
  }

  static processObject(row: number, col: number, cell: number | number[]) {
    if (Array.isArray(cell) && cell.length) {
      const [id, ...params] = cell;

      if (id === 2472) {
        const home = new MapItems.Home(row, col, params[0], params[1], params[2]);
        Collisions.items.push(home);
        Action.teleport = home.boundaries[0].teleport;
        return home.boundaries;
      }

      if (ItemIDs.hasOwnProperty(id)) {
        const [className, flag] = ItemIDs[id as keyof typeof ItemIDs];
        return this.createItemBoundary(className as classNames, row, col, flag);
      }

      if (borders.hasOwnProperty(id)) {
        return borders[id](row, col);
      }
    }

    return cell !== 0 ? [Collisions.createBoundary(row, col, cell)] : [];
  }
}
