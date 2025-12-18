import React from "react";

import { forwardRef } from "react";
const DistanceCount = forwardRef(({ distanceFromEarth }, ref) => {
  const distance = Math.round(distanceFromEarth);

  return (
    <div className="distance-count" ref={ref}>
      <h2>{distance} Light Years</h2>
      <p>Distance from Earth</p>
    </div>
  );
});


export default DistanceCount;