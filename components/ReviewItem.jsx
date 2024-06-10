import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { UserCircleIcon } from "@heroicons/react/solid";
import { capitalize, truncate } from "lodash";
import Link from "next/link";

export default function ReviewItem({ review }) {
  const [user, setUser] = useState();

  useEffect(() => {
    db.collection("users")
      .doc(review.byUser)
      .get()
      .then((item) => {
        setUser(item.data());
      });
  }, []);

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex space-x-3 items-center">
        <Link
          href={{
            pathname: "/users/show",
            query: {
              shownUserId: user?.id,
            },
          }}
        >
          <a target="_blank">
            <img
              className="rounded-full h-[2.83rem] w-[2.83rem] object-cover"
              src={user?.avatar}
              alt=""
            />
          </a>
        </Link>
        <div className="flex flex-col">
          <span className="text-slate-900 font-[400] text-[17px]">
            {truncate(capitalize(user?.name).split(" ")[0], 12)}
          </span>
          <span className="text-gray-600 font-[100] text-sm">
            {review?.date}
          </span>
        </div>
      </div>
      <div className="font-[350]">
        {truncate(review?.review, { length: 115 })}
      </div>
    </div>
  );
}
