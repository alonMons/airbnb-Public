import Image from "next/image";
import { HeartIcon, PencilAltIcon } from "@heroicons/react/outline";
import { StarIcon, HeartIcon as SolidHeartIcon } from "@heroicons/react/solid";
import { UserContext, UserDocContext } from "../services/context";
import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import Link from "next/link";

function InfoCard({
  item,
  listings,
  originEndDate,
  originStartDate,
  originNoOfGuests,
}) {
  const router = useRouter();

  const truncate = (str, n) => {
    return str.length < n ? str : str.substring(0, n) + "...";
  };

  const options = { maximumFractionDigits: 2 };

  return (
    <div>
      {router?.pathname === "/manage-listings" ? (
        <div className="flex sm:px-10 md:px-5 p-5 flex-col z-[40] bg-white max-w-full space-y-1 justify-center sm:justify-start md:flex-row sm:items-center rounded-2xl border hover:opacity-95 hover:scale-[1.01] hover:shadow-lg transition-all duration-200 ease-out first:border-t last:mb-5">
          <div className="relative h-[15rem] sm:h-[20rem] md:h-[14rem] w-full mb-4 sm:mb-0 md:w-80 flex-shrink-0 object-cover overflow-hidden rounded-2xl">
            <Link
              href={{
                pathname: "rooms",
                query: {
                  roomId: item.id,
                  originEndDate,
                  originStartDate,
                  originNoOfGuests,
                },
              }}
            >
              <a target="_blank">
                <img
                  src={item?.photos[0] ? item.photos[0] : null}
                  className="object-cover w-full h-full cursor-pointer"
                />
              </a>
            </Link>
          </div>
          <div className="flex flex-col flex-grow pl-5 justify-between h-full">
            <div>
              <div className="flex justify-between items-center">
                <p className="text-slate-600 py-1 font-[150]">
                  {item.location.sug?.terms[0]?.value}
                </p>
                {listings && (
                  <div className="p-2">
                    <PencilAltIcon
                      onClick={
                        listings
                          ? () => {
                              router.push({
                                pathname: "become-a-host",
                                query: {
                                  item: JSON.stringify(item),
                                },
                              });
                            }
                          : (e) => {
                              router.push({
                                pathname: "rooms",
                                query: {
                                  roomId: item.id,
                                },
                              });
                            }
                      }
                      className="h-6 text-gray-600 cursor-pointer hover:scale-125 transition-all"
                    />
                  </div>
                )}
              </div>
              <h4 className="text-xl">{item.title}</h4>
              <div className="border-b w-10 pt-2" />
              <p className="pt-2 font-[300] text-sm text-gray-500 flex-grow sm:mb-3 pb-2">
                {truncate(item.description, 140)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div>
                {listings && (
                  <Link
                    href={{
                      pathname: "rooms/dashboard",
                      query: {
                        roomId: item.id,
                      },
                    }}
                  >
                    <a target="_blank">
                      <div className="p-2 bg-neutral-100 rounded-lg px-4 font-[400] cursor-pointer">
                        Dashboard
                      </div>
                    </a>
                  </Link>
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-lg lg:text-2xl font-[400] pb-2 mr-2">
                  ${Intl.NumberFormat("en-US", options).format(item.price)} /
                  night
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href={{
            pathname: "rooms",
            query: {
              roomId: item.id,
              originEndDate,
              originStartDate,
              originNoOfGuests,
            },
          }}
        >
          <a target="_blank">
            <div className="flex p-5 flex-col max-w-full space-y-1 justify-center sm:justify-start md:flex-row sm:items-center rounded-2xl border cursor-pointer hover:opacity-95 hover:scale-[1.01] hover:shadow-lg transition-all duration-200 ease-out first:border-t last:mb-5">
              <img
                src={item?.photos[0] ? item.photos[0] : null}
                className="rounded-2xl h-[15rem] sm:h-[20rem] object-cover relative md:h-[14rem] w-full md:w-98 mb-4 sm:mb-0 md:w-80 flex-shrink-0"
              />
              <div className="flex flex-col flex-grow pl-5">
                <div className="flex justify-between items-center">
                  <p className="text-slate-600 py-1 font-[150]">
                    {item.location.sug?.terms[0]?.value}
                  </p>
                  {listings && (
                    <div className="p-2">
                      <PencilAltIcon
                        onClick={
                          listings
                            ? () => {
                                router.push({
                                  pathname: "become-a-host",
                                  query: {
                                    item: JSON.stringify(item),
                                  },
                                });
                              }
                            : (e) => {
                                router.push({
                                  pathname: "rooms",
                                  query: {
                                    roomId: item.id,
                                  },
                                });
                              }
                        }
                        className="h-6 text-gray-600 hover:scale-125 transition-all"
                      />
                    </div>
                  )}
                </div>
                <h4 className="text-xl">{item.title}</h4>
                <div className="border-b w-10 pt-2" />
                <p className="pt-2 font-[300] text-sm text-gray-500 flex-grow sm:mb-5 pb-4">
                  {truncate(item.description, 140)}
                </p>
                <div className="flex justify-between items-center">
                  <p className="h-5"></p>
                  <div className="flex flex-col">
                    <p className="text-lg md:text-2xl font-[400] pb-2 mr-2">
                      ${Intl.NumberFormat("en-US", options).format(item.price)}{" "}
                      / night
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </Link>
      )}
    </div>
  );
}

export default InfoCard;
