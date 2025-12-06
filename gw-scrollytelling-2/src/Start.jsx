import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function CustomStars({ count = 1000, shape = "sphere", radius = 10 }) {
  const points = useRef();

  // Generate positions once
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    if (shape === "box") {
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 2;
        const y = (Math.random() - 0.5) * 2;
        const z = (Math.random() - 0.5) * 2;
        positions.set([x, y, z], i * 3);
      }
    }

    if (shape === "sphere") {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2; // radians
        const phi = Math.random() * Math.PI * 2;   // radians

        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);

        positions.set([x, y, z], i * 3);
      }
    }

    return positions;
  }, [count, shape]); // memoize so it only runs once

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ac6aa6" 
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
