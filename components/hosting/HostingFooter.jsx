import _ from "lodash";
import { Router, useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import {
  IndexContext,
  PagesContext,
  TypeContext,
} from "../../pages/become-a-host/[type]";

function HostingFooter({
  handleSubmit,
  handleUpdate,
  handleDelete,
  opacity,
  item,
}) {
  const { index, setIndex } = useContext(IndexContext);
  const router = useRouter();
  const pages = useContext(PagesContext);
  const [page, setPage] = useState({});
  const [clear, setClear] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { type } = router.query;
  const total = pages?.length;
  const {
    property,
    propertyType,
    privacyType,
    coords,
    sug,
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    title,
    description,
    price,
    hostType,
    dangerousThings,
  } = useContext(TypeContext);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (item) {
      const booked = [...item.booked];
      booked.filter((item) => {
        if (new Date() < new Date(item.endDate)) {
          return true;
        } else return false;
      });
      setDisabled(booked.length > 0);
    }
  }, [item]);

  useEffect(() => {
    if (router.isReady) {
      if (type === "property-type-group" && property) return setClear(true);
      if (type === "property-type" && propertyType) return setClear(true);
      if (type === "privacy-type" && privacyType) return setClear(true);
      if (type === "location" && coords && sug) return setClear(true);
      if (type === "floor-plan") return setClear(true);
      if (type === "amenities") return setClear(true);
      if (type === "photo" && photo1) return setClear(true);
      if (type == "photos") return setClear(true);
      if (type === "title" && title && title.length <= 50)
        return setClear(true);
      if (type === "description" && description && description.length <= 500)
        return setClear(true);
      if (type === "price" && price && price >= 10 && price <= 10000)
        return setClear(true);
      if (type === "legal" && hostType) return setClear(true);
      else setClear(false);
    }
  }, [
    page,
    router.isReady,
    property,
    propertyType,
    privacyType,
    coords,
    sug,
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    title,
    description,
    price,
    hostType,
    dangerousThings,
  ]);

  useEffect(() => {
    setPage(pages[index]);
  }, [index, pages]);

  const handleNext = () => {
    if (clear) router.push(page.next);
  };

  const handleBack = () => {
    if (opacity !== 0.5) {
      if (page.back === "/" && item) return router.push("/manage-listings");
      router.push(page.back);
    }
  };

  return (
    <footer className="fixed w-full md:w-1/2 bottom-0 top-auto bg-white h-24">
      <Progress done={(page.count / total) * 100} />
      <div className="flex items-center justify-between px-6 py-4">
        <p
          onClick={handleBack}
          className={`text-slate-900 hover:bg-gray-50 py-2 px-3 rounded-lg font-[450] text-lg underline cursor-pointer ${
            opacity == 0.5 && "opacity-30 cursor-not-allowed"
          }`}
        >
          Back
        </p>
        <div className="flex flex-row-reverse">
          <button
            onClick={
              page?.count === pages.length
                ? item
                  ? handleUpdate
                  : handleSubmit
                : handleNext
            }
            className={`${
              (!clear || opacity == 0.5) && "opacity-30 cursor-not-allowed"
            } px-5 py-3 bg-[#222222] text-white hover:bg-black rounded-md text-lg font-[450]`}
          >
            {page?.count === pages.length
              ? item
                ? "Update"
                : "Submit"
              : "Next"}
          </button>
          {item && (
            <div className="relative">
              {over && disabled && (
                <div className="absolute z-10 w-[20rem] font-[200] text-gray-600 top-[-4.85rem] left-[-7rem] sm:left-[-8.5rem] bg-white border px-4 py-2 rounded-xl">
                  You can't delete this listing because there are upcoming
                  bookings
                </div>
              )}
              <button
                onMouseOver={() => setOver(true)}
                onMouseOut={() => setOver(false)}
                disabled={disabled}
                onClick={handleDelete}
                style={{
                  borderColor: "#db1616",
                  color: "#db1616",
                }}
                className={`${
                  (!clear || disabled || opacity == 0.5) &&
                  "opacity-30 cursor-not-allowed"
                } px-5 py-3 bg-transparent border-2 text-[#222222] rounded-md text-lg font-[450] delete`}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default HostingFooter;

const Progress = ({ done }) => (
  <div className="w-full bg-[#ededed]">
    <div
      className="transition-all duration-300 ease-in-out"
      style={{ width: `${done}%`, height: 2, background: "black" }}
    ></div>
  </div>
);
