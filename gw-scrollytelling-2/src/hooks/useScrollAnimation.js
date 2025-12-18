// src/hooks/useScrollAnimation.js
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimation({
  copyRefs,
  earthRef,
  rocketRef,
  planetRefs,
  distanceCounterRef,
  followCamera
}) {
  const planetMaterials = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: '+=6000', // ⬅️ IMPORTANT
        scrub: 5,
      },
    });

    const checkRef = setInterval(() => {
      if (
        !earthRef.current ||
        !copyRefs.every(r => r?.current) ||
        !planetRefs.current.length
      ) return;

      clearInterval(checkRef);

      // -------------------------
      // Collect planet materials
      // -------------------------
      planetMaterials.current = [];
      planetRefs.current.forEach(planet => {
        planet.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = 0;
            planetMaterials.current.push(child.material);
          }
        });
      });

      // -------------------------
      // Initial states
      // -------------------------
      gsap.set(distanceCounterRef.current, { opacity: 0, y: -1 });
      gsap.set(earthRef.current.position, { y: 0, z: 1 });
      gsap.set(copyRefs[0].current, { y: 140 });
      gsap.set(copyRefs[1].current, { opacity: 0, y: -50 });
      gsap.set(copyRefs[2].current, { opacity: 0, y: -50 });
      gsap.set(copyRefs[3].current, { opacity: 0, y: -350 });
      gsap.set(copyRefs[4].current, { opacity: 0, y: -380 });

      gsap.set(
        planetRefs.current.map(p => p.position),
        { y: 100 }
      );

      gsap.set(rocketRef.current.position, {
        y: -10,
        x: -1.5,
        z: 0
      });

      // -------------------------
      // Timeline
      // -------------------------
      tl.to(earthRef.current.position, { z: 3, y: -1.5, end: '+=4000'  })
        .to(copyRefs[0].current, { opacity: 0, y: 10 })
        .to(copyRefs[1].current, { opacity: 1, y: -150 })
        .to(earthRef.current.rotation, {
          y: THREE.MathUtils.degToRad(70),
        })
        .to(copyRefs[1].current, { opacity: 0, y: 10 })
        .to(copyRefs[2].current, { opacity: 1, y: -150 })
        .to(earthRef.current.position, { x: -1.2 })
        .to(copyRefs[2].current, { opacity: 0 })
        .to(copyRefs[3].current, { opacity: 1 })

        .to(
          rocketRef.current.position,
          {
            y: 0.4,
            onStart: () => (followCamera.current = false),
            onReverseComplete: () => (followCamera.current = false),
            onComplete: () => (followCamera.current = true),
          },
          "<"
        )

        .to(distanceCounterRef.current, { opacity: 1, y: 0 })

        .to(
          planetRefs.current.map(p => p.position),
          { y: 0, stagger: 0.3 }
        )

        .to(copyRefs[3].current, { opacity: 0, end: '+=4000'  })
        .to(copyRefs[4].current, { opacity: 1, })

        .to(planetMaterials.current, {
          opacity: 1,
          stagger: 0.2
        });
    }, 50);

    return () => {
      clearInterval(checkRef);
      tl.kill();
    };
  }, []);
}
