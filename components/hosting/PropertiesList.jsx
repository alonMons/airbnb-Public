import React from "react";
import Image from "next/image";
import { isEqual } from "lodash";

function PropertiesList({ property, setProperty, items }) {
  return (
    <ul className="flex flex-col py-5 items-center md:h-screen overflow-y-scroll scrollbar-hide mb-20">
      {Array.isArray(items) &&
        items?.map((item) => (
          <li
            key={item?.name}
            onClick={() => setProperty(item)}
            className={`property-type w-[80%] font-[400] md:w-1/2 py-3 ${
              isEqual(item, property) &&
              "outline-[3px] outline-slate-900 bg-[#f7f7f7]"
            }`}
          >
            {item?.title}
            <div className="property-image">
              <Image src={item?.img} layout="fill" className="rounded-md" />
            </div>
          </li>
        ))}
    </ul>
  );
}

export default PropertiesList;
