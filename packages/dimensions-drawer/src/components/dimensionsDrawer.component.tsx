import React, { Fragment } from "react";
import { useAvailabilityDimensionsWithValues } from "../hooks/useAvailabilityDimensionsValues";

export const DimensionsDrawer = () => {
  const { dimensions, isLoading, error } =
    useAvailabilityDimensionsWithValues();

  console.log({ dimensions, error });
  return (
    <div className="h-96 w-screen bg-white text-black">
      <h1>Container2244 </h1>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};
