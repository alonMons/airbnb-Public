import { isEqual } from "lodash";
import React from "react";

function PropertyTypeList({ propertyType, setPropertyType, items }) {
  return (
    <ul className="flex flex-col py-5 items-center md:h-screen overflow-y-scroll scrollbar-hide pb-24">
      {Array.isArray(items) &&
        items?.map((item) => (
          <li
            key={item.title}
            onClick={() => setPropertyType(item)}
            className={`property-type w-[80%] md:w-1/2 flex-col items-start font-[400] ${
              isEqual(item, propertyType) &&
              "outline-[3px] outline-slate-900 bg-[#f7f7f7]"
            }`}
          >
            <p className="text-md">{item.title}</p>
            <p className="text-gray-500 text-sm font-[350]">{item.des}</p>
          </li>
        ))}
    </ul>
  );
}

export default PropertyTypeList;
