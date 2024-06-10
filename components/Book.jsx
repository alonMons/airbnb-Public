import React, { useEffect, useState } from "react";
import date from "date-and-time";
import { db } from "../services/firebase";
import { capitalize } from "lodash";

export default function Book({ item }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    db.collection("users")
      .doc(item.byUser)
      .get()
      .then((data) => {
        setUser(data.data());
      });
  }, []);

  return (
    <div key={item.startDate} className="py-2 px-4 border rounded-lg mb-2">
      <h3 className="text-[1.15rem] text-slate-800 inline-block">
        {date.format(new Date(item.startDate), "ddd, MMM D, YYYY")} To{" "}
        {date.format(new Date(item.endDate), "ddd, MMM D, YYYY")}
      </h3>
      <h4>By: {capitalize(user?.name)}</h4>
    </div>
  );
}
