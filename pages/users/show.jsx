import React, { useContext } from "react";
import Header from "../../components/Header";
import Head from "next/head";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../../services/firebase";
import { capitalize, truncate } from "lodash";
import MedalIcon from "../../components/MedalIcon";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  XIcon,
} from "@heroicons/react/solid";
import _ from "lodash";
import date from "date-and-time";
import HostReviews from "../../components/HostReviews";
import { easing, Fade, Modal, Slide } from "@mui/material";
import ShowReviewsModal from "../../components/ShowReviewsModal";
import HostListings from "../../components/HostListings";
import { PencilAltIcon } from "@heroicons/react/outline";
import { UserDocContext } from "../../services/context";
import CapIcon from "../../components/Icons/CapIcon";
import SuitCaseIcon from "../../components/Icons/SuitCaseIcon";
import GlobeAltIcon from "../../components/Icons/GlobeAltIcon";
import GlobeIcon from "../../components/Icons/GlobeIcon";

export default function Show() {
  const router = useRouter();
  const { shownUserId } = router.query;
  const [shownUser, setShownUser] = useState();
  const [userListings, setUserListings] = useState([]);
  const [dateNum, setDateNum] = useState(0);
  const [dateType, setDateType] = useState("");
  const [rating, setRating] = useState(0);
  const [noOfReviews, setNoOfReviews] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("guests");
  const [reviewsByGuests, setReviewsByGuests] = useState([]);
  const [reviewsByHosts, setReviewsByHosts] = useState([]);
  const [ready, setReady] = useState(false);
  const { userDoc, setUserDoc } = useContext(UserDocContext);

  useEffect(() => {
    if (reviews) {
      const reviewsByGuests1 = [];
      const reviewsByHosts1 = [];
      for (const review of reviews) {
        if (review.byUser.type == "user") {
          reviewsByGuests1.push(review);
        } else reviewsByHosts1.push(review);
      }
      setReviewsByGuests(reviewsByGuests1);
      setReviewsByHosts(reviewsByHosts1);
    }
  }, [reviews]);

  useEffect(async () => {
    if (router.isReady) {
      const shownUser1 = await db
        .collection("users")
        .doc(shownUserId)
        .get()
        .then((item) => item.data());
      if (shownUser1) {
        setShownUser(shownUser1);
      } else setReady(true);

      db.collection("users")
        .doc(shownUserId)
        .onSnapshot((snapshot) => {
          if (!_.isEqual(snapshot.data(), shownUser1)) {
            setReady(false);
            setShownUser(snapshot.data());
          }
        });
    }
  }, [router]);

  useEffect(() => {
    if (reviewsByHosts?.length > 0) setType("hosts");
    if (reviewsByGuests?.length > 0) setType("guests");
  }, [reviewsByGuests, reviewsByHosts]);

  useEffect(async () => {
    if (shownUser) {
      const listings1 = [];
      for (const item of shownUser.listings) {
        const listing = await db
          .collection("listings")
          .doc(item)
          .get()
          .then((item) => item.data());
        listings1.push(listing);
      }
      setUserListings(listings1);
      if (listings1.length == 0) setReady(true);

      const joiningDate = new Date(shownUser.joiningDate);
      const difference = date.subtract(new Date(), joiningDate).toDays();
      if (difference > 365) {
        const difference1 = Number((difference / 365).toFixed(0));
        setDateNum(difference1);
        setDateType(difference1 == 1 ? "Year" : "Years");
      } else if (difference > 30) {
        const difference1 = Number((difference / 30).toFixed(0));
        setDateNum(difference1);
        setDateType(difference1 == 1 ? "Month" : "Months");
      } else if (difference > 0) {
        const difference1 = Number(difference.toFixed(0));
        setDateNum(difference1);
        setDateType(difference1 == 1 ? "Day" : "Days");
      }
    }
  }, [shownUser]);

  useEffect(() => {
    if (userListings && noOfReviews) {
      const ratingSum = _.sumBy(userListings, (listing) => {
        return _.sumBy(listing.reviews, (review) => review.rating);
      });
      setRating((ratingSum / noOfReviews).toFixed(2));
    }
  }, [userListings, noOfReviews]);

  useEffect(() => {
    setNoOfReviews(
      _.sumBy(userListings, (listing) => {
        return listing.reviews.length;
      })
    );
  }, [userListings]);

  useEffect(async () => {
    if (userListings.length > 0) {
      const reviews1 = [];
      for (const listing of userListings) {
        for (const review of listing.reviews) {
          const review1 = { ...review };
          review1.listing = listing;
          const byUser = await db
            .collection("users")
            .doc(review.byUser)
            .get()
            .then((item) => item.data());
          review1.byUser = byUser;
          reviews1.push(review1);
        }
      }
      setReady(true);
      setReviews(reviews1);
    }
  }, [userListings]);

  return (
    <div>
      <Head>
        <title>Host profile</title>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
      </Head>

      <Header />

      {ready ? (
        shownUser ? (
          <main className="flex flex-col relative md:pb-32 xl:pb-0 px-5  gap-4 lg:gap-0 items-center lg:items-start lg:grid grid-cols-1 lg:grid-cols-3 lg:px-[7rem] py-[2.5rem]">
            {userDoc && userDoc.id == shownUserId && (
              <div
                onClick={() =>
                  router.push({
                    pathname: "/users/edit",
                    query: {
                      userId: shownUserId,
                    },
                  })
                }
                className="right-5 z-[50] cursor-pointer top-[8rem] fixed flex p-[0.69rem] bg-rose-500 rounded-full"
              >
                <PencilAltIcon className="h-[1.3rem] text-white" />
              </div>
            )}
            <div className="lg:sticky lg:h-[82vh] top-[10rem] lg:mt-[0.5rem] w-full sm:w-3/4 md:w-[50%] lg:w-full">
              <div className="w-full shadow-md lg:shadow-2xl px-8 rounded-3xl grid grid-cols-3 items-center py-[1.25rem]">
                <div className="col-span-2 flex flex-col items-center gap-2">
                  <img
                    className="rounded-full w-[7rem] h-[7rem] object-cover"
                    src={shownUser?.avatar}
                    alt=""
                  />
                  <div className="flex flex-col items-center mt-2">
                    <h1
                      style={{ lineHeight: "1.6rem" }}
                      className="text-3xl font-[500] text-slate-900"
                    >
                      {truncate(capitalize(shownUser?.name).split(" ")[0], 12)}
                    </h1>
                    <h2 className="text-[0.85rem] text-slate-900 font-[400] flex items-center h-[0.75rem] gap-1 mt-[0.4rem]">
                      {shownUser?.type == "superhost" && (
                        <MedalIcon height={11} />
                      )}
                      {shownUser?.type == "user"
                        ? "Guest"
                        : capitalize(shownUser?.type)}
                    </h2>
                  </div>
                </div>
                <div className="grid grid-rows-3 items-center">
                  <div className="flex flex-col self-end mb-2">
                    <span className="text-[1.35rem]  letter-space font-[500] text-slate-900">
                      {noOfReviews}
                    </span>
                    <span className="text-[0.75rem] font-[400] text-slate-900">
                      Reviews
                    </span>
                  </div>
                  <div className="flex items-center py-2 h-full border-y border-gray-300">
                    <div className="w-full flex flex-col">
                      <span className="text-[1.35rem] font-[500] text-slate-900 flex items-center gap-[0.1rem]">
                        {rating}
                        <StarIcon className="h-[1.1rem]" />
                      </span>
                      <span className="text-[0.75rem] font-[400] text-slate-900">
                        Rating
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col self-start mt-2">
                    <span className="text-[1.35rem] font-[500] text-slate-900">
                      {dateNum}
                    </span>
                    <span className="text-[0.75rem] font-[400] text-slate-900">
                      {dateType} on Airbnb
                    </span>
                  </div>
                </div>
              </div>
              <div className="my-10 rounded-2xl border px-7 py-7">
                <h1 className="text-[1.4rem] w-[75%]">
                  {truncate(capitalize(shownUser?.name).split(" ")[0], 12)}'s
                  confirmed information
                </h1>
                <div className="grid grid-rows-3 gap-4 pt-4">
                  <div className="flex font-[100] gap-4 items-center">
                    <CheckIcon className="h-7" />
                    Identity
                  </div>
                  <div className="flex font-[100] gap-4 items-center">
                    {" "}
                    <CheckIcon className="h-7" />
                    Email address
                  </div>
                  <div className="flex font-[100] gap-4 items-center">
                    {" "}
                    <CheckIcon className="h-7" />
                    Phone number
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 px-4 lg:px-[4rem] w-full max-w-[100vw] lg:mt-7">
              {(shownUser?.host?.about ||
                shownUser?.host?.lives ||
                shownUser?.host?.work ||
                shownUser?.host?.school ||
                shownUser?.host?.spokenLanguages) && (
                <div className={`${shownUser?.host?.about && "pb-9"} border-b`}>
                  <h1 className="text-3xl font-[500] text-slate-900">
                    About{" "}
                    {truncate(capitalize(shownUser?.name).split(" ")[0], 12)}
                  </h1>
                  {(shownUser?.host?.lives ||
                    shownUser?.host?.work ||
                    shownUser?.host?.school ||
                    shownUser?.host?.spokenLanguages) && (
                    <div className="py-10 grid gap-6 lg:grid-cols-2">
                      {shownUser?.host?.school && (
                        <div className="flex gap-4 font-[200]">
                          <CapIcon height={32} />
                          Where I went to school: {shownUser?.host?.school}
                        </div>
                      )}
                      {shownUser?.host?.work && (
                        <div className="flex gap-4 font-[200]">
                          <SuitCaseIcon height={27.5} />
                          My work: {shownUser?.host?.work}
                        </div>
                      )}
                      {shownUser?.host?.spokenLanguages?.length > 0 && (
                        <div className="flex gap-4 font-[200]">
                          <GlobeAltIcon height={27.5} />
                          Speaks{" "}
                          {shownUser?.host?.spokenLanguages.map(
                            (item, index) => {
                              return `${index != 0 ? ", " : ""}${item}`;
                            }
                          )}
                        </div>
                      )}
                      {shownUser?.host?.lives && (
                        <div className="flex gap-4 font-[200]">
                          <GlobeIcon height={27.5} />
                          Lives in {shownUser?.host?.lives?.description}
                        </div>
                      )}
                    </div>
                  )}
                  <p className="font-[300] text-[#222222]">
                    {shownUser.host.about}
                  </p>
                </div>
              )}
              {reviews?.length > 0 && (
                <div className="py-9 border-b select-none w-full">
                  <HostReviews shownUser={shownUser} reviews={reviews} />
                  <div className="flex justify-start pt-5">
                    <button
                      onClick={() => setShowModal(true)}
                      className="py-[0.67rem] px-6 border border-slate-900 rounded-lg hover:bg-neutral-100"
                    >
                      Show all {reviews.length} reviews
                    </button>
                  </div>
                </div>
              )}
              {shownUser?.listings?.length > 0 && (
                <div className="py-9 w-full">
                  <HostListings shownUser={shownUser} />
                </div>
              )}
            </div>
          </main>
        ) : (
          <main className="py-[12rem] w-full  text-slate-900">
            <span
              style={{ lineHeight: "3.65rem" }}
              className="px-auto text-[3.65rem] font-[500] block w-full text-center"
            >
              404
            </span>
            <span className="px-auto block w-full text-center">
              User not found
            </span>
          </main>
        )
      ) : (
        <main className="flex flex-col items-center lg:items-start lg:grid lg:grid-cols-3 px-2 lg:px-[7rem] mt-[4rem] w-full">
          <div className="flex flex-col w-full px-6">
            <div className="w-full shadow-2xl h-[14rem] rounded-3xl grid grid-cols-3 py-[1.25rem] px-8">
              <div className="flex flex-col w-full items-center col-span-2">
                <div className="w-[7rem] h-[7rem] rounded-full bg-gray-200"></div>
                <div className="w-full flex flex-col items-center py-2">
                  <div className="w-[30%] h-7 bg-gray-200"></div>
                  <div className="w-[35%] h-2 mt-1 bg-gray-200"></div>
                </div>
              </div>
              <div className="grid grid-rows-3 ">
                <div className="h-full border-b border-gray-300 flex items-center">
                  <div className="h-7 w-4 bg-gray-200"></div>
                </div>
                <div className="h-full border-b border-gray-300 flex items-center">
                  <div className="h-7 w-12 bg-gray-200"></div>
                </div>
                <div className="h-full flex items-center">
                  <div className="h-7 w-4 bg-gray-200"></div>
                </div>
              </div>
            </div>
            <div className="h-[16.5rem] rounded-xl mt-12 border w-full p-8">
              <div className="w-1/2 h-6 bg-gray-200"></div>
              <div className="w-1/3 mt-2 h-6 bg-gray-200"></div>
              <div className="flex flex-col gap-5 mt-10">
                <div className="w-[70%] h-4 bg-gray-200"></div>
                <div className="w-[70%] h-4 bg-gray-200"></div>
                <div className="w-[70%] h-4 bg-gray-200"></div>
              </div>
            </div>
          </div>
          <div className="col-span-2 lg:px-14 w-full px-6 mt-10">
            <div className="h-8 w-1/3 bg-gray-200"></div>
            <div className="grid lg:grid-cols-2 h-[8.5rem] gap-3 mt-10">
              <div className="w-full h-full bg-gray-200 rounded-2xl"></div>
              <div className="w-full h-full bg-gray-200 rounded-2xl"></div>
              <div className="w-full h-full bg-gray-200 rounded-2xl"></div>
              <div className="w-full h-full bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="flex w-full flex-col gap-1 py-10">
              <div className="w-full h-3 bg-gray-200"></div>
              <div className="w-full h-3 bg-gray-200"></div>
              <div className="w-full h-3 bg-gray-200"></div>
              <div className="w-full h-3 bg-gray-200"></div>
              <div className="w-full h-3 bg-gray-200"></div>
              <div className="w-full h-3 bg-gray-200"></div>
            </div>
            <div className="w-full border-b mb-10"></div>
            <div className="h-8 w-1/4 bg-gray-200"></div>
            <div className="my-6 grid gap-5 grid-cols-2 w-full h-[12rem]">
              <div className="w-full h-full border rounded-xl"></div>
              <div className="w-full h-full border rounded-xl"></div>
            </div>
          </div>
        </main>
      )}

      <Modal
        onClose={() => setShowModal(false)}
        className="modal flex justify-center items-center pb-20"
        open={showModal}
      >
        <Slide
          timeout={300}
          easing={{ enter: easing.easeOut }}
          direction="up"
          in={showModal}
        >
          <div className="modal-child overflow-scroll px-6 scrollbar-hide">
            <div className="bg-white sticky top-0 py-2 pt-4">
              <div
                className="p-2 relative right-2 rounded-full hover:bg-neutral-100 w-8 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <XIcon className="h-4 text-gray-800 cursor-pointer" />
              </div>
            </div>
            <div className="w-full">
              <div className="pt-8">
                <h2 className="block text-[1.45rem] font-[500] text-slate-900">
                  {reviews.length} reviews
                </h2>
                <div className="pt-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 font-[500] text-sm justify-center">
                    <span
                      onClick={() => setType("guests")}
                      className={`text-start p-2 pl-2 px-3 hover:bg-neutral-100 rounded-lg whitespace-nowrap cursor-pointer ${
                        type == "guests" ? "text-slate-900" : "text-gray-500"
                      }`}
                    >
                      From guests · {reviewsByGuests.length}
                    </span>
                    <span
                      onClick={() => setType("hosts")}
                      className={`text-start p-2 px-3 hover:bg-neutral-100 rounded-lg whitespace-nowrap cursor-pointer ${
                        type == "hosts" ? "text-slate-900" : "text-gray-500"
                      }`}
                    >
                      From hosts · {reviewsByHosts.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 py-b pt-[0.4rem]">
                    <div
                      className={`border-b ${
                        type == "guests"
                          ? "border-2 border-slate-900"
                          : "border-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`border-b ${
                        type == "hosts"
                          ? "border-2 border-slate-900"
                          : "border-gray-200"
                      }`}
                    ></div>
                    <div className="border-b border-gray-200"></div>
                    <div className="border-b border-gray-200"></div>
                  </div>
                  <div>
                    {type == "guests" ? (
                      <ShowReviewsModal reviews={reviewsByGuests} />
                    ) : (
                      <ShowReviewsModal reviews={reviewsByHosts} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slide>
      </Modal>

      <Footer />
    </div>
  );
}
