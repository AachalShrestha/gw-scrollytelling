import React, { useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js"

function Earth() {
  const groupRef = useRef()
  const { scene } = useGLTF("/earth.glb")
  const { gl, camera, scene: r3fScene } = useThree()
  const effectRef = useRef()
  const outlineColor = new THREE.Color("#0E5173")


  useEffect(() => {
    // Create OutlineEffect
    effectRef.current = new OutlineEffect(gl, {
      defaultThickness: 0.01,
      defaultColor: outlineColor, // HSL / RGB normalized
      defaultAlpha: 1
    })

    // Set up GLTF meshes
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({
          map: child.material.map || null
        })
        child.userData.outlineParameters = {
          thickness: 0.01,
          color: outlineColor ,
          alpha: 1,
          visible: true
        }
      }
    })

    // Add the GLTF scene to R3F scene
    r3fScene.add(scene)
  }, [gl, r3fScene, scene])

  // Animate / render loop
  useFrame(() => {
    if (effectRef.current) {
      effectRef.current.render(r3fScene, camera)
    }
  }, 1) // priority 1 to render after default R3F render

  return null
}

export default function Interface() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }} >
      <color attach="background" args={["#222233"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <OrbitControls enableDamping />
      <Earth />
    </Canvas>
  )
}
