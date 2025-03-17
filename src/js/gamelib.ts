let ctx: CanvasRenderingContext2D;
export function init(id: string) {
  let canvas = document.getElementById(id) as HTMLCanvasElement;
  ctx = canvas.getContext('2d')!;
  canvas.width = GameSettings.windowWidth;
  canvas.height = GameSettings.windowHeight;

  function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  updateCanvasSize();

  window.addEventListener('resize', (e) => {
    updateCanvasSize();
  });
  return ctx;
}

// -----------------------------------------------------------------------------

export class GameSettings {
  static scale = 4;
  static windowWidth = window.innerWidth;
  static windowHeight = window.innerHeight;
  static pause = false;
}

// -----------------------------------------------------------------------------

export class Vector2 {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x * GameSettings.scale;
    this.y = y * GameSettings.scale;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// -----------------------------------------------------------------------------
// класс для отображения карты
export class Sprite {
  image: HTMLImageElement;
  mapPosition: Vector2;
  frame?: number;
  move?: number;
  frameWidth?: number;
  moveHeight?: number;
  width?: number;
  height?: number;

  constructor(
    path: string,
    mapX: number,
    mapY: number,
    width?: number,
    height?: number,
    frame?: number,
    move?: number,
    frameWidth?: number,
    moveHeight?: number
  ) {
    this.image = new Image();
    this.image.src = path;
    this.mapPosition = new Vector2(mapX, mapY);
    this.frame = frame;
    this.move = move;
    this.frameWidth = frameWidth;
    this.moveHeight = moveHeight;
    this.width = width! * GameSettings.scale;
    this.height = height! * GameSettings.scale;
  }

  draw() {
    ctx.imageSmoothingEnabled = false;
    if (this.frameWidth) {
      ctx.drawImage(
        this.image,
        this.frame!,
        this.move!,
        this.frameWidth,
        this.moveHeight!,
        this.mapPosition.x,
        this.mapPosition.y,
        this.width!,
        this.height!
      );
    } else if (this.width) {
      ctx.drawImage(this.image, this.mapPosition.x, this.mapPosition.y, this.width, this.height!);
    } else {
      ctx.drawImage(this.image, this.mapPosition.x, this.mapPosition.y);
    }
  }
}

// -----------------------------------------------------------------------------
// класс для отображения существ
export class Animation extends Sprite {
  images: string[];
  timer: Timer;
  side: number;
  action?: number;
  speed: number;
  sideCound: number;
  constructor(
    paths: string[],
    delay: number,
    pic_width: number,
    pic_height: number,
    width: number,
    height: number,
    x: number,
    y: number,
    speed: number,
    sideCound = 4
  ) {
    super(paths[0], x, y, width, height, 0, 0, pic_width, pic_height);
    this.images = paths;
    this.timer = new Timer(delay);
    this.side = 1;
    this.action = undefined;
    this.speed = speed;
    this.sideCound = sideCound;
  }

  updateFrame(time: number) {
    this.timer.doTick(time);
    if (this.timer.tick()) {
      this.frame = (this.frame! + this.frameWidth!) % (this.frameWidth! * 6);
      this.timer.reset();
    }
  }

  changeState(keys: Record<string, boolean>, x: number, ismove = false) {
    if (!this.action || !keys.KeyE) {
      this.side = x;
      const moveValues = [0, 32, 64, 96, 128, 160, 192, 224];
      this.move = moveValues[x] + (ismove ? (this.sideCound == 8 ? 256 : 128) : 0);
    }
  }
}

// -----------------------------------------------------------------------------

export class Entity extends Animation {
  // boundary: MapObject;

  static DEFAULT_SIZE = 32;
}

// -----------------------------------------------------------------------------

export class Menu {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = 'rgba(77, 77, 77, 0.9)';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// -----------------------------------------------------------------------------

export class Sound {
  audio: HTMLAudioElement;
  constructor(path: string) {
    this.audio = new Audio(path);
    this.audio.volume = 0.3;
  }

  play = () => this.audio.play();
  pause = () => this.audio.pause();
  loop = (value: boolean) => (this.audio.loop = value);
  volume = (value: number) => (this.audio.volume = value);
  playEffect = () => (this.audio.cloneNode() as HTMLAudioElement).play();

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}

// -----------------------------------------------------------------------------

export class MyText {
  text: string;
  font: string;
  size: number;
  mapPosition: Vector2;
  color: string;
  constructor(text: string, x: number, y: number) {
    this.text = text;
    this.font = 'Arial';
    this.size = 20;
    this.mapPosition = new Vector2(x, y);
    this.color = 'white';
  }

  setText = (text: string) => (this.text = text);

  draw() {
    ctx.font = `${this.size}px ${this.font}`;
    ctx.fillStyle = this.color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(this.text, this.mapPosition.x, this.mapPosition.y);
  }
}

// -----------------------------------------------------------------------------

export class Timer {
  delay: number;
  elapsed: number;
  constructor(delay: number) {
    this.delay = delay;
    this.elapsed = 0;
  }

  reset = () => (this.elapsed = 0);

  doTick = (time: number) => (this.elapsed += time);

  tick() {
    if (this.elapsed >= this.delay) {
      this.elapsed = 0;
      return true;
    }
    return false;
  }

  update() {
    if (this.elapsed < this.delay) {
      this.elapsed += 17; // 1000 ms / 60 fps = 16.7
    }
  }
}

// -----------------------------------------------------------------------------

export class List {
  items: string[];
  constructor() {
    this.items = [];
  }

  add = (item: string) => this.items.push(item);

  clear = () => (this.items = []);

  get(index: number) {
    if (index >= 0 && index < this.items.length) {
      return this.items[index];
    }
  }

  filter(callback: (value: string, index: number, array: string[]) => boolean) {
    this.items = this.items.filter(callback);
  }

  forEach(callback: (value: string, index: number, array: string[]) => void) {
    this.items.forEach(callback);
  }

  count = () => this.items.length;

  remove(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
    }
  }
}

// -----------------------------------------------------------------------------

export class Storage {
  save = (key: string, value: string) => localStorage.setItem(key, value);

  load(key: string) {
    let value = localStorage.getItem(key);
    return value;
  }

  remove = (key: string) => localStorage.removeItem(key);

  clear = () => localStorage.clear();
}
