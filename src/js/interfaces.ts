interface Vector2 {
  x: number;
  y: number;

  set(x: number, y: number): void;
}

interface Sprite {
  image: HTMLImageElement;
  mapPosition: Vector2;
  frame?: number;
  move?: number;
  frameWidth?: number;
  moveHeight?: number;
  width?: number;
  height?: number;

  draw(): void;
}

interface MyText {
  text: string;
  font: string;
  size: number;
  mapPosition: Vector2;
  color: string;

  draw(): void;
}

interface PlayerConfigs {
  collecting: boolean;
  colHeight: number;
  moveX: number;
  moveY: number;
  boundary: Record<string, number>;
}

interface boundaryConfigs {
  x: number;
  y: number;
  width: number;
  height: number;
  action?: number;
  teleport?: number[];
  helpButton?: Sprite;
  text?: MyText[];
}

interface GameMapConstructor {
  MAPS: string[];
  offsetX: number;
  offsetY: number;
}

type MapObject = {
  mapPosition: { x: number; y: number };
  width: number;
  height: number;
};