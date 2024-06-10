import React, { useState, useEffect } from "react";
import { storage } from "../services/firebase";

function RoomsAmenetie({ title }) {
  const [image, setImage] = useState("");

  useEffect(() => {
    storage
      .ref("amenities")
      .child(`${title}.png`)
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      });
  }, [title]);

  return (
    <div className="flex space-x-5 items-center">
      <img src={image} className="h-8" />
      <p className="text-[16px] font-[300] text-slate-900">{title}</p>
    </div>
  );
}

export default RoomsAmenetie;
