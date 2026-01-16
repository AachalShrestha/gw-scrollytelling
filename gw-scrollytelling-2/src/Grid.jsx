import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const GravityWaveMaterial = shaderMaterial(
  { time: 0 },
  // vertex shader
  `
  varying vec2 vUv;
  uniform float time;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float wave = sin(pos.x * 3.0 + time) * 0.2;
    wave += sin(pos.y * 3.0 + time * 1.5) * 0.2;

    pos.z += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // fragment shader
  `
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(vec3(1.0), 1.0);
  }
  `
);

extend({ GravityWaveMaterial });

export default function GravityWaveGrid() {
  const mat = useRef();

  useFrame((_, delta) => {
    mat.current.time += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 200, 200]} />
      <gravityWaveMaterial ref={mat} wireframe />
    </mesh>
  );
}
