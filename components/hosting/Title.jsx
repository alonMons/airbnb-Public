import React, { useContext, useState } from "react";
import { TypeContext } from "../../pages/become-a-host/[type]";

function Title() {
  const { title, setTitle, bedrooms, propertyType, sug } =
    useContext(TypeContext);
  const placeholder = `Cheerful ${bedrooms}-bedroom ${propertyType?.title} in ${sug?.terms[1]?.value}`;

  const handleTab = (key) => {
    if (key.key === "Tab") {
      setTitle(placeholder);
    }
  };

  return (
    <div className="md:absolute md:top-1/2 md:left-1/2 md:translate-x-[-50%] m-10 mx-auto h-[23rem] overflow-y-visible md:translate-y-[-50%] w-[80%] md:w-3/4">
      <div className="flex items-center pb-5">
        <h1 className="text-slate-900 font-[400] text-2xl whitespace-nowrap">
          Create your title
        </h1>
        <span className="font-[400] text-xs relative top-[0.2rem] text-gray-600 pt-1 ml-3">
          or click Tab to use the default
        </span>
      </div>
      <textarea
        onKeyDown={handleTab}
        value={title.substring(0, 50)}
        onChange={(e) => setTitle(e.target.value)}
        rows="4"
        maxLength={50}
        placeholder={placeholder}
        className="w-full outline-none border max-h-52 md:max-h-80 rounded-md p-6 h-40 placeholder:text-3xl placeholder:text-gray-600 placeholder:opacity-90 placeholder:font-[400] text-3xl text-slate-900 font-[400]"
      />
      <span className="font-[400] text-sm text-gray-600 pt-1">
        {title.length}/50
      </span>
    </div>
  );
}

export default Title;
