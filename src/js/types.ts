import { type MyText, type Sprite } from "./gamelib";
import * as MapItems from './MapItems.ts';

export interface Vector2Constructor {
  x: number;
  y: number;
}

export interface BoundaryConstructor {
  x: number;
  y: number;
  width: number;
  height: number;
  action?: number;
  teleport?: number[];
  helpButton?: Sprite;
  text?: MyText[];
}

export interface GameMapConstructor {
  MAPS: string[];
  offsetX: number;
  offsetY: number;
}

export type MovementKey = 'S' | 'D' | 'A' | 'W' | 'SD' | 'WD' | 'AS' | 'WA';

export type classNames = Exclude<keyof typeof MapItems, 'Home' | 'GameMap' | 'MapItem'>;