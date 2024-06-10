import React, { useContext } from "react";
import { TypeContext } from "../../pages/become-a-host/[type]";

function Description() {
  const { description, setDescription } = useContext(TypeContext);

  return (
    <div className="md:absolute md:top-1/2 md:left-1/2 md:translate-x-[-50%] md:translate-y-[-50%] m-10 h-80 mx-auto w-[80%] md:w-3/4">
      <h1 className="text-slate-900 font-[400] text-2xl pb-5">
        Create your description
      </h1>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        maxLength={500}
        className="w-full outline-none border max-h-44 md:max-h-80 rounded-md p-6 h-40 text-[18px] text-slate-900 font-[200]"
      />
      <span className="font-[400] text-sm text-gray-600 pt-1">
        {description?.length}/500
      </span>
    </div>
  );
}

export default Description;
