import { init, GameSettings } from './gamelib.ts';
import { Action, Collisions } from './utils.ts';
import { Player, Resources, Settings } from './items.ts';
import { GameMap, MapItem } from './MapItems.ts';
import collisions from '../collisions/collisions.json';

class Game {
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private keys: Record<string, boolean> = {};
  private player: Player;
  private background: GameMap;
  private settings: Settings;
  private resources: Resources;
  private movementMap: MovementMap;

  constructor() {
    this.ctx = init(GameMap.ID);
    this.player = new Player();
    this.background = new GameMap();
    this.settings = new Settings(0, 0, GameSettings.windowWidth, GameSettings.windowHeight);
    this.resources = new Resources(GameSettings.windowWidth - 104, 0, 104, 100);
    this.movementMap = new MovementMap(this.player, this.background);

    Collisions.col(collisions.object);

    this.setupEventListeners();
    requestAnimationFrame((time) => this.animate(time));
  }

  private setupEventListeners(): void {
    addEventListener('keydown', (e) => {
      if (!e.repeat) {
        this.keys[e.code] = true;
      }
    });

    addEventListener('keyup', (e) => {
      if (!e.repeat) {
        this.keys[e.code] = false;
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        GameSettings.pause = true;
        for (let i in this.keys) {
          this.keys[i] = false;
        }
      } else {
        GameSettings.pause = false;
      }
    });
  }

  updateDeltaTime(time: number) {
    if (!this.lastTime) this.lastTime = time;
    const deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;
    return deltaTime;
  }

  private animate(time: number): void {
    const deltaTime = this.updateDeltaTime(time);
    const moveSpeed = this.player.speed * deltaTime;

    this.ctx.clearRect(0, 0, GameSettings.windowWidth, GameSettings.windowHeight);
    this.draw();

    // prettier-ignore
    !GameSettings.pause && this.movementMap.keyDown(moveSpeed, this.keys)

    this.player.updateFrame(moveSpeed, this.keys, this.resources);
    requestAnimationFrame((time) => this.animate(time));
  }

  private draw(): void {
    this.background.draw();
    for (const i of Collisions.boundaries) i.draw(this.ctx);

    const objects: (Player | MapItem)[] = [this.player, ...Collisions.items];

    objects.sort((a, b) => {
      const aY = this.getYPosition(a);
      const bY = this.getYPosition(b);
      return aY - bY;
    });

    for (const i of objects) i.draw();
    this.resources.draw();
    this.settings.draw(this.keys);
    for (let i in Collisions.action0) {
      Collisions.action0[i].showHelp(this.player, this.keys);
    }
  }

  private getYPosition(obj: Player | MapItem): number {
    return obj instanceof Player ? obj.boundary.mapPosition.y : obj.mapPosition.y + obj.height! + obj.hide;
  }
}

type MovementKey = 'S' | 'D' | 'A' | 'W' | 'SD' | 'WD' | 'AS' | 'WA';

class MovementMap {
  private player: Player;
  private background: GameMap;
  public isMovementKeyPressed: boolean = false;
  public num: number = 0;

  constructor(player: Player, background: GameMap) {
    this.player = player;
    this.background = background;
  }

  private movementMap = {
    S: { dx: 0, dy: 1, num: 0 },
    D: { dx: 1, dy: 0, num: 1 },
    A: { dx: -1, dy: 0, num: 2 },
    W: { dx: 0, dy: -1, num: 3 },
    SD: { dx: 1, dy: 1, num: 4 },
    WD: { dx: 1, dy: -1, num: 5 },
    AS: { dx: -1, dy: 1, num: 6 },
    WA: { dx: -1, dy: -1, num: 7 },
  };

  public isMovementKey(code: string): boolean {
    // prettier-ignore
    switch (code) {
      case 'KeyW': case 'ArrowUp':
      case 'KeyS': case 'ArrowDown':
      case 'KeyA': case 'ArrowLeft':
      case 'KeyD': case 'ArrowRight':
        return true;
      default:
        return false;
    }
  }

  public updateMovementKeyPressed(keys: Record<string, boolean>): void {
    // prettier-ignore
    this.isMovementKeyPressed =
      keys.KeyW || keys.ArrowUp || keys.KeyS || keys.ArrowDown ||
      keys.KeyA || keys.ArrowLeft || keys.KeyD || keys.ArrowRight;
  }

  public movePlayer(dx = 0, dy = 0, speed: number): void {
    if (!Collisions.boundaries.some((b) => b.collide(this.player, this.background, dx, dy, collisions.object))) {
      Action.move(this.player, this.background, dx, dy, speed);
    }
  }

  public keyDown(moveSpeed: number, keys: Record<string, boolean>): void {
    const dir = { dx: 0, dy: 0 };
    const isUp = keys.KeyW || keys.ArrowUp;
    const isDown = keys.KeyS || keys.ArrowDown;
    const isLeft = keys.KeyA || keys.ArrowLeft;
    const isRight = keys.KeyD || keys.ArrowRight;
    const keyCombination = this.getKeyCombination(isUp, isDown, isLeft, isRight);

    if (keyCombination && !this.player.collecting) {
      const move = this.movementMap[keyCombination as MovementKey];
      if (move) {
        dir.dx = move.dx * moveSpeed;
        dir.dy = move.dy * moveSpeed;
        this.num = move.num;
      }
      if (dir.dx && dir.dy) {
        dir.dx /= 13 / 7;
        dir.dy /= 13 / 7;
      }
      if (dir.dx) this.movePlayer(dir.dx, 0, moveSpeed);
      if (dir.dy) this.movePlayer(0, dir.dy, moveSpeed);
    }

    keys.KeyE ? this.player.collect(keys, this.num) : this.player.endState(keys);

    this.player.changeState(keys, this.num, Boolean(dir.dx || dir.dy));
  }

  private getKeyCombination(isUp: boolean, isDown: boolean, isLeft: boolean, isRight: boolean): string {
    let keyCombination = '';
    if (isUp && !isDown) keyCombination += 'W';
    if (isLeft && !isRight) keyCombination += 'A';
    if (isDown && !isUp) keyCombination += 'S';
    if (isRight && !isLeft) keyCombination += 'D';
    return keyCombination;
  }
}

new Game();
