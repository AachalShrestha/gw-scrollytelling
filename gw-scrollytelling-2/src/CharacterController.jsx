import { useRef, useEffect } from "react"
import LoadModel from "./LoadModel"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useKeyboardControls } from "@react-three/drei"
import gsap from "gsap"

export default function CharacterController({ followCamera, anglefactor, setRealDistance,setLocalDistance, distanceScale,speed, copyRef, startAnimDone }) {
 /*  const { NORMAL_SPEED, BOOSTED_SPEED } = { NORMAL_SPEED: 0.3, BOOSTED_SPEED: 0.2 } */
  const character = useRef()
  const rocketRef = useRef()
  const group = useRef()
  const hasLeftStart = useRef(false);
  const rocketRotation = useRef(new THREE.Euler())
  const distanceTraveled = useRef(0);
  const initialCameraPos = useRef(new THREE.Vector3())
  const initialCameraRotation = useRef()
  const offset = useRef(new THREE.Vector3()) // offset between camera and rocket
  useEffect(() => {

    const targetPosition = new THREE.Vector3()
    if (rocketRef.current) {
      targetPosition.copy(rocketRef.current.position)
      targetPosition.y += 2 // adjust height as needed
    }
  })
  
   const [, get] = useKeyboardControls();
  useEffect(() => {
    if (!copyRef.current) return;
    console.log("hasLeftStart changed:", hasLeftStart.current, startAnimDone);
    if(hasLeftStart.current && startAnimDone){
      console.log("Fading out copyRef");
      gsap.to(copyRef.current, {
      opacity: 0,
      duration: 1,
      });
    }else if(!hasLeftStart.current && startAnimDone){
      console.log("Fading in copyRef");
      gsap.to(copyRef.current,  {
      opacity: 1,
      duration: 1,
      });
    } else if(!hasLeftStart.current && !startAnimDone){
      console.log("Fading in copyRef");
      gsap.to(copyRef.current,  {
      opacity: 0,
      duration: 1,
      });
    } 
      

  }, [hasLeftStart.current, startAnimDone.current]);

  useFrame(({ camera }) => {
    // Save initial camera position once
   
    if(group.current){
     setLocalDistance(-distanceTraveled.current);

     const movement = { z: 0 };
    const rot = rocketRef.current.rotation;

    if (get().forward) {
      movement.z = -1;
      rot.x = THREE.MathUtils.lerp(rot.x, -0.6, 0.1);
      rot.y = THREE.MathUtils.lerp(rot.y, 0.6, 0.1);
      rot.z = THREE.MathUtils.lerp(rot.z, -0.4, 0.1);

      if (!hasLeftStart.current) {
        hasLeftStart.current = true;
        gsap.to(copyRef.current, { opacity: 0, duration: 1 });
      }
    }

    if (get().backward) {
      rot.x = THREE.MathUtils.lerp(rot.x, 0.6, 0.1);
      rot.y = THREE.MathUtils.lerp(rot.y, 0.5, 0.1);
      rot.z = THREE.MathUtils.lerp(rot.z, 0.6, 0.1);

      if (distanceTraveled.current > 0) {
        movement.z = 0;
        /* if (hasLeftStart.current && startAnimDone.current) {
          hasLeftStart.current = false;
          gsap.to(copyRef.current, { opacity: 1, duration: 1 });
        } */
      } else {
        movement.z = 1;
      }
    }



        if (!get().forward && !get().backward) {
            rot.x = THREE.MathUtils.lerp(rot.x, 0, 0.1);
             rot.y = THREE.MathUtils.lerp(rot.y, 0, 0.1);
             rot.z = THREE.MathUtils.lerp(rot.z, 0, 0.1); 
        }
    
    if (!initialCameraPos.current.length()) {
      initialCameraPos.current.copy(camera.position)
      initialCameraRotation
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

    gsap.to(camera.current, {y: - 0.5, duration:1})
    /* camera.position.y = rocketRef.current.position.y - 0.5; */

    // ACCUMULATE distance
    distanceTraveled.current += movement.z * speed;
    const newDistance = distanceTraveled.current;

    // Move the rocket
    rocketRef.current.position.z = newDistance;
    rocketRef.current.position.x = newDistance * anglefactor;

    // Convert back from log to real distance

    const real = Math.pow(10, -newDistance / distanceScale) - 1;
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
            scale={0.01}
          
            model="rocket"
            color="#0E5173"
        />
        </group>
    </group>
  )
}
