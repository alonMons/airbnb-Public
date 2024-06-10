import { StarIcon } from "@heroicons/react/solid";
import { truncate } from "lodash";
import Link from "next/link";
import React from "react";

export default function ShowListing({ listing }) {
  return (
    <div className="w-full h-full">
      <Link
        href={{
          pathname: "/rooms",
          query: {
            roomId: listing.id,
          },
        }}
      >
        <a target="_blank">
          <div className="w-full">
            <img
              src={listing.photos[0]}
              className="object-cover w-full h-[11.5rem] sm:h-[13rem] rounded-xl listing-show"
              alt=""
            />
            <div className="w-full px-1">
              <div className="w-full flex justify-between pt-2 py-[0.35rem]">
                <span className="text-[0.95rem]">{listing.property.title}</span>
                <span className="flex gap-1 items-center font-[200] text-[0.925rem]">
                  <StarIcon className="h-4" />
                  <span>
                    {listing.reviews.length > 0
                      ? (
                          _.sumBy(listing?.reviews, (item) => item?.rating) /
                          listing?.reviews?.length
                        ).toFixed(2)
                      : "New"}
                  </span>
                </span>
              </div>
              <span className="font-[300] text-[0.9rem] text-gray-800">
                {truncate(listing?.title, { length: 27 })}
              </span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
