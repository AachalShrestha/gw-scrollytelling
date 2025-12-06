import { useRef, useEffect } from "react"
import LoadModel from "./LoadModel"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useKeyboardControls } from "@react-three/drei"

export default function CharacterController({ followCamera, anglefactor, setRealDistance, speed }) {
 /*  const { NORMAL_SPEED, BOOSTED_SPEED } = { NORMAL_SPEED: 0.3, BOOSTED_SPEED: 0.2 } */
  const character = useRef()
  const rocketRef = useRef()
  const group = useRef()
const distanceTraveled = useRef(0);
  const initialCameraPos = useRef(new THREE.Vector3())
  const offset = useRef(new THREE.Vector3()) // offset between camera and rocket
  useEffect(() => {
    const targetPosition = new THREE.Vector3()
    if (rocketRef.current) {
      targetPosition.copy(rocketRef.current.position)
      targetPosition.y += 2 // adjust height as needed
    }
  })
  
   const [, get] = useKeyboardControls();
  useFrame(({ camera }) => {
    // Save initial camera position once
    
    if(group.current){
     

      const movement = {
        z: 0,
      }

        if (get().forward) {
            movement.z = -1;
        }

         if (get().backward) {
            movement.z = 1;
        }
    
    if (!initialCameraPos.current.length()) {
      initialCameraPos.current.copy(camera.position)
    }

    if (!followCamera.current) {
      // Return camera to original position (smoothly)
      camera.position.lerp(initialCameraPos.current, 0.1)
      camera.lookAt(rocketRef.current?.position || new THREE.Vector3())
      return
    }

    // Start follow: calculate offset once
    if (!offset.current.length() && rocketRef.current) {
      offset.current.subVectors(camera.position, rocketRef.current.position)
    }

    if (rocketRef.current) {
      // Keep the camera at the same offset from the rocket
      camera.position.copy(rocketRef.current.position).add(offset.current)
      camera.lookAt(rocketRef.current.position)
    }

  if (followCamera.current) {

    camera.position.y = rocketRef.current.position.y - 0.5;

    // ACCUMULATE distance
    distanceTraveled.current += movement.z * speed;
    const newDistance = distanceTraveled.current;

    // Move the rocket
    rocketRef.current.position.z = newDistance;
    rocketRef.current.position.x = newDistance * anglefactor;

    // Convert back from log to real distance
    const real = Math.pow(10, newDistance / -100) - 1;
    setRealDistance(real);
  }
    
}
  })

  return (
    <group ref={group}>
        <group ref={character}>
        <LoadModel
            ref={rocketRef}
            position={[0, 0, 0]}
            scale={0.1}
            rotation={[Math.PI / 2, 0, 0]}
            model="rocket2"
            color="#0E5173"
        />
        </group>
    </group>
  )
}
