import gsap from "gsap" 
import "./Arrows.css"
import { forwardRef, useEffect, useRef, useState } from "react";


const ArrowButtons = forwardRef(function ArrowButtons(
  { setSpeed, ...props },
  ref
){
  const containerRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  const NORMAL_SPEED = 0.2;
  const BOOSTED_SPEED = 0.7;  
  useEffect(() => {
    // set base opacity for all arrows
    gsap.set(".arrow", { opacity: 0.3 });

    // animate only active arrows
    gsap.to(".arrow-activ e", {
      opacity: 1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div
      className="arrowButtons-container"
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
    >
      <div className="arrowUp arrow-active arrow">Z</div>

      <div className="arrowButtons-bottomRow">
        <div className="arrowDown arrow arrow-inactive">X</div>
        <div className="arrowLeft arrow-active arrow">Q</div>
        <div className="arrowRight arrow arrow-inactive">D</div>
      </div>
      <div className="speed-button">
      <button
          className={isPressed ? "pressed" : ""}
          onMouseDown={() => { setSpeed(BOOSTED_SPEED); setIsPressed(true); }}
          onMouseUp={() => { setSpeed(NORMAL_SPEED); setIsPressed(false); }}
          
        >
          SPEED UP
        </button>
        </div>
    </div>
  );
});

export default ArrowButtons;
