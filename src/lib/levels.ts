export interface Level {
  id: number;
  name: string;
  par: number;
  startPosition: [number, number, number];
  holePosition: [number, number, number];
  holeRadius: number;
  obstacles: {
    type: 'box' | 'ramp';
    position: [number, number, number];
    size: [number, number, number];
    rotation?: [number, number, number];
  }[];
  terrain?: {
    type: 'slope' | 'curve';
  }
}

export const levels: Level[] = [
  {
    id: 1,
    name: 'Introductory',
    par: 2,
    startPosition: [0, 0.2, 8],
    holePosition: [0, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [
      { type: 'box', position: [2, 0.5, 0], size: [1, 1, 4] },
      { type: 'box', position: [-2, 0.5, 2], size: [1, 1, 4] },
    ],
  },
  {
    id: 2,
    name: 'Moderate',
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 1.01, -12],
    holeRadius: 0.25,
    obstacles: [
      { type: 'ramp', position: [0, 0, -5], size: [4, 1, 8], rotation: [0.1, 0, 0] },
    ],
  },
  {
    id: 3,
    name: 'Bonus',
    par: 4,
    startPosition: [-5, 0.2, 12],
    holePosition: [5, 2.01, -12],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, 0, 0], size: [4, 1, 8], rotation: [-0.1, 0.2, 0] },
        { type: 'ramp', position: [0, 1, -10], size: [4, 1, 8], rotation: [0.1, -0.2, 0] },
    ],
  }
];
