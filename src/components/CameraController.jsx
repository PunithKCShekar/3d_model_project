import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraController({ viewMode }) {
  useFrame((state) => {
    let targetPos = [3, 1.2, 3];
    switch (viewMode) {
      case 'side':
        targetPos = [0, 0, 3.8];
        break;
      case 'top':
        targetPos = [0, 3.8, 0.01];
        break;
      case 'front':
        targetPos = [3.8, -0.1, 0];
        break;
      case 'heel':
        targetPos = [-3.8, 0.1, 0];
        break;
      case 'angle':
      default:
        targetPos = [3, 1.2, 3];
        break;
    }
    
    // Smoothly transition camera position using linear interpolation
    state.camera.position.lerp(new THREE.Vector3(...targetPos), 0.07);
    
    // Ensure the camera continues looking at the center of the sneaker
    state.camera.lookAt(new THREE.Vector3(0, -0.05, 0));
  });
  return null;
}
