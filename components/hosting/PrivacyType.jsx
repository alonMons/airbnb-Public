import React, { useState, useEffect, useContext } from "react";
import { TypeContext } from "../../pages/become-a-host/[type]";
import { db } from "../../services/firebase";
import PrivacyTypeList from "./PrivacyTypeList";
import PropertyTypeList from "./PropertyTypeList";

function PrivacyType() {
  const { privacyType, setPrivacyType } = useContext(TypeContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.collection("hosting")
      .doc("privacy-type")
      .get()
      .then((doc) => {
        setItems(doc.data()?.items);
      });
  }, []);

  return (
    <PrivacyTypeList
      privacyType={privacyType}
      setPrivacyType={setPrivacyType}
      items={items}
    />
  );
}

export default PrivacyType;
