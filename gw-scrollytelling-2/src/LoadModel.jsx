import { forwardRef, useEffect, useRef } from "react";
import { useGLTF, useAnimations,  } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Outlines } from "@react-three/drei";

const LoadModel = forwardRef(
  (
    {
      model,
      color,
      scale = 1,
      position = [0, 0, 0],
      rotation,
      emissiveIntensity,
      emissiveColor,
      animated = false,
    },
    ref
  ) => {
    const group = useRef();
    const { scene, animations } = useGLTF(`/${model}.glb`);
    const { actions, names } = useAnimations(animations, group);
    console.log(actions, names, animations);
    // ▶️ PLAY ANIMATION

    useEffect(() => {
      if (!animated || !actions || !names.length) return;

      const action = actions[names[0]];
      if (!action) return;

      action.reset().play();

      return () => action.stop();
    }, [animated, actions, names]);

    // ▶️ ROTATION
    useEffect(() => {
      if (!ref?.current || !rotation) return;

      ref.current.rotation.set(
        THREE.MathUtils.degToRad(rotation[0] || 0),
        THREE.MathUtils.degToRad(rotation[1] || 0),
        THREE.MathUtils.degToRad(rotation[2] || 0)
      );
    }, [rotation]);

    // ▶️ FLOAT
    useFrame(() => {
      if (!ref?.current) return;
      ref.current.position.y = Math.cos(performance.now() * 0.001) * 0.04;
    });

    return (
      <group ref={ref} scale={scale} position={position}>
        {scene.children.map((child) => {
          const meshes = [];
          child.traverse((c) => c.isMesh && meshes.push(c));

          return meshes.map((mesh) => {
            const material = mesh.material.clone();

            material.emissive = emissiveColor
              ? new THREE.Color(emissiveColor)
              : new THREE.Color(0xffffff);

            material.emissiveIntensity =
              model === "earth" ? 0.1 : emissiveIntensity ?? 0.16;

            material.side = THREE.DoubleSide;
            material.needsUpdate = true;

            return (
              <mesh
              key={mesh.uuid}
              geometry={mesh.geometry}
              material={material}
            >
              {color && (
                <Outlines thickness={3} color={0xffffff} angle={0} />
              )}
            </mesh>
            );
          });
        })}
      </group>
    );
  }
);

export default LoadModel;


/* const LoadingModel = forwardRef((props, ref) => {
  const { model, color } = props
  const {scene} = useGLTF(`/${model}.glb`)
  const outlineColor = new THREE.Color(color)
  const { gl, scene: r3fScene } = useThree()
  const effectRef = useRef()
  // Collect meshes

  useEffect(() => {
    // Create OutlineEffect
    effectRef.current = new OutlineEffect(gl, {
      defaultThickness: 0.01,
      defaultColor: outlineColor, // HSL / RGB normalized
      defaultAlpha: 1
    })

    // Set up GLTF meshes
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({
          map: child.material.map || null
        })
        child.userData.outlineParameters = {
          thickness: 0.01,
          color: outlineColor ,
          alpha: 1,
          visible: true
        }
      }
    })

    // Add the GLTF scene to R3F scene
    r3fScene.add(scene)
  }, [gl, r3fScene, scene])
  // Floating animation
  useFrame(() => {
    if (!ref.current) return
    const t = performance.now() * 0.001
    ref.current.position.y = Math.cos(t) * 0.02
  })

  return <primitive ref={ref} object={scene} scale={props.scale || 1} position={props.position || [0,0,0]} />
})

function LoadModel(props, ref) {
  return <LoadingModel ref={ref} {...props} />
}



export default LoadModel */