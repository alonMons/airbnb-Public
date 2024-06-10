import React, { createContext, useContext, useState } from "react";
import { TypeContext } from "../../pages/become-a-host/[type]";
import AmenitiesItems from "./AmenitiesItems";

export const AmenitiesContext = createContext([]);

function Amenities() {
  const { amenities, setAmenities } = useContext(TypeContext);

  return (
    <AmenitiesContext.Provider
      value={{ items: amenities, setItems: setAmenities }}
    >
      <AmenitiesItems />
    </AmenitiesContext.Provider>
  );
}

export default Amenities;
