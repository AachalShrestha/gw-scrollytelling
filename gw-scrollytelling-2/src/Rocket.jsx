import LoadModel from "./LoadModel"

export default function Rocket(props, ref) {
    const { position, scale, rotation, model, color } = props

  return <loadModel
    position={position}
    scale={scale}
    rotation={rotation}
    model={model}
    color={color}
  />
}