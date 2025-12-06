import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { Html, Edges, FirstPersonControls, GizmoHelper, GizmoViewcube, GizmoViewport,  OrbitControls, Outlines, KeyboardControls} from '@react-three/drei'
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import * as THREE from 'three'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import CharacterController from './CharacterController'
import DistanceCount from './DistanceCount'
import spaceDataJSON from "./assets/spaceData.json";

import LoadModel from './LoadModel'
import Rocket from './Rocket'
import CustomStars from './Start'

extend({ OutlineEffect })
gsap.registerPlugin(ScrollTrigger)



const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
]


export default function App() {
  const copy1 = useRef()
  const copy2 = useRef()
  const copy3 = useRef()
  const copy4 = useRef()
  const html = useRef() 
  const earthRef = useRef()
  const rocketRef = useRef()
  const planetRef = useRef()
  const planetRefs = useRef([]);
  const DISTANCE_SCALE = 50; 
  const [realDistanceTravelled, setRealDistance] = useState(0);
  const ANGLE_FACTOR = -0.5; 
  const followCamera = useRef(false)
  const planetAmount = 10;
  
  const distanceScale= 100;
  const [speed, setSpeed] = useState(0.2);
  const NORMAL_SPEED = 0.1;
  const BOOSTED_SPEED = 0.5;  
  const [spaceData, setSpaceData] = useState(spaceDataJSON)

 const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 5,
    },
  });
useEffect(() => {
  const checkRef = setInterval(() => {
    if (
      !earthRef.current ||
      !copy1.current ||
      !copy2.current ||
      !copy3.current
    ) return;
    
    clearInterval(checkRef);

/*     fetch(spaceData)
      .then((res) => res.json())
      .then((json) => setSpaceData(json));
    
 */
    // Initial states
    gsap.set(copy1.current, { y: 50 });
    gsap.set(copy2.current, { opacity: 0, y: -50 });
    gsap.set(copy3.current, { opacity: 0, y: -50 });
    gsap.set(copy4.current, { opacity: 0});
    gsap.set(
      planetRefs.current.map(p => p.position),
      { y: 100 }
    );
    gsap.set(
      planetRefs.current.map(p => p.children[0]),
      { opacity: 0 }
    );
    gsap.set(rocketRef.current.position, { opacity: 1, y: -10, x: -1.5, z:-1 });

    // Timeline
    tl.to(earthRef.current.position, { z: 3, y: -1.5, duration: 1, ease: 'none' });
    tl.to(earthRef.current.rotation, { y: THREE.MathUtils.degToRad(70), duration: 1, ease: 'none' });
    tl.to(copy1.current, { opacity: 0, y: 10, duration: 2, ease: 'none' });
    tl.to(copy2.current, { opacity: 1, y: -200, duration: 2, ease: 'none' });
    tl.to(copy2.current, { opacity: 0, y: 10, duration: 2, ease: 'none' });
    tl.to(copy3.current, { opacity: 1, y: -300, duration: 2, ease: 'none' });
tl.to(earthRef.current.position, { x: -1.2, duration: 2, ease: 'none' })
  tl.to(copy3.current, { opacity: 0, y: -50, duration: 2, ease: 'none' });
  tl.to(copy4.current, { opacity: 1, duration: 2, ease: 'none' })
  tl.to(html.current, { opacity: 0, duration: 1, ease: 'none' })
  .to(
    rocketRef.current.position,
    { y: 0.4, duration: 2, ease: 'none',
      onStart: () => (followCamera.current = false),
      onReverseComplete: () => (followCamera.current = false),
      onComplete: () => {(followCamera.current = true)}
    },
    "<"
  )
  
  tl.to(
  planetRefs.current.map((p) => p.position),
  { y: 0, duration: 1, ease: "none", stagger: 0.3 }
)
  });

  return () => clearInterval(checkRef);
}, []);


 
  return (
    <>
      {/* FIXED CANVAS */}l
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      >

        <DistanceCount distanceFromEarth={realDistanceTravelled} scale={distanceScale}/>
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 5], fov: 75 }}>
          
          <KeyboardControls map={keyboardMap}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[1, 5, 1]} intensity={1} />
          {/* <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />  */}
          <Html
           transform
            position={[0, 1, -10]}
            scale={2}
            wrapperClass="htmlWrapper"
            ref={html}
            style={{ pointerEvents: "none" }}
          >
            <div className="copy1" ref={copy1}>
              <h1>FIRST DETECTED <br />GRAVITATIONAL <br />WAVE </h1> 
            </div>
            <div className="copy2" ref={copy2}>
              In 2015 LIGO detected the first ever gravitational wave
            </div>
            <div className="copy3" ref={copy3}>
              The source of the first ever detected gravitational wave was a pair of merging black holes about 
              <h1>1.3 billion light-years</h1>
              away from Earth.
            </div>
            <div className="copy4" ref={copy4}>
              Press Z and S to move the rocket forward and backward
            </div>
          </Html>

          {/* <Box position={[0, 0, 0]} /> */}
    
         <group ref={earthRef}> 
            <LoadModel position={[0, 0, 0]} scale={0.2} model="earth" color="#0E5173" />
        </group>
        
{spaceData.map((item, i) => {
   // adjust for scene
  const distance = -Math.log10(item.distance_from_earth_ly + 1) * distanceScale;
  const x = distance * ANGLE_FACTOR;
  const z = distance;

  return (
    <group
      key={item.name}
      position={[x, 0, z]}
      ref={(el) => (planetRefs.current[i] = el)}
    >
      <Html
        position={[0, 2, 0]}
        center
        style={{ color: 'white', fontSize: '16px', pointerEvents: 'none' }}
      >
        {item.screen_name}
      </Html>
      <LoadModel
        position={[0, 0, 0]}
        scale={2}
        model={item.fake_name}
        color="#860f0fff"
      />
    </group>
  );
})}
              
      
   <group ref={rocketRef}>
    <CharacterController
      followCamera={followCamera}
      anglefactor={ANGLE_FACTOR}
      setRealDistance={setRealDistance}
      speed={speed}
    />
  </group>
          <CustomStars count={2000} radius={100} />
          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport />
          </GizmoHelper>
          </KeyboardControls>
        </Canvas>
        

      </div>

      {/* SCROLL AREA */}
      <div
        id="scroll-container"
        style={{
          height: "1000vh",
          position: "relative",
          zIndex: 0,
        }}
      >
        <div className="speed-button"><button
  onClick={() => {setSpeed(BOOSTED_SPEED); console.log("Speed boosted");}}
  onKeyUp={() => setSpeed(NORMAL_SPEED)}
  onMouseDown={() => {setSpeed(BOOSTED_SPEED); console.log("Speed boosted onmousedown");}}
  onMouseUp={() => setSpeed(NORMAL_SPEED)}
>
  SPEED UP
</button></div>
      </div>
    </>
  )
}




