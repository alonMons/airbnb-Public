import React, { useContext, useEffect, useState } from "react";
import { StarIcon, UserCircleIcon, XIcon } from "@heroicons/react/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/outline";
import { db } from "../services/firebase";
import { format } from "date-fns";
import { UserDocContext } from "../services/context";
import ReviewItem from "./ReviewItem";
import { Modal, Slide, easing } from "@mui/material";
import ModalReviewItem from "./ModalReviewItem";

function Reviews({ room, ableToWrite, showModal, setShowModal }) {
  const [showWrite, setShowWrite] = useState(false);
  const [Review, setReview] = useState("");
  const { userDoc } = useContext(UserDocContext);
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (room?.reviews?.length > 0) {
      const reviews1 = [];
      for (let i = 0; i < room.reviews.length && i < 5; i++) {
        reviews1.push(room.reviews[i]);
      }
      setReviews(reviews1);
    }
  }, [room]);

  const handleClose = () => {
    setShowModal(false);
  };

  const changeValue = (type, value) => {
    if (type === "review") {
      setReview(value);
    }
    if (!value) {
      const errors1 = { ...errors };
      errors1[type] = `* The ${type} is required`;
      setErrors(errors1);
    } else {
      const errors1 = { ...errors };
      delete errors1[type];
      setErrors(errors1);
    }
  };

  useEffect(() => {
    if (Review.length >= 250) {
      const errors1 = { ...errors };
      errors1.reviewLength = `* The maximum length is 250`;
      setErrors(errors1);
    }
    if (Review.length < 250 && errors.reviewLength) {
      const errors1 = { ...errors };
      delete errors1.reviewLength;
      setErrors(errors1);
    }
  }, [Review]);

  const submitReview = () => {
    if (rating == 0) {
      const errors1 = { ...errors };
      errors1.rating = "* Rating is required";
      setErrors(errors1);
    } else if (Review && Review.length < 250) {
      db.collection("listings")
        .doc(room?.id)
        .update({
          reviews: [
            {
              byUser: userDoc.id,
              review: Review,
              rating,
              date: format(new Date(), "MMMM yyyy"),
            },
            ...room?.reviews,
          ],
        });
      setReview("");
      setErrors({});
      setShowWrite(false);
    }
  };

  return (
    <div>
      <header className="flex items-center flex-wrap justify-between py-1">
        <span className="text-[1.4rem] font-[400] text-slate-900 flex gap-2 items-center">
          {room?.reviews?.length > 0 && (
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <StarIcon className="h-5" />
                {(
                  _.sumBy(room?.reviews, (item) => item.rating) /
                  room?.reviews?.length
                ).toFixed(2)}
              </span>
              <span>·</span>
            </div>
          )}
          <span>{room?.reviews?.length || 0} reviews</span>
        </span>
        {userDoc && ableToWrite && (
          <button
            onClick={() => setShowWrite(!showWrite)}
            className="text-slate-900 font-[400] rounded-xl p-4 bg-gray-50"
          >
            Write a review
          </button>
        )}
      </header>

      {showWrite && userDoc && (
        <div className="flex flex-col items-center space-y-3 my-3 mb-10">
          <div className="flex space-x-5">
            <label htmlFor="review">Review:</label>
            <div className="flex flex-col space-y-1">
              <textarea
                maxLength={250}
                value={Review}
                onChange={(e) => changeValue("review", e.target.value)}
                id="review"
                className="border font-[300] w-[275px] p-2 outline-none max-h-[200px] rounded-lg border-gray-700 "
                rows="4"
              ></textarea>
              <span className="text-red-600">{errors.review}</span>
              <span className="text-red-600">{errors.reviewLength}</span>
              <span className="text-red-600">{errors.rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-[17rem] translate-x-[2.25rem]">
            <button
              onClick={submitReview}
              className="text-slate-900 font-[400] rounded-lg p-2 px-4 bg-gray-50"
            >
              Submit
            </button>
            <div className="flex items-center gap-[0.15rem]">
              {[1, 2, 3, 4, 5].map((rating1) =>
                rating1 <= rating ? (
                  <StarIcon
                    onClick={() => {
                      if (errors.rating) {
                        const errors1 = { ...errors };
                        delete errors1.rating;
                        setErrors(errors1);
                      }
                      setRating(rating1);
                    }}
                    className="h-7 text-rose-600 cursor-pointer"
                  />
                ) : (
                  <OutlineStarIcon
                    onClick={() => {
                      if (errors.rating) {
                        const errors1 = { ...errors };
                        delete errors1.rating;
                        setErrors(errors1);
                      }
                      setRating(rating1);
                    }}
                    className="w-7 h-[1.65rem] text-rose-600 cursor-pointer"
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}

      <main
        style={{ columnGap: "5rem", rowGap: "3.5rem" }}
        className="flex flex-col md:grid md:grid-cols-2 pt-5"
      >
        {reviews.map((review) => (
          <ReviewItem review={review} />
        ))}
        {room?.reviews?.length > 0 && (
          <div className="w-full col-span-2 pb-4 relative bottom-4">
            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer z-40 p-[0.25rem] font-[400] py-3 bg-white rounded-[0.5rem] hover:bg-neutral-100 border-black border px-5"
            >
              Show all {room?.reviews?.length} reviews
            </button>
          </div>
        )}
      </main>

      <Modal
        onClose={handleClose}
        className="modal flex justify-center items-center"
        open={showModal}
      >
        <Slide
          timeout={300}
          easing={{ enter: easing.easeOut }}
          direction="up"
          in={showModal}
        >
          <div className="modal-child overflow-scroll scrollbar-hide lg:w-[40rem]">
            <header className="p-5 sticky bg-white top-0 grid grid-cols-2 sm:grid-cols-3 border-b items-center">
              <div
                onClick={handleClose}
                className="relative right-2 cursor-pointer rounded-full w-9 p-2 hover:bg-neutral-100"
              >
                <XIcon className="h-5" />
              </div>
            </header>
            <div className="overflow-scroll scrollbar-hide px-6">
              {room?.reviews?.map((item) => (
                <ModalReviewItem review={item} />
              ))}
            </div>
          </div>
        </Slide>
      </Modal>
    </div>
  );
}

export default Reviews;
