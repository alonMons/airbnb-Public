import React, { useState, useEffect, useContext } from "react";
import { TypeContext } from "../../pages/become-a-host/[type]";
import { db } from "../../services/firebase";
import PropertyTypeList from "./PropertyTypeList";

function PropertyType() {
  const { propertyType, setPropertyType } = useContext(TypeContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.collection("hosting")
      .doc("property-type")
      .get()
      .then((doc) => {
        setItems(doc.data()?.items);
      });
  }, []);

  return (
    <div>
      <PropertyTypeList
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        items={items}
      />
    </div>
  );
}

export default PropertyType;
