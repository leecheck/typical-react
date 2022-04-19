import * as THREE from 'three';

export function LinearGradientMaterial(stops: [], opacity: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  stops.forEach((stop) => {
    gradient.addColorStop(stop[0], stop[1]);
  });

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvasMaterial({ canvas, opacity });
}

export function canvasMaterial({ canvas, opacity }) {
  const canvasTexture = new THREE.CanvasTexture(canvas);
  return new THREE.MeshBasicMaterial({ map: canvasTexture, opacity: opacity });
}
