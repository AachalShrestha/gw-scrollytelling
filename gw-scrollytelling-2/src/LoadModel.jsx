import * as THREE from 'three'
import { useGLTF, useTexture, Edges, Outlines } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js"
import gsap from 'gsap'

const LoadModel = forwardRef(
  ({ model, color = "#0E5173", scale = 1, position = [0,0,0], rotation }, ref) => {
    const { scene } = useGLTF(`/${model}.glb`)
    const gradient = useTexture('/gradient.jpg')
    const outlineColor = new THREE.Color(color)

    // Set initial rotation if provided
    useEffect(() => {
      if (!ref?.current) return
      if (rotation) {
        ref.current.rotation.set(
          THREE.MathUtils.degToRad(rotation[0] || 0),
          THREE.MathUtils.degToRad(rotation[1] || 0),
          THREE.MathUtils.degToRad(rotation[2] || 0)
        )
      }
    }, [rotation, ref])

    // Floating animation
    useFrame(() => {
      if (!ref?.current) return
      const t = performance.now() * 0.001
      ref.current.position.y = Math.cos(t) * 0.02
    })

    return (
      <group ref={ref} scale={scale} position={position}>
        {scene.children.map((child) => {
          const meshes = []
          child.traverse((c) => {
            if (c.isMesh) meshes.push(c)
          })
          return meshes.map((mesh) => (
            <mesh key={mesh.uuid} geometry={mesh.geometry}>
              <meshToonMaterial map={mesh.material.map} />
              <Outlines angle={0} thickness={3.5} color={outlineColor} />
            </mesh>
          ))
        })}
      </group>
    )
  }
)

export default LoadModel

/* const LoadingModel = forwardRef((props, ref) => {
  const { model, color } = props
  const {scene} = useGLTF(`/${model}.glb`)
  const outlineColor = new THREE.Color(color)
  const { gl, scene: r3fScene } = useThree()
  const effectRef = useRef()
  // Collect meshes

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
  // Floating animation
  useFrame(() => {
    if (!ref.current) return
    const t = performance.now() * 0.001
    ref.current.position.y = Math.cos(t) * 0.02
  })

  return <primitive ref={ref} object={scene} scale={props.scale || 1} position={props.position || [0,0,0]} />
})

function LoadModel(props, ref) {
  return <LoadingModel ref={ref} {...props} />
}



export default LoadModel */