import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Copy({ distanceTraveled }) {
  const textRefs = useRef([]);

  const texts = [
    { start: 12, end: 40 },
    { start: 40, end: 80 },
    { start: 80, end: 130 },
    { start: 130, end: 190 },
    { start: 190, end: 260 },
  ];

  // initial opacity
  useLayoutEffect(() => {
    textRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0 });
    });
  }, []);

  useEffect(() => {
    textRefs.current.forEach((el, i) => {
      if (!el) return;

      const { start, end } = texts[i];

      if (distanceTraveled >= start && distanceTraveled < end) {
        gsap.to(el, { opacity: 1, duration: 1 });
      } else {
        gsap.to(el, { opacity: 0, duration: 1 });
      }
    });
  }, [distanceTraveled]);

  return (
    <div className="travelCopy">
      <div ref={el => (textRefs.current[0] = el)} className="t-copy t-copy-1">
        <p>All set? <br />It’s a long journey ahead.</p>
      </div>

      <div ref={el => (textRefs.current[1] = el)} className="t-copy t-copy-2">
        <p>While we travel, let’s take a moment to understand…</p>
      </div>

      <div ref={el => (textRefs.current[2] = el)} className="t-copy t-copy-title1">
        <h1>GRAVITATIONAL WAVES</h1>
      </div>

      <div ref={el => (textRefs.current[3] = el)} className="t-copy t-copy-3">
        <p>Gravitational waves are ripples in spacetime created by violent cosmic events</p>
      </div>

      <div ref={el => (textRefs.current[4] = el)} className="t-copy t-copy-4">
        <p>They travel across the universe,<br />carrying information about their origin</p>
      </div>
    </div>
  );
}
