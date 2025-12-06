import React from "react";
import { useFrame } from "@react-three/fiber";
export default function DistanceCount({distanceFromEarth}) {

  console.log("Distance:", distanceFromEarth);
  const distance = Math.round(distanceFromEarth)

  return (
    <div className="distance-count">
      <h2>{distance} Light Years</h2>
      <p>Distance from Earth</p>
    </div>
  )
}