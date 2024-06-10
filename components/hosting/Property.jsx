import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import PropertiesList from "./PropertiesList";
import { db } from "../../services/firebase";
import { TypeContext } from "../../pages/become-a-host/[type]";

function Property() {
  const { property, setProperty } = useContext(TypeContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.collection("hosting")
      .doc("property-type-group")
      .get()
      .then((doc) => {
        setItems(doc.data().items);
      });
  }, []);

  return (
    <div>
      <PropertiesList
        property={property}
        setProperty={setProperty}
        items={items}
      />
    </div>
  );
}

export default Property;
