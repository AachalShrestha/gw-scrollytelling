import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import {Scroll, ScrollControls} from "@react-three/drei"

// Simple rotating box component using react-three-fiber

function Box(props) {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01
      ref.current.rotation.y += 0.01
    }
  })
  return (
    <mesh ref={ref} {...props}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function App() {
  return (
    // The Canvas element manages the scene, camera and renderer for you.
    <div style={{ width: '100vw', height: '100vh' }}>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ScrollControls pages={2} damping={0.1}>
          <Scroll html>
            <h1>Hallo wereld</h1>
          </Scroll>
        </ScrollControls>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Box position={[0, 0, 0]}/>
      </Canvas>
    </div>
  )
}
