import { Boundary } from './utils';

export const ItemIDs: Record<number, [string, boolean]> = {
  2536: ['Tree', false],
  2535: ['Tree1', false],
  2531: ['GreenTree', false],
  2532: ['OrangeTree', false],
  2533: ['PinkTree', false],

  2551: ['Ice', false],
  2565: ['Ice1', false],

  2540: ['Bone', false],
  3142: ['Bone1', false],
  3143: ['Bone2', false],
  3144: ['Bone3', false],
  3145: ['Bone4', false],

  1273: ['DesertHouse1', false],
  1263: ['DesertHouse2', false],
  1265: ['DesertHouse3', false],
  1267: ['DesertHouse4', false],

  3157: ['Table1', false],
  3158: ['Table2', false],
  3159: ['Table3', false],
  3160: ['Table4', false],

  2543: ['Stone', false],
  2662: ['Stone2', false],
  2555: ['Stone3', false],

  1140: ['DesertStone1', false],
  1141: ['DesertStone2', false],
  1142: ['DesertStone3', false],
  1172: ['DesertStone4', false],

  2523: ['Grass', false],
  2537: ['Grass1', false],

  2469: ['BarierLeft', false],
  2470: ['BarierMiddle', false],
  2471: ['BarierRight', false],
  2468: ['BarierTop', false],
  2479: ['BarierVerticalMiddle', false],
  2490: ['BarierDown', false],
  2480: ['BarierTopLeft', false],
  2482: ['BarierTopRight', false],
  2502: ['BarierDownLeft', false],
  2504: ['BarierDownRight', false],

  2827: ['BarierLeft1', false],
  2828: ['BarierMiddle1', false],
  2829: ['BarierRight1', false],
  2779: ['BarierTop1', false],
  2796: ['BarierVerticalMiddle1', false],
  2813: ['BarierDown1', false],
  2776: ['BarierTopLeft1', false],
  2778: ['BarierTopRight1', false],
  2810: ['BarierDownLeft1', false],
  2812: ['BarierDownRight1', false],

  2544: ['Emerald1', false],
  2545: ['Emerald2', false],
  2558: ['Emerald3', false],
  2559: ['Emerald4', false],

  3164: ['CristmasTree1', false],
  3166: ['CristmasTree2', false],
  3168: ['CristmasTree3', false],
  3170: ['CristmasTree4', false],

  3179: ['SmallBush1', false],
  3180: ['SmallBush2', false],
  3181: ['SmallBush3', false],
  3182: ['SmallBush4', false],

  3194: ['BigBush1', false],
  3195: ['BigBush2', false],
  3196: ['BigBush3', false],
  3197: ['BigBush4', false],

  1136: ['Cactus1', false],
  1137: ['Cactus2', false],
  1138: ['Cactus3', false],
  1139: ['Cactus4', false],
  2528: ['Cactus5', false],
  2529: ['Cactus6', false],
  2530: ['Cactus7', false],

  1144: ['Palm2', false],
  1145: ['Palm3', false],

  2725: ['Bridge1', false],
  2726: ['Bridge2', false],
  2727: ['Bridge2', false],
  2731: ['Bridge2', false],
  2732: ['Bridge3', false],
  2742: ['Bridge4', false],
  2760: ['Bridge5', false],
  2761: ['Bridge6', false],
  2765: ['Bridge7', false],
  2749: ['Bridge8', false],

  3128: ['Vase', false],
  2663: ['StreetLight', false],

  2660: ['Stamp', false],

  3071: ['YellowHouse', false],

  1598: ['Statue', false],

  2600: ['CampFire', true],

  3014: ['Fountain', true],
};

export const borders: Record<number, (row: number, col: number) => Boundary[]> = {
  24: (row, col) => f1([[row * 16 + 9, col * 16 + 9, 7, 7]]),
  25: (row, col) => f1([[row * 16, col * 16 + 9, 16, 4]]),
  28: (row, col) => f1([[row * 16, col * 16 + 9, 7, 7]]),
  29: (row, col) => f1([[row * 16 + 3, col * 16 + 3, 13, 9]]),
  30: (row, col) => f1([[row * 16, col * 16 + 3, 13, 9]]),
  46: (row, col) => f1([[row * 16 + 9, col * 16, 4, 16]]),
  50: (row, col) => f1([[row * 16 + 3, col * 16, 4, 16]]),
  90: (row, col) => f1([[row * 16 + 9, col * 16, 7, 12]]),
  91: (row, col) => f1([[row * 16, col * 16 + 3, 16, 9]]),
  94: (row, col) => f1([[row * 16, col * 16, 7, 12]]),
  51: (row, col) =>
    f1([
      [row * 16 + 3, col * 16 + 9, 13, 4],
      [row * 16 + 3, col * 16, 4, 9],
    ]),
  52: (row, col) =>
    f1([
      [row * 16, col * 16 + 9, 13, 4],
      [row * 16 + 9, col * 16, 4, 9],
    ]),
  95: (row, col) =>
    f1([
      [row * 16, col * 16 + 3, 64, 9],
      [row * 16 + 10, col * 16 - 13, 45, 16],
    ]),
};

function f1(arg: Array<[number, number, number, number]>) {
  return arg.map(([row, col, width, height]) => new Boundary({ x: row, y: col, width, height }));
}
