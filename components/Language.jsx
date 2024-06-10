import { Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function Language({
  language,
  filteredLanguages,
  spokenLanguages,
  setSpokenLanguages,
}) {
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (spokenLanguages) {
      setIndex(spokenLanguages.indexOf(language));
    } else setIndex(-1);
  }, [spokenLanguages, filteredLanguages, language]);

  const handleChange = (sign) => {
    if (sign == true) {
      const spokenLanguages1 = spokenLanguages ? [...spokenLanguages] : [];
      spokenLanguages1.push(language);
      setSpokenLanguages(spokenLanguages1);
    } else {
      const spokenLanguages1 = [...spokenLanguages];
      spokenLanguages1.splice(index, 1);
      setSpokenLanguages(spokenLanguages1);
    }
  };

  return (
    <div
      className="py-6 items-center px-1 flex justify-between border-b
       w-full"
    >
      {language}
      <input
        type="checkbox"
        className="h-6 w-6 checked:accent-[#222222]"
        checked={index != -1}
        onChange={(e) => handleChange(e.target.checked)}
      />
    </div>
  );
}
