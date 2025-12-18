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
import SpaceComponents from './SpaceComponents'
import useScrollAnimation from './hooks/useScrollAnimation'
import Copy from './Copy'
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
  const copy5 = useRef()
  const html = useRef() 
  const earthRef = useRef()
  const rocketRef = useRef()
  const planetRef = useRef()
  const planetRefs = useRef([]);
  const [reachedPlanet, setReachedPLanet] = useState();
  const distanceCounterRef = useRef();
  const [localDistanceTravelled, setLocalDistance] = useState(0);
  const [realDistanceTravelled, setRealDistance] = useState(0);
  const ANGLE_FACTOR = -0.5; 
  const followCamera = useRef(false)
  
  
  const distanceScale= 100;
  const [speed, setSpeed] = useState(0.2);
  const NORMAL_SPEED = 0.05;
  const BOOSTED_SPEED = 0.6;  
  const [spaceData, setSpaceData] = useState(spaceDataJSON)

  const [isPressed, setIsPressed] = useState(false);

 const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 5,
    },
  });
  useScrollAnimation({
    copyRefs: [copy1, copy2, copy3, copy4, copy5],
    earthRef,
    rocketRef,
    planetRefs,
    distanceCounterRef,
    tl,
    followCamera
  });

  
useEffect(() => {
  // This runs every time realDistanceTravelled changes
  if (spaceData.some(e => 
    e.distance_from_earth_ly > realDistanceTravelled - 0.2 &&
    e.distance_from_earth_ly < realDistanceTravelled + 0.2
  )) {
    // find the matching element(s)
    const matched = spaceData.find(e => 
      e.distance_from_earth_ly > realDistanceTravelled - 0.2 &&
      e.distance_from_earth_ly < realDistanceTravelled + 0.2
    );
    console.log("Reached:", matched.name);
    /* setReachedPLanet(matched.name) */

  } else {
    console.log("nothing reached");
  }
}, [realDistanceTravelled]);


 
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
        className='all-wrapper'
      >
      

{/*         <div className='copy'>
            <div className="copy1 font-big" ref={copy1}>
              <h1>FIRST DETECTED <br />GRAVITATIONAL <br />WAVE </h1> 
            </div>
            <div className="copy2" ref={copy2}>
              In 2015 LIGO detected the first ever gravitational wave
            </div>
            <div className="copy3" ref={copy3}>
              <p>The source of the first ever detected gravitational wave was a pair of merging black holes about </p>
              <h1 className='copy3 font-big'>1.3 billion light-years</h1>
              <p>away from Earth.</p>
            </div>
            <div className="copy4" ref={copy4}>
              Let’s travel to the source of the first gravitational wave.
            </div>
        </div> */}
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
            <div className="copy1 font-big" ref={copy1}>
              <h1>FIRST DETECTED <br />GRAVITATIONAL <br />WAVE </h1> 
            </div>
            <div className="copy2" ref={copy2}>
              In 2015 LIGO detected the first ever gravitational wave
            </div>
            <div className="copy3" ref={copy3}>
              <p>The source of the first ever detected gravitational wave was a pair of merging black holes about </p>
              <h1 className='copy3 font-big'>1.3 billion light-years</h1>
              <p>away from Earth.</p>
            </div>
            <div className="copy4" ref={copy4}>
              <p>But how far is that really?</p>
            </div>
            <div className="copy5" ref={copy5}>
              <p>Let’s travel to the source of the first gravitational wave!</p>
            </div>


           {/*  <div className='reachedPlanetContainer'>
              <h1>Reached {reachedPlanet}</h1>
            </div> */}
          </Html>

          {/* <Box position={[0, 0, 0]} /> */}
    
         <group ref={earthRef}> 
            <LoadModel position={[0, 0, 0]} scale={0.2} model="earth" color="#0E5173" />
        </group>
        
    <SpaceComponents
    data={spaceData}
    planetRefs={planetRefs}
    distanceScale={distanceScale}
    ANGLE_FACTOR={ANGLE_FACTOR}
    />
              
      
   <group ref={rocketRef}>
    <CharacterController
      followCamera={followCamera}
      anglefactor={ANGLE_FACTOR}
      setRealDistance={setRealDistance}
      setLocalDistance={setLocalDistance}
      speed={speed}
      distanceScale={distanceScale}
    />
    </group>
       <CustomStars count={800} radius={70} />
       <CustomStars count={1000} radius={200} />
       <CustomStars count={3000} radius={400}/>
       <CustomStars count={4000} radius={1500}/>{/*    
          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />s
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport />
          </GizmoHelper> */}
          </KeyboardControls>
        </Canvas>

         {/* FIXED UI OVERLAY */}
  <div className="ui-layer">
    <div className="speed-button">
      <button
        className={isPressed ? "pressed" : ""}
        onMouseDown={() => { setSpeed(BOOSTED_SPEED); setIsPressed(true); }}
        onMouseUp={() => { setSpeed(NORMAL_SPEED); setIsPressed(false); }}
        
      >
        SPEED UP
      </button>
    </div>

    {/* <DistanceCount distanceFromEarth={realDistanceTravelled} />
    <Copy distanceTraveled={realDistanceTravelled} /> */}
  </div>

        
    {/* FIXED UI OVERLAY */}

    </div>

    <div className="ui-layer">
     <div className="speed-button">
      <button
        className={isPressed ? "pressed" : ""}
        onMouseDown={() => { setSpeed(BOOSTED_SPEED); setIsPressed(true); }}
        onMouseUp={() => { setSpeed(NORMAL_SPEED); setIsPressed(false); }}
        
      >
        SPEED UP
      </button>
    </div>

      <DistanceCount distanceFromEarth={realDistanceTravelled} ref={distanceCounterRef}/>
      <Copy distanceTraveled={localDistanceTravelled} />
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
  
      </div>
    </>
  )
}




