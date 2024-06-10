import { capitalize, truncate } from "lodash";
import Link from "next/link";
import React from "react";

export default function ShowReviewsModal({ reviews }) {
  return (
    <div className="pb-2 pt-5">
      {reviews.map((review) => (
        <div className="pb-5 border-b mb-5">
          <header className="grid grid-cols-6">
            <h2 className="col-span-4 lg:col-span-5 text-slate-900 font-[500] text-lg">
              {review.listing.title}
            </h2>
            <div className="col-span-2 lg:col-span-1 ml-2">
              <Link
                href={{
                  pathname: "/rooms",
                  query: {
                    roomId: review.listing.id,
                  },
                }}
              >
                <a target="_blank">
                  <img
                    src={review.listing.photos[0]}
                    className="object-cover rounded-[0.6rem] w-full "
                    alt=""
                  />
                </a>
              </Link>
            </div>
          </header>
          <div className="flex gap-[1.1rem] items-center">
            <Link
              href={{
                pathname: "/users/show",
                query: {
                  shownUserId: review.byUser.id,
                },
              }}
            >
              <a target="_blank">
                <img
                  className="rounded-full h-[2.83rem] w-[2.83rem] object-cover"
                  src={review.byUser.avatar}
                  alt=""
                />
              </a>
            </Link>
            <div className="flex flex-col my-4">
              <span className="font-[500]">
                {truncate(capitalize(review.byUser.name).split(" ")[0], 12)}
              </span>
              <span className="text-sm font-[400] text-gray-500">
                {review.date}
              </span>
            </div>
          </div>
          <p className="text-slate-900">{review.review}</p>
        </div>
      ))}
    </div>
  );
}
