import { useRef, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function LoadModel2({
  model,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  animated = false,
  float = true,
  ...props
}) {
  const group = useRef()

  // Load model ONCE
  const { scene, animations } = useGLTF(`/${model}.glb`)

  // Animations
  const { actions } = useAnimations(animations, group)

  // ▶️ Play animations
  useEffect(() => {
    if (!animated || !actions) return

    Object.values(actions).forEach((action) => {
      action.reset().play()
    })

    return () => {
      Object.values(actions).forEach((action) => action.stop())
    }
  }, [animated, actions])

  // ▶️ Rotation
  useEffect(() => {
    if (!group.current) return

    group.current.rotation.set(
      THREE.MathUtils.degToRad(rotation[0]),
      THREE.MathUtils.degToRad(rotation[1]),
      THREE.MathUtils.degToRad(rotation[2])
    )
  }, [rotation])

  // ▶️ Floating
  useFrame(() => {
    if (!float || !group.current) return
    group.current.position.y =
      position[1] + Math.cos(performance.now() * 0.001) * 0.04
  })

  return (
    <primitive
      ref={group}
      object={scene}
      position={position}
      scale={scale}
      {...props}
    />
  )
}
