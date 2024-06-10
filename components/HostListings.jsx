import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  XIcon,
} from "@heroicons/react/solid";
import { capitalize, set, truncate } from "lodash";

import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { Modal, Slide, easing } from "@mui/material";
import ShowListing from "./ShowListing";

export default function HostListings({ shownUser }) {
  const [listings, setListings] = useState([]);
  const [shortListings, setShortListings] = useState([]);
  const [showing, setShowing] = useState(0);
  const [translate, setTranslate] = useState((showing - 3) * 13.5);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (listings) {
      if (listings.length == 1) {
        setShowing(1);
      } else if (listings.length == 2) {
        setShowing(2);
      } else setShowing(3);

      const listings1 = [];
      for (let i = 0; i < 10 && i < listings.length; i++) {
        listings1.push(listings[i]);
      }
      setShortListings(listings1);
    }
  }, [listings]);

  useEffect(() => {
    setTranslate((showing - 3) * 33.9166667);
  }, [showing]);

  useEffect(async () => {
    if (shownUser?.listings) {
      const listings1 = [];
      for (const listing of shownUser?.listings) {
        const listing1 = await db
          .collection("listings")
          .doc(listing)
          .get()
          .then((item) => item.data());
        listings1.push(listing1);
      }

      setListings(listings1);
    }
  }, [shownUser]);

  return (
    <div className="w-full">
      <div className="flex justify-between pb-6 select-none w-full">
        <h2 className="text-[1.4rem] font-[400] text-slate-900">
          {truncate(capitalize(shownUser?.name).split(" ")[0], 12)}'s listings
        </h2>
        <div className="lg:flex h-8 gap-2 hidden">
          <div
            onClick={() => {
              if (showing > 3) {
                if (showing == 4) setShowing(showing - 1);
                else if (showing == 5) setShowing(showing - 2);
                else setShowing(showing - 3);
              }
            }}
            className={`p-[0.4rem] rounded-full border cursor-pointer ${
              showing <= 3 && "opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeftIcon
              className={`h-full ${
                showing <= 3 && "opacity-20 cursor-not-allowed"
              }`}
            />
          </div>
          <div
            onClick={() => {
              if (showing < shortListings.length) {
                if (showing + 2 > shortListings.length) setShowing(showing + 1);
                else if (showing + 3 > shortListings.length)
                  setShowing(showing + 2);
                else setShowing(showing + 3);
              }
            }}
            className={`p-[0.4rem] rounded-full border cursor-pointer ${
              showing >= shortListings.length && "opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronRightIcon
              className={`h-full ${
                showing >= shortListings.length &&
                "opacity-20 cursor-not-allowed"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="lg:overflow-hidden mb-5 overflow-x-scroll scroll-snap scrollbar-hide w-full">
        <div
          style={{
            transform: `translate(-${translate}%)`,
            transitionDuration: "350ms",
          }}
          className="transition-all listings-scroller"
        >
          {shortListings?.map((listing) => (
            <ShowListing listing={listing} />
          ))}
        </div>
      </div>
      <span
        onClick={() => setShowModal(true)}
        className="text-slate-900 underline text-[0.9rem] cursor-pointer"
      >
        View all {listings.length} listings
      </span>

      <Modal
        onClose={handleClose}
        className="modal flex justify-center items-center pb-20"
        open={showModal}
      >
        <Slide
          timeout={300}
          easing={{ enter: easing.easeOut }}
          direction="up"
          in={showModal}
        >
          <div className="modal-child overflow-scroll scrollbar-hide listing-modal">
            <header className="p-5 bg-white sticky top-0 grid grid-cols-2 sm:grid-cols-3 border-b items-center">
              <div
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-neutral-100 w-7 relative right-1 cursor-pointer"
              >
                <XIcon className="h-5" />
              </div>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
              {listings.map((listing) => (
                <div className="w-full h-full flex flex-col items-center">
                  <ShowListing listing={listing} fromModal={true} />
                </div>
              ))}
            </div>
          </div>
        </Slide>
      </Modal>
    </div>
  );
}
