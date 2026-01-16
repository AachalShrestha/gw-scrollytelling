import { Canvas, useFrame, useThree, extend, useLoader } from '@react-three/fiber'
import { Html, Edges, FirstPersonControls, GizmoHelper, GizmoViewcube, GizmoViewport,  OrbitControls, Outlines, KeyboardControls} from '@react-three/drei'
import React, { useRef, useLayoutEffect, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import * as THREE from 'three'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import { EffectComposer, Outline, Noise, ColorDepth, DotScreen, Pixelation } from '@react-three/postprocessing'
import CharacterController from './CharacterController'
import DistanceCount from './DistanceCount'
import spaceDataJSON from "./assets/spaceData.json";

import LoadModel from './LoadModel'
import Rocket from './Rocket'
import CustomStars from './Start'
import SpaceComponents from './SpaceComponents'
import useScrollAnimation from './hooks/useScrollAnimation'
import Grid from './Grid'
import Copy from './Copy'
import ArrowButtons from './ArrowButtons'
import { AsciiEffect } from 'three/examples/jsm/Addons.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { color } from 'three/tsl'
extend({ OutlineEffect })
gsap.registerPlugin(ScrollTrigger)



const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'speedUp', keys: ['Space'] }
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
  const arrowButtonsRef = useRef();



  const [startAnimDoneState, setStartAnimDoneState] = useState(false);
  const reachedPlanetCopyRef = useRef(false);
  const [reachedPlanet, setReachedPlanet] = useState({ name: '', description: '' });
  const distanceCounterRef = useRef();
  const [localDistanceTravelled, setLocalDistance] = useState(0);
  const [realDistanceTravelled, setRealDistance] = useState(0);
  const ANGLE_FACTOR = -0.5; 
  const followCamera = useRef(false)
  


  const distanceScale= 100;
  const [speed, setSpeed] = useState(0.2);
  const NORMAL_SPEED = 0.2;
  const BOOSTED_SPEED = 0.7;  
  const [spaceData, setSpaceData] = useState(spaceDataJSON)

  const [isPressed, setIsPressed] = useState(false);



/*  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 5,
    },
  }); */
  useScrollAnimation({
    copyRefs: [copy1, copy2, copy3, copy4, copy5],
    earthRef,
    rocketRef,
    planetRefs,
    arrowButtonsRef,
    distanceCounterRef,
    followCamera,
    setStartAnimDoneState
  });

  
useEffect(() => {
  let found = null;

  for (const planet of spaceData) {
    const d = planet.distance_from_earth_ly;
    const approachWindow = d * 0.5;
    const reachedWindow = d * 0.1;

    if (
      realDistanceTravelled > d - approachWindow &&
      realDistanceTravelled < d + reachedWindow
    ) {
      found = planet;
      break;
    }
  }

  if (found) {
    setReachedPlanet({
      name: found.screen_name,
      description: found.description,
    });

    gsap.to(reachedPlanetCopyRef.current, { opacity: 1, duration: 0.3 });
  } else {
    gsap.to(reachedPlanetCopyRef.current, { opacity: 0, duration: 0.3 });
    setReachedPlanet({ name: "", description: "" });
  }
}, [realDistanceTravelled, spaceData]);

//SPACE BAR PRESS HANDLER
 useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      setSpeed(BOOSTED_SPEED);
      setIsPressed(true);
    }
  };

  const handleKeyUp = (e) => {
    if (e.code === "Space") {
      setSpeed(NORMAL_SPEED);
      setIsPressed(false);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}, []);
const gltf = useLoader(GLTFLoader, '/gw-holes.glb')

  return (
    <>
      {/* FIXED CANVAS */}
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
       <div className='start-copy-container'>
            <div className="copy1 font-big" ref={copy1}>
              <h1>FIRST DETECTED <br />GRAVITATIONAL <br />WAVE </h1> 
            </div>
            <div className="copy2" ref={copy2}>
              <p>
                In 2015{" "}
                <span style={{ color: "#FF00C2" }}>LIGO</span>{" "}
                detected the first ever gravitational wave
              </p>
            </div>

            <div className="copy3" ref={copy3}>
              <p>The source of the first ever detected gravitational wave was a pair of merging black holes about </p>
              <h1 className='copy3 font-medium'>1.3 billion light-years</h1>
              <p>away from Earth.</p>
            </div>
            <div className="copy4" ref={copy4}>
              <p>But how far is that really?</p>
            </div>
            <div className="copy5" ref={copy5}>
              <p>Let’s travel to the source of the first gravitational wave!</p>
            </div>
      </div>
      {/******put in canvas for ascii effect******* */}
    {/*   gl={(defaultprops) => {
          const renderer = new THREE.WebGLRenderer({ ...defaultprops, antialias: true });
          const effect = new AsciiEffect(renderer,  undefined, { color: true}, {resolution: 0.15} );
          renderer.domElement.style.display = 'none';
          renderer.domElement.parentElement.append(effect.domElement);
          return { ...renderer, render: effect.render, setSize: effect.setSize};
          }}
 */}
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ toneMapping: THREE.ACESFilmicToneMapping, outputEncoding: THREE.sRGBEncoding }}>
          
          <KeyboardControls map={keyboardMap}>
          <ambientLight intensity={1} />
          <directionalLight position={[1, 5, 2]} intensity={1} />

         <group ref={earthRef}> 
            <LoadModel position={[0, 0, 0]} scale={0.22} model="earth3" color="#0E5173" />
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
      copyRef={copy5}
      startAnimDone={startAnimDoneState}
    />
    </group>
       <CustomStars count={800} radius={70} />
       <CustomStars count={1000} radius={200} />
       <CustomStars count={3000} radius={400}/>
       <CustomStars count={4000} radius={1500}/>
       </KeyboardControls>

    <primitive object={gltf.scene} />

         {/* postprocessing */}
    <EffectComposer>
      <ColorDepth bits={9} />
      <Noise opacity={0.07} />
      <DotScreen
        
        angle={Math.PI * 0.7} // angle of the dot pattern
        scale={1.2} // scale of the dot pattern
      />
      {/* <Pixelation
        granularity={1} // pixel granularity
      /> */}
      <Outlines
                      thickness={3}
                      color={"#ffffff"}
                      angle={0}
                    />
    </EffectComposer>
 </Canvas>

         {/* FIXED UI OVERLAY */}
        
    <div className="ui-layer">
{/*       <div className="speed-button">
        <button
          className={isPressed ? "pressed" : ""}
          onMouseDown={() => { setSpeed(BOOSTED_SPEED); setIsPressed(true); }}
          onMouseUp={() => { setSpeed(NORMAL_SPEED); setIsPressed(false); }}
          
        >
          SPEED UP
        </button>
      </div> */}

    {/* <DistanceCount distanceFromEarth={realDistanceTravelled} />
    <Copy distanceTraveled={realDistanceTravelled} /> */}
  </div>

        
    {/* FIXED UI OVERLAY */}

    </div>

    <div className="ui-layer">
 {/*      <div className="speed-button">
        <button
          className={isPressed ? "pressed" : ""}
          onMouseDown={() => { setSpeed(BOOSTED_SPEED); setIsPressed(true); }}
          onMouseUp={() => { setSpeed(NORMAL_SPEED); setIsPressed(false); }}
          
        >
          SPEED UP
        </button>
        </div> */}

      <ArrowButtons ref={arrowButtonsRef} setSpeed={setSpeed}/>   
      <Copy distanceTraveled={localDistanceTravelled} reachedPlanet={reachedPlanet}   ref={reachedPlanetCopyRef}/>
      <DistanceCount distanceFromEarth={realDistanceTravelled} ref={distanceCounterRef}/>

    {/*   <div className='reachedPlanet'>s
        <h1>Reached {reachedPlanet}</h1>
      </div> */}
     {/*  <Grid /> */}
    </div>
      {/* SCROLL AREA */}
      <div
        id="scroll-container"
        style={{
          height: "900vh",
          position: "relative",
          zIndex: 0,
        }}
      >
        {/* Empty - only for scrolling */}
      </div>
    </>
  )
}




