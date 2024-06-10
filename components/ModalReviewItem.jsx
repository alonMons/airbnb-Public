import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import Link from "next/link";
import { capitalize, truncate } from "lodash";

export default function ModalReviewItem({ review }) {
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
    <div className="w-full my-6">
      <header className="flex space-x-3 items-center">
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
          <span className="text-slate-900 font-[500] text-[1.2rem]">
            {truncate(capitalize(user?.name).split(" ")[0], 12)}
          </span>
          <span className="text-gray-600 font-[400] text-[0.9rem]">
            {review?.date}
          </span>
        </div>
      </header>
      <div className="text-gray-700 py-2 max-w-[90%]">{review.review}</div>
    </div>
  );
}
