import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";
function AnimatedModel({ url }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);
    useEffect(() => {
    if (!actions || !names.length) return;
      console.log(actions, names);
    actions[names[0]].reset().play(); // play first animation
  }, [actions, names]);
    return <primitive ref={group} object={scene} dispose={null} />; 
}

export default AnimatedModel;