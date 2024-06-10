import React, { useContext, useState } from "react";
import { TypeContext } from "../../pages/become-a-host/[type]";
import FloorPlanList from "./FloorPlanList";

function FloorPlan() {
  const {
    guests,
    setGuests,
    beds,
    setBeds,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
  } = useContext(TypeContext);

  const items = [
    { title: "Guests", data: guests, setData: setGuests },
    { title: "Beds", data: beds, setData: setBeds },
    { title: "Bedrooms", data: bedrooms, setData: setBedrooms },
    { title: "Bathrooms", data: bathrooms, setData: setBathrooms },
  ];

  return (
    <div className="flex justify-center md:items-center w-full select-none overflow-y-visible h-[23rem] md:h-3/4">
      <FloorPlanList items={items} />
    </div>
  );
}

export default FloorPlan;
