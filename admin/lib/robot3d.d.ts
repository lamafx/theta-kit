// Types de la copie du robot θ du site (robot3d.js).
import type * as THREE from 'three';

export type Robot = {
  R: THREE.Group;
  B: THREE.Group;
  tete: THREE.Group;
  bras: Record<number, { sp: THREE.Group; ep: THREE.Group }>;
  jet: THREE.Sprite;
  visage: (expr: 'neutral' | 'happy', ouverture: number, lx: number, ly: number) => void;
};
export function creerRobot(T: typeof THREE): Robot;
export function eclairerRobot(T: typeof THREE, r: THREE.WebGLRenderer, scene: THREE.Scene): void;
