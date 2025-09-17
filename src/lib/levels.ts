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
    name: 'The First Tee',
    par: 2,
    startPosition: [0, 0.2, 8],
    holePosition: [0, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [],
  },
  {
    id: 2,
    name: 'The Wall',
    par: 2,
    startPosition: [0, 0.2, 8],
    holePosition: [0, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [
      { type: 'box', position: [0, 0.5, 0], size: [4, 1, 0.5] },
    ],
  },
  {
    id: 3,
    name: 'The Ramp',
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 1.01, -12],
    holeRadius: 0.25,
    obstacles: [
      { type: 'ramp', position: [0, 0, -2], size: [4, 1, 12], rotation: [0.15, 0, 0] },
    ],
  },
  {
    id: 4,
    name: 'The S-Curve',
    par: 3,
    startPosition: [-4, 0.2, 10],
    holePosition: [4, 0.01, -10],
    holeRadius: 0.25,
    obstacles: [
      { type: 'box', position: [1.5, 0.5, 5], size: [7, 1, 0.5] },
      { type: 'box', position: [-1.5, 0.5, -5], size: [7, 1, 0.5] },
    ],
  },
  {
    id: 5,
    name: 'The Tunnel',
    par: 2,
    startPosition: [0, 0.2, 10],
    holePosition: [0, 0.01, -10],
    holeRadius: 0.25,
    obstacles: [
        { type: 'box', position: [-1, 0.5, 0], size: [0.5, 1, 5] },
        { type: 'box', position: [1, 0.5, 0], size: [0.5, 1, 5] },
    ],
  },
  {
    id: 6,
    name: 'The Bouncer',
    par: 4,
    startPosition: [-8, 0.2, 0],
    holePosition: [8, 0.01, 0],
    holeRadius: 0.3,
    obstacles: [
        { type: 'box', position: [0, 0.5, 8], size: [1, 1, 16], rotation: [0, -0.785, 0] },
        { type: 'box', position: [0, 0.5, -8], size: [1, 1, 16], rotation: [0, 0.785, 0] },
    ],
  },
  {
    id: 7,
    name: 'The Maze',
    par: 5,
    startPosition: [-8, 0.2, 8],
    holePosition: [8, 0.01, -8],
    holeRadius: 0.25,
    obstacles: [
        { type: 'box', position: [-4, 0.5, 4], size: [0.5, 1, 9] },
        { type: 'box', position: [0, 0.5, 0], size: [9, 1, 0.5] },
        { type: 'box', position: [4, 0.5, -4], size: [0.5, 1, 9] },
    ],
  },
  {
    id: 8,
    name: 'Double Ramp',
    par: 4,
    startPosition: [-5, 0.2, 12],
    holePosition: [5, 2.01, -12],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, 0, 0], size: [4, 1, 8], rotation: [-0.1, 0.2, 0] },
        { type: 'ramp', position: [0, 1, -10], size: [4, 1, 8], rotation: [0.1, -0.2, 0] },
    ],
  },
  {
    id: 9,
    name: 'The Ridge',
    par: 3,
    startPosition: [0, 0.2, 12],
    holePosition: [0, 0.01, -12],
    holeRadius: 0.25,
    obstacles: [
        { type: 'ramp', position: [0, 0.2, 0], size: [8, 0.5, 4], rotation: [0, 0, 0.2] },
        { type: 'ramp', position: [0, 0.2, 0], size: [8, 0.5, 4], rotation: [0, 0, -0.2] },
    ],
  },
  {
    id: 10,
    name: 'Final Putt',
    par: 3,
    startPosition: [0, 0.2, 14],
    holePosition: [0, 0.01, -14],
    holeRadius: 0.2,
    obstacles: [
        { type: 'box', position: [2, 0.5, 5], size: [1, 1, 1] },
        { type: 'box', position: [-2, 0.5, 0], size: [1, 1, 1] },
        { type: 'box', position: [2, 0.5, -5], size: [1, 1, 1] },
        { type: 'box', position: [-2, 0.5, -10], size: [1, 1, 1] },
    ],
  }
];
