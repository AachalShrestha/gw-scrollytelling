import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import LoadModel from './LoadModel';

export default function SpaceComponents({ data, planetRefs, distanceScale, ANGLE_FACTOR }){
  return data.map((item, i) => {
    const distance = -Math.log10(item.distance_from_earth_ly + 1) * distanceScale;
    const x = distance * ANGLE_FACTOR;
    const z = distance;

    return (
      <group
        key={item.name}
        position={[x, 0, z]}
        ref={(el) => (planetRefs.current[i] = el)}
      >
        <Html position={[0, 2, 0]} center style={{ color: 'white', fontSize: '16px', pointerEvents: 'none' }}>
          {item.screen_name}
        </Html>
        <LoadModel position={[0, 0, 0]} scale={item.scale} model={item.fake_name} color="#860f0fff" />
      </group>
    );
  });
}