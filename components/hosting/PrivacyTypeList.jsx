import React from "react";
import { isEqual } from "lodash";

function PrivacyTypeList({ privacyType, setPrivacyType, items }) {
  return (
    <div className="flex justify-center items-center w-full h-[26rem] pb-[6rem] md:h-3/4">
      <ul className="flex flex-col items-center w-full">
        {Array.isArray(items) &&
          items?.map((item) => (
            <li
              key={item.title}
              onClick={() => setPrivacyType(item)}
              className={`property-type w-[80%] md:w-1/2 font-[400] ${
                isEqual(item, privacyType) &&
                "outline-[3px] outline-slate-900 bg-[#f7f7f7]"
              }`}
            >
              <p className="text-md">{item.title}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default PrivacyTypeList;
