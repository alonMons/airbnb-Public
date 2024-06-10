import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AmenitiesContext } from "./Amenities";
import _ from "lodash";
import { storage } from "../../services/firebase";

function AmenitiesItem({ title }) {
  const { items, setItems } = useContext(AmenitiesContext);
  const [index, setIndex] = useState(-1);
  const [image, setImage] = useState("");

  useEffect(() => {
    setIndex(_.indexOf(items, title));
  }, [items]);

  const handleClick = () => {
    if (index === -1) {
      const items1 = [...items];
      items1.push(title);
      setItems(items1);
    } else {
      const items1 = [...items];
      items1.splice(index, 1);
      setItems(items1);
    }
  };

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
    <div
      onClick={handleClick}
      className={`px-4 py-9 ${
        index !== -1 && "border-2 border-slate-900 bg-[#f7f7f7]"
      } border-2 rounded-lg cursor-pointer grid items-center h-40`}
    >
      <img src={image} className="relative h-9 mx-auto" />
      <p className="text-center font-[400] text-slate-900 mt-1">{title}</p>
    </div>
  );
}

export default AmenitiesItem;
