import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { capitalize, truncate } from "lodash";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function HostReviews({ shownUser, reviews: reviews1 }) {
  const [reviews, setReviews] = useState(reviews1);
  const [showing, setShowing] = useState(2);
  const [translate, setTranslate] = useState((showing - 2) * 20.1);

  useEffect(() => {
    if (reviews1) {
      const reviews2 = [...reviews1];
      while (reviews2.length > 6) {
        reviews2.splice(reviews2.length - 1, 1);
      }
      setReviews(reviews2);
    }
  }, [reviews1]);

  useEffect(() => {
    setTranslate((showing - 2) * 50.86875);
  }, [showing]);

  return (
    <div className="w-full max-w-[100vw]">
      <div className="flex justify-between pb-6 ">
        <h2 className="text-[1.4rem] font-[400] text-slate-900">
          {truncate(capitalize(shownUser?.name).split(" ")[0], 12)}'s reviews
        </h2>
        <div className="h-8 gap-2 hidden lg:flex">
          <div
            onClick={() => {
              if (showing > 2) {
                if (showing == 3) setShowing(showing - 1);
                else setShowing(showing - 2);
              }
            }}
            className={`p-[0.4rem] rounded-full border cursor-pointer ${
              showing <= 2 && "opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeftIcon
              className={`h-full ${
                showing <= 2 && "opacity-20 cursor-not-allowed"
              }`}
            />
          </div>
          <div
            onClick={() => {
              if (showing < reviews.length) {
                if (showing + 2 > reviews.length) setShowing(showing + 1);
                else setShowing(showing + 2);
              }
            }}
            className={`p-[0.4rem] rounded-full border cursor-pointer ${
              showing >= reviews.length && "opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronRightIcon
              className={`h-full ${
                showing >= reviews.length && "opacity-20 cursor-not-allowed"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-scroll scrollbar-hide lg:overflow-hidden scroll-snap w-full">
        <div
          style={{
            transform: `translate(-${translate}%)`,
            animationDuration: "200ms",
          }}
          className="transition-all reviews-scroller"
        >
          {reviews.map((item) => (
            <div className="p-4 border grid grid-rows-3 gap-3 rounded-xl overflow-visible">
              <span className="row-span-2 font-[300] text-slate-900 w-full">
                "{truncate(item.review, { length: 120 })}"
              </span>
              <div className="flex gap-[1.1rem] items-center">
                <Link
                  href={{
                    pathname: "/users/show",
                    query: {
                      shownUserId: item.byUser.id,
                    },
                  }}
                >
                  <a target="_blank">
                    <img
                      className="rounded-full h-[3.25rem] w-[3.25rem] object-cover"
                      src={item.byUser.avatar}
                      alt=""
                    />
                  </a>
                </Link>
                <div className="flex flex-col">
                  <span>
                    {truncate(capitalize(item.byUser.name).split(" ")[0], 12)}
                  </span>
                  <span className="text-sm font-[100] text-gray-500">
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
