import {
  ArrowLeftIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  HomeIcon,
  LocationMarkerIcon,
  XIcon,
} from "@heroicons/react/outline";
import { HomeIcon as SolidHomeIcon, StarIcon } from "@heroicons/react/solid";

import { HeartIcon as SolidHeartIcon } from "@heroicons/react/solid";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { UserContext, UserDocContext } from "../../services/context";
import _, { capitalize, random, truncate } from "lodash";
import Header from "../../components/Header";
import { db } from "../../services/firebase";
import { toLower } from "lodash";
import RoomsAmenetie from "../../components/RoomsAmenetie";
import Footer from "../../components/Footer";
import Reviews from "../../components/Reviews";
import { DateRangePicker } from "react-date-range";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import date from "date-and-time";
import OutsideAlerter from "../../components/outSideAlert";
import { MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";
import { easing, Fade, Modal, Slide } from "@mui/material";
import MedalIcon from "../../components/MedalIcon";
import AirbnbMoneyIcon from "../../components/AirbnbMoneyIcon";
import { eachDayOfInterval, isBefore, startOfToday } from "date-fns";
import Link from "next/link";

function Index() {
  const router = useRouter();
  const { originNoOfGuests, originStartDate, originEndDate, roomId } =
    router.query;
  const [room, setRoom] = useState({});
  const { userDoc, setUserDoc } = useContext(UserDocContext);
  const [host, setHost] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [noOfGuests, setNoOfGuests] = useState(1);
  const [percent, setPercent] = useState(random(86, 100));
  const [amenitiy, setAmenitiy] = useState();
  const [disabledDates, setDisabledDates] = useState([]);
  const [alreadyThere, setAlreadyThere] = useState(-1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 13,
  });
  const [startWasChanged, setStartWasChanged] = useState(false);
  const [endWasChangedByPc, setEndWasChangedByPc] = useState(false);
  const [showNoOfGuests, setShowNoOfGuests] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [photoNum, setPhotoNum] = useState(1);
  const [ready, setReady] = useState(false);
  const [ableToWrite, setAbleToWrite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (room?.reviews?.length <= 0) {
      setShowModal(false);
    }
  }, [showModal]);

  useEffect(() => {
    if (userDoc && userDoc.myBookings.length > 0) {
      const thisListing = userDoc.myBookings.filter((item) => {
        const startDate1 = new Date(item.startDate);
        return item.room == roomId && startDate1 < new Date();
      });
      setAbleToWrite(thisListing.length > 0);
    }
  }, [userDoc]);

  useEffect(() => {
    if (room) {
      const viewport1 = { ...viewport };
      viewport1.longitude = room?.location?.long;
      viewport1.latitude = room?.location?.lat;
      setViewport(viewport1);
    }
  }, [room]);

  useEffect(() => {
    if (room && userDoc) {
      setAlreadyThere(userDoc?.wishlist.indexOf(room.id));
    }
  }, [userDoc?.wishlist, room]);

  useEffect(() => {
    if (router.isReady) {
      if (originEndDate) setEndDate(new Date(originEndDate));
      if (originStartDate) setStartDate(new Date(originStartDate));
      if (originNoOfGuests) {
        if (Number(originNoOfGuests) <= room?.floorPlan?.guests) {
          setNoOfGuests(Number(originNoOfGuests));
          setAdults(Number(originNoOfGuests));
        } else {
          setNoOfGuests(Number(room?.floorPlan?.guests));
          setAdults(Number(room?.floorPlan?.guests));
        }
      }
    }
  }, [router.isReady, originEndDate, originStartDate, originNoOfGuests, room]);

  useEffect(async () => {
    if (router?.isReady && roomId) {
      await db
        .collection("listings")
        .doc(roomId)
        .get()
        .then((doc) => {
          setRoom(doc.data());
        })
        .catch((e) => {
          alert(e);
        });
      db.collection("listings")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoom(snapshot.data()));
    }
  }, [roomId, router.isReady]);

  useEffect(async () => {
    if (room?.userId) {
      const host1 = await db
        .collection("users")
        .doc(room?.userId)
        .get()
        .then((doc) => doc.data());
      setHost(host1);
      setReady(true);
      const listings1 = [];
      for (const listing of host1.listings) {
        const listing1 = await db
          .collection("listings")
          .doc(listing)
          .get()
          .then((item) => item.data());
        listings1.push(listing1);
      }
      host1.listings = listings1;
      setHost(host1);
    }

    setAmenitiy(
      room?.amenities && room?.amenities[random(0, room?.amenities?.length - 1)]
    );
  }, [room]);

  useEffect(() => {
    if (startDate && endDate && date.isSameDay(startDate, endDate)) {
      let included = false;
      for (const disabledDate of disabledDates) {
        if (date.isSameDay(disabledDate, date.addDays(endDate, 1)))
          included = true;
      }
      if (included) {
        setStartDate(date.addDays(endDate, -1));
      } else {
        setEndWasChangedByPc(true);
        setEndDate(date.addDays(endDate, 1));
      }
      setTimeout(() => {
        setEndWasChangedByPc(false);
      }, 170);
    }
  }, [startDate, endDate]);

  const addToWishlist = () => {
    if (alreadyThere == -1) {
      const userDoc1 = { ...userDoc };
      const wishlist1 = [...userDoc.wishlist];
      wishlist1.push(room.id);
      userDoc1.wishlist = wishlist1;
      setUserDoc(userDoc1);
    }
  };

  const removeFromWishlist = () => {
    if (alreadyThere !== -1) {
      const userDoc1 = { ...userDoc };
      const wishlist1 = [...userDoc.wishlist];
      wishlist1.splice(alreadyThere, 1);
      userDoc1.wishlist = wishlist1;
      setUserDoc(userDoc1);
    } else {
      alert("The listing has already been deleted from your wishlist");
    }
  };

  const [titlePrivacy, setTitlePrivacy] = useState("");
  const [elsePrivacy, setElsePrivacy] = useState("");

  useEffect(() => {
    if (room?.privacyType?.title === "An entire place") {
      setTitlePrivacy("Entire");
      setElsePrivacy("Entire home");
    }

    if (room?.privacyType?.title === "A private room") {
      setTitlePrivacy("Private room in a");
      setElsePrivacy("Private room");
    }

    if (room?.privacyType?.title === "A shared room") {
      setTitlePrivacy("Shared room in a");
      setElsePrivacy("Shared room");
    }
  }, [room]);

  const privacyDes = () => {
    if (room?.privacyType?.title === "An entire place")
      return `You'll have the ${toLower(room.property.title)} to yourself.`;
    if (room?.privacyType?.title === "A private room")
      return `You'll have a private room in the ${toLower(
        room.property.title
      )}.`;
    if (room?.privacyType?.title === "A shared room")
      return `You'll have a shared room in the ${toLower(
        room.property.title
      )}.`;
  };

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const handleBook = () => {
    const room1 = { ...room };
    room1.booked.push({
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      byUser: userDoc.id,
      noOfGuests,
    });
    room1.revenue += Number(
      (
        room1.price *
        date.subtract(new Date(endDate), new Date(startDate)).toDays()
      ).toFixed(2)
    );
    db.collection("listings")
      .doc(roomId)
      .update(room1)
      .then(() => {
        const userDoc1 = { ...userDoc };
        let myBookings1 = [];
        if (userDoc1.myBookings?.length > 0)
          myBookings1 = [...userDoc1.myBookings];
        myBookings1.push({
          startDate: startDate.toString(),
          endDate: endDate.toString(),
          room: roomId,
        });
        userDoc1.myBookings = myBookings1;
        setUserDoc(userDoc1);
      });
    setStartDate(date.addDays(endDate, 1));
    router.push({ pathname: "/my-bookings" });
  };

  useEffect(() => {
    if (room && room.booked?.length > 0) {
      let disabledDates1 = [];
      for (const bookedDate of room.booked) {
        for (
          let i = 0;
          date.addDays(new Date(bookedDate.startDate), i) <=
          new Date(bookedDate.endDate);
          i++
        ) {
          disabledDates1.push(date.addDays(new Date(bookedDate.startDate), i));
        }
      }
      disabledDates1.push(date.addDays(new Date(), -1));
      disabledDates1.push(date.addDays(date.addYears(new Date(), 1), 1));
      for (const dis1 of disabledDates1) {
        for (const dis2 of disabledDates1) {
          const dis3 = date.addDays(dis2, 2);
          if (date.isSameDay(dis1, dis3)) {
            const dis4 = date.addDays(dis2, 1);
            let included = false;
            for (const dis5 of disabledDates1) {
              if (date.isSameDay(dis5, dis4)) {
                included = true;
              }
            }
            if (!included) {
              disabledDates1.push(dis4);
            }
          }
        }
      }
      disabledDates1.sort((a, b) => {
        if (a < b) return -1;
        else return 1;
      });
      setDisabledDates(disabledDates1);
    }
  }, [room]);

  useEffect(() => {
    if (showCalendar) {
      setStartWasChanged(true);
    }
  }, [startDate]);

  useEffect(() => {
    if (showCalendar && startWasChanged && !endWasChangedByPc) {
      setStartWasChanged(false);
      setShowCalendar(false);
    }
  }, [endDate]);

  useEffect(() => {
    if (children >= 0 && adults >= 0 && router.isReady) {
      setNoOfGuests(children + adults);
    }
  }, [children, adults, router.isReady]);

  const options = { maximumFractionDigits: 2 };

  useEffect(() => {
    if (isBefore(endDate, startDate)) {
      const endDate1 = new Date(endDate);
      setEndDate(startDate);
      setStartDate(endDate1);
    }
    if (disabledDates?.length > 0) {
      const bookingDates = [];
      for (let j = 0; date.addDays(startDate, j) <= endDate; j++) {
        bookingDates.push(date.addDays(startDate, j));
      }

      for (let bookDate of bookingDates) {
        for (let disabledDate of disabledDates) {
          if (date.isSameDay(disabledDate, bookDate)) {
            setStartDate(date.addDays(startDate, 1));
            setEndDate(date.addDays(startDate, 2));
          }
        }
      }
    }
    if (isBefore(startDate, startOfToday())) {
      setStartDate(startOfToday());
    }
  }, [startDate, endDate, disabledDates]);

  return (
    <div className="scroll-smooth">
      <Modal open={showPhotosModal} onClose={() => setShowPhotosModal(false)}>
        <Slide
          timeout={400}
          easing={{ enter: easing.easeOut }}
          direction="up"
          in={showPhotosModal}
        >
          <div className="w-[100vw] h-[100vh] bg-black select-none">
            <div
              onClick={() => setShowPhotosModal(false)}
              className="flex absolute top-10 left-11 text-white items-center font-[400] cursor-pointer color-hover py-[0.3rem] pl-3 pr-4 rounded-[0.475rem]"
            >
              <XIcon className="h-[1.3rem] text-white" />
              <span className="ml-[0.2rem]">Close</span>
            </div>
            <div className="text-[1.1rem] z-40 shadow-2xl absolute top-10 left-1/2 translate-x-[-50%] font-[400] text-white">
              {photoNum} / {room?.photos?.length}
            </div>
            <div
              onClick={() => {
                if (photoNum > 1) setPhotoNum(photoNum - 1);
              }}
              className={
                photoNum > 1
                  ? "absolute z-[40] shadow-2xl  cursor-pointer top-1/2 left-[1rem] sm:left-[2.5rem] translate-y-[-50%] rounded-full border-white border-[1.5px] p-4 text-white"
                  : "hidden"
              }
            >
              <ChevronLeftIcon className="h-4" />
            </div>
            <div
              onClick={() => {
                if (photoNum < room?.photos?.length) setPhotoNum(photoNum + 1);
              }}
              className={
                photoNum < room?.photos?.length
                  ? "absolute z-[40] shadow-2xl cursor-pointer top-1/2 right-[1rem] sm:right-[2.5rem] translate-y-[-50%] rounded-full border-white border-[1.5px] p-4 text-white"
                  : "hidden"
              }
            >
              <ChevronRightIcon className="h-4" />
            </div>
            <div className="absolute flex justify-center items-center right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 w-[70vw]">
              <img
                className="object-contain h-[65vh] w-[75vw]"
                src={room?.photos ? room?.photos[photoNum - 1] : ""}
              />
            </div>
          </div>
        </Slide>
      </Modal>

      <Head>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
        <title>{room?.title ? room.title : "Room"}</title>
      </Head>

      <div className="sticky top-0 z-[100]">
        <Header />
      </div>

      {router.isReady && ready ? (
        room?.id ? (
          <main className="max-w-[1140px]  md:px-4 mx-auto py-4">
            <header className="p-4 pb-0">
              <h1 className="text-[29px] text-slate-900 font-[400] block">
                {room?.title}
              </h1>
              <div className="flex justify-between flex-wrap">
                <span className="flex gap-2 items-center">
                  {room?.reviews?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-[0.2rem] text-[15px]">
                        <StarIcon className="h-4" />
                        {(
                          _.sumBy(room?.reviews, (item) => item.rating) /
                          room?.reviews?.length
                        ).toFixed(2)}
                      </span>
                      <span className="text-slate-800 font-[400] text-[15px] hidden md:flex">
                        ·
                      </span>
                    </div>
                  )}
                  <span
                    onClick={() => setShowModal(true)}
                    className="text-slate-800 cursor-pointer underline font-[400] text-[15px] hidden md:flex"
                  >
                    {room?.reviews?.length}{" "}
                    {room?.reviews?.length == 1 ? "review" : "reviews"}
                  </span>
                  <span className="text-slate-800 font-[400] text-[15px] hidden md:flex">
                    ·
                  </span>
                  {host?.type == "superhost" && (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center flex-row-reverse gap-[0.35rem]">
                        <span className="text-gray-800 font-[100] text-[15px]">
                          Superhost
                        </span>
                        <MedalIcon height={13.5} />
                      </span>
                      <span className="text-slate-800 font-[400] text-[15px] hidden md:flex">
                        ·
                      </span>
                    </div>
                  )}
                  <Link
                    href={{
                      pathname: "/search",
                      query: { location: JSON.stringify(room?.location?.sug) },
                    }}
                  >
                    <a target="_blank">
                      <span className="text-slate-800 hidden md:inline-block underline font-[400] text-[15px]">
                        {
                          room?.location?.sug?.formattedSuggestion
                            ?.secondaryText
                        }
                      </span>
                    </a>
                  </Link>
                </span>
                {alreadyThere == -1 ? (
                  <span
                    onClick={() => addToWishlist()}
                    className="flex items-center space-x-2 font-[400] cursor-pointer text-slate-900"
                  >
                    <HeartIcon className="h-5" />
                    <span className="underline">Save</span>
                  </span>
                ) : (
                  <span
                    onClick={removeFromWishlist}
                    className="flex items-center space-x-2 font-[400] cursor-pointer text-slate-900"
                  >
                    <SolidHeartIcon className="h-5" />
                    <span className="underline">Remove</span>
                  </span>
                )}
              </div>
            </header>
            <main className="p-4">
              <div className="h-[55vh] w-full mb-3 mt-2 room-hide relative">
                <div
                  onClick={() => {
                    setPhotoNum(1);
                    setShowPhotosModal(true);
                  }}
                  className="cursor-pointer z-40 p-[0.25rem] font-[400] bg-white rounded-[0.5rem] border-black border px-3 absolute bottom-5 right-5"
                >
                  Show all photos
                </div>
                <img
                  onClick={() => {
                    setShowPhotosModal(true);
                    setPhotoNum(1);
                  }}
                  src={room?.photos[0] ? room?.photos[0] : null}
                  className="w-full hover:opacity-[90%] transition z-10 object-cover h-full rounded-2xl mt-4"
                />
              </div>
              <div className="h-[55vh] w-full mb-8 mt-2 hidden room-show relative">
                <div
                  onClick={() => {
                    setPhotoNum(1);
                    setShowPhotosModal(true);
                  }}
                  className="cursor-pointer flex items-center z-40 p-[0.25rem] font-[400] bg-white rounded-[0.5rem] border-black border px-3 absolute bottom-6 right-6"
                >
                  Show all photos
                </div>

                {room?.photos?.length == 1 && (
                  <img
                    src={room?.photos[0]}
                    onClick={() => {
                      setShowPhotosModal(true);
                      setPhotoNum(1);
                    }}
                    className="w-full hover:opacity-[90%] transition z-10 cursor-pointer object-cover h-full rounded-2xl mt-4"
                  />
                )}
                {room?.photos?.length == 2 && (
                  <div className="h-full grid-room-2 w-full">
                    <img
                      src={room?.photos[0]}
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(1);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer object-cover h-full rounded-l-2xl"
                    />
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(2);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full rounded-r-2xl overflow-hidden"
                    >
                      <img
                        src={room?.photos[1]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {room?.photos?.length == 3 && (
                  <div className="grid-room-3 h-full w-full">
                    <img
                      src={room?.photos[0]}
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(1);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full object-cover row-span-2 rounded-l-2xl"
                    />
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(2);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full rounded-2xl rounded-top-right overflow-hidden"
                    >
                      <img
                        src={room?.photos[1]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(3);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full rounded-2xl rounded-bottom-right overflow-hidden"
                    >
                      <img
                        src={room?.photos[2]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {room?.photos?.length == 4 && (
                  <div className="grid-room-4 h-full w-full">
                    <img
                      src={room?.photos[0]}
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(1);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full object-cover row-span-2 rounded-l-2xl"
                    />
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(2);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full overflow-hidden"
                    >
                      <img
                        src={room?.photos[1]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(3);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full rounded-2xl rounded-top-right overflow-hidden"
                    >
                      <img
                        src={room?.photos[2]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(4);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer col-span-2 h-full rounded-2xl rounded-bottom-right overflow-hidden"
                    >
                      <img
                        src={room?.photos[3]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {room?.photos?.length == 5 && (
                  <div className="grid-room-5 h-full w-full">
                    <img
                      src={room?.photos[0]}
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(1);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full object-cover row-span-2 rounded-l-2xl"
                    />
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(2);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full overflow-hidden"
                    >
                      <img
                        src={room?.photos[1]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(3);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full rounded-2xl rounded-top-right overflow-hidden"
                    >
                      <img
                        src={room?.photos[2]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(4);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full overflow-hidden"
                    >
                      <img
                        src={room?.photos[3]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setShowPhotosModal(true);
                        setPhotoNum(5);
                      }}
                      className="w-full hover:opacity-[90%] transition z-10 cursor-pointer h-full rounded-2xl rounded-bottom-right overflow-hidden"
                    >
                      <img
                        src={room?.photos[4]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full">
                <div className="md:mt-2 w-full py-5 grid-room grid pb-16">
                  <div className="flex lg:w-[90%] flex-col items-center border-b pb-8 lg:pb-5 lg:border-none">
                    <div className="flex px-2 pb-8 gap-5 justify-between items-center border-b w-full lg:w-[95%]">
                      <div>
                        <h1 className="text-[1.4rem] text-slate-900 font-[400]">{`${titlePrivacy} ${toLower(
                          room?.propertyType?.title
                        )} hosted by ${
                          capitalize(host.name).split(" ")[0]
                        }`}</h1>
                        <h3 className="pr-3 font-[200]">
                          {Object.keys(room.floorPlan).map((key) => {
                            if (
                              Object.keys(room.floorPlan).indexOf(key) ===
                              Object.keys(room.floorPlan).length - 1
                            )
                              return `${room.floorPlan[key]} ${key}`;
                            return `${room.floorPlan[key]} ${key} · `;
                          })}
                        </h3>
                      </div>
                      <a
                        className="h-[3.75rem] w-[3.75rem] aspect-square"
                        href="#host"
                      >
                        <div className="relative">
                          <img
                            src={host.avatar}
                            className="h-[3.75rem] w-[3.75rem] object-cover rounded-full"
                            alt=""
                          />
                          {host?.type == "superhost" && (
                            <div>
                              <div className="absolute bottom-[0rem] right-[-0.5rem] z-10">
                                <MedalIcon rose={true} height={25} />
                              </div>
                              <div className="absolute bottom-[-0.01rem] right-[-0.40rem]">
                                <MedalIcon white={true} height={25} />
                              </div>
                              <div className="absolute bottom-[-0.015rem] right-[-0.5rem]">
                                <MedalIcon white={true} height={25} />
                              </div>
                              <div className="absolute bottom-[-0.1rem] right-[-0.4rem]">
                                <MedalIcon white={true} height={25} />
                              </div>
                              <div className="absolute bottom-[0.1rem] right-[-0.4rem]">
                                <MedalIcon white={true} height={25} />
                              </div>
                              <div className="absolute bottom-[-0.5rem] right-[-1.1rem]">
                                <MedalIcon white={true} height={25} />
                              </div>
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                    <ul className="space-y-5 py-6 w-full px-2">
                      <li className="flex items-center space-x-4">
                        <HomeIcon className="h-8" />
                        <div className="flex flex-col space-y-0">
                          <h3 className="font-[400] text-slate-900 text-[17px]">
                            {elsePrivacy}
                          </h3>
                          <h4 className="text-gray-500 font-[200]">
                            {privacyDes()}
                          </h4>
                        </div>
                      </li>
                      <li className="flex items-center space-x-4">
                        <LocationMarkerIcon className="h-8" />
                        <div className="flex flex-col space-y-0">
                          <h3 className="font-[400] text-slate-900 text-[17px]">
                            Great location
                          </h3>
                          <h4 className="text-gray-500 font-[200]">
                            {percent}% of recent guests gave the location a
                            5-star rating.
                          </h4>
                        </div>
                      </li>
                      {room.amenities.length > 0 && (
                        <li className="flex items-center space-x-4">
                          <BookmarkIcon className="h-8" />
                          <div className="flex flex-col space-y-0">
                            <h3 className="font-[400] text-slate-900 text-[17px]">
                              {amenitiy}
                            </h3>
                            <h4 className="text-gray-500 font-[200]">
                              Guests often search for this popular amenity
                            </h4>
                          </div>
                        </li>
                      )}
                    </ul>
                    <p className=" text-gray-800 font-[300] border-y py-6 lg:pt-5 w-full lg:w-[95%]">
                      {room?.description}
                    </p>
                    <div className=" border-b py-6 w-full lg:w-[95%]">
                      <h3 className=" text-[1.4rem] text-slate-900 font-[400] block mb-7">
                        What this place offers
                      </h3>
                      {room.amenities.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:px-0 px-4 w-full gap-[1.2rem]">
                          {room.amenities.map((item) => (
                            <RoomsAmenetie title={item} />
                          ))}
                        </div>
                      ) : (
                        "No special amenities"
                      )}
                    </div>
                    `
                    <div className="w-[90%] scale-[1.15] flex flex-col items-center justify-center mb-10 mt-5 lg:mt-2 pt-6">
                      <div className="align-left w-full px-8 mb-3">
                        <h3 className=" text-[1.25rem] text-slate-900 font-[400]">
                          {date
                            .subtract(endDate, startDate)
                            .toDays()
                            .toFixed(0)}{" "}
                          {date
                            .subtract(endDate, startDate)
                            .toDays()
                            .toFixed(0) == 1
                            ? "night"
                            : "nights"}{" "}
                          in {room?.location?.sug?.terms[1]?.value}
                        </h3>
                        <div className="text-[0.8rem] font-[200] text-gray-500">
                          {date.format(startDate, "MMM D, YYYY")} -{" "}
                          {date.format(endDate, "MMM D, YYYY")}
                        </div>
                      </div>
                      <div className="max-w-[80vw] pt-2 scrollbar-hide overflow-hidden md:overflow-scroll">
                        <DateRangePicker
                          showDateDisplay={false}
                          minDate={new Date()}
                          maxDate={date.addYears(new Date(), 1)}
                          rangeColors={["#000000"]}
                          color="#ffffff"
                          ranges={[selectionRange]}
                          onChange={handleSelect}
                          disabledDates={disabledDates}
                          className="overflow-hidden w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex max-w-[90vw] w-full sm:max-w-[95vw] mt-5 mb-10 lg:mt-0 h-[35rem] sm:h-[30rem] sticky top-[9.5rem] flex-col border rounded-2xl shadow-xl border-gray-300 py-5 px-6">
                    <div className="flex justify-between items-center w-full mb-4">
                      <div className="">
                        <span className="text-[2rem]">
                          $
                          {Intl.NumberFormat("en-US", options).format(
                            Number(room.price)
                          )}
                        </span>
                        <span className="font-thin text-[1.15rem]"> night</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {room?.reviews?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="flex items-center gap-[0.2rem] text-[15px]">
                              <StarIcon className="h-4" />
                              {(
                                _.sumBy(room?.reviews, (item) => item.rating) /
                                room?.reviews?.length
                              ).toFixed(2)}
                            </span>
                            <span className="text-slate-800 font-[400] text-[15px] hidden md:flex">
                              ·
                            </span>
                          </div>
                        )}
                        <div
                          onClick={() => setShowModal(true)}
                          className="font-[200] cursor-pointer text-gray-600 underline"
                        >
                          {room?.reviews?.length}{" "}
                          {room?.reviews?.length == 1 ? "Review" : "Reviews"}
                        </div>
                      </div>
                    </div>
                    {showCalendar && (
                      <OutsideAlerter setShow={setShowCalendar}>
                        <div className="border-[1.3px] bg-white shadow-2xl absolute top-[5rem] sm:right-[0rem] md:right-[1.4rem] scrollbar-hide overflow-hidden rounded-2xl lg:pl-[0.5rem] pb-[0.5rem] flex flex-col align-middle width-book-room">
                          <DateRangePicker
                            minDate={new Date()}
                            maxDate={date.addYears(new Date(), 1)}
                            rangeColors={["#000000"]}
                            color="#ffffff"
                            ranges={[selectionRange]}
                            onChange={handleSelect}
                            disabledDates={disabledDates}
                            className="overflow-hidden"
                          />
                        </div>
                      </OutsideAlerter>
                    )}
                    {showNoOfGuests && (
                      <OutsideAlerter setShow={setShowNoOfGuests}>
                        <div className="border-[1.3px] select-none p-4 px-6 w-[95vw] sm:w-[88%] bg-white shadow-2xl absolute top-[13.5rem] sm:top-[12.5rem] md:top-[12.5rem] right-[-0.5rem] sm:right-[2.3rem] md:right-[1.45rem] scrollbar-hide overflow-hidden gap-4 rounded-md flex flex-col align-middle">
                          <li className="flex items-center justify-between w-full">
                            <div className="flex flex-col items-center">
                              <span className="text-[1.15rem] font-[400]">
                                Adults
                              </span>
                              <span className="text-[0.9rem] text-gray-800 font-[350]">
                                Age 13+
                              </span>
                            </div>
                            <div className="flex space-x-4 items-center">
                              <div
                                onClick={() => {
                                  if (adults > 1) setAdults(adults - 1);
                                }}
                                className={`flex justify-center items-center cursor-pointer rounded-full w-8 h-8 border ${
                                  adults < 2
                                    ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                                    : "border-[#bcbcbc] text-[#717171]"
                                }`}
                              >
                                <MinusSmIcon className="h-11" />
                              </div>
                              <p className="text-gray-900 text-[1.35rem] font-[300]">
                                {adults}
                              </p>
                              <div
                                onClick={() => {
                                  if (
                                    children + adults <
                                    room?.floorPlan?.guests
                                  )
                                    setAdults(adults + 1);
                                }}
                                className={`flex justify-center items-center cursor-pointer rounded-full w-8 h-8 border ${
                                  children + adults >= room?.floorPlan?.guests
                                    ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                                    : "border-[#bcbcbc] text-[#717171]"
                                } `}
                              >
                                <PlusSmIcon className="h-11" />
                              </div>
                            </div>
                          </li>
                          <li className="flex items-center justify-between w-full">
                            <div className="flex flex-col items-center">
                              <span className="text-[1.15rem] font-[400]">
                                Children
                              </span>
                              <span className="text-[0.9rem] text-gray-800 font-[350]">
                                Ages 2-12
                              </span>
                            </div>
                            <div className="flex space-x-4 items-center">
                              <div
                                onClick={() => {
                                  if (children > 0) setChildren(children - 1);
                                }}
                                className={`flex justify-center items-center cursor-pointer rounded-full w-8 h-8 border ${
                                  children < 1
                                    ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                                    : "border-[#bcbcbc] text-[#717171]"
                                }`}
                              >
                                <MinusSmIcon className="h-11" />
                              </div>
                              <p className="text-gray-900 text-[1.35rem] font-[300]">
                                {children}
                              </p>
                              <div
                                onClick={() => {
                                  if (
                                    adults + children <
                                    room?.floorPlan?.guests
                                  )
                                    setChildren(children + 1);
                                }}
                                className={`flex justify-center items-center cursor-pointer rounded-full w-8 h-8 border ${
                                  adults + children >= room?.floorPlan?.guests
                                    ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                                    : "border-[#bcbcbc] text-[#717171]"
                                } `}
                              >
                                <PlusSmIcon className="h-11" />
                              </div>
                            </div>
                          </li>
                          <li className="flex items-center justify-between w-full">
                            <div className="flex flex-col items-center">
                              <span className="text-[1.15rem] font-[400]">
                                Infants
                              </span>
                              <span className="text-[0.9rem] text-gray-800 font-[350]">
                                Under 2
                              </span>
                            </div>
                            <div className="flex space-x-4 items-center">
                              <div
                                onClick={() => {
                                  if (infants > 0) setInfants(infants - 1);
                                }}
                                className={`flex justify-center items-center cursor-pointer rounded-full w-8 h-8 border ${
                                  infants < 1
                                    ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                                    : "border-[#bcbcbc] text-[#717171]"
                                }`}
                              >
                                <MinusSmIcon className="h-11" />
                              </div>
                              <p className="text-gray-900 text-[1.35rem] font-[300]">
                                {infants}
                              </p>
                              <div
                                onClick={() => {
                                  if (infants < 5) setInfants(infants + 1);
                                }}
                                className={`flex justify-center items-center cursor-pointer rounded-full w-8 h-8 border ${
                                  infants >= 5
                                    ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                                    : "border-[#bcbcbc] text-[#717171]"
                                } `}
                              >
                                <PlusSmIcon className="h-11" />
                              </div>
                            </div>
                          </li>
                          <span className="mt-2 text-[0.86rem] font-[350] text-gray-900">
                            This place has a maximum of{" "}
                            {room?.floorPlan?.guests} guests, not including
                            infants.
                          </span>
                          <div className="flex justify-end ">
                            <span
                              onClick={() => setShowNoOfGuests(false)}
                              className="text-[1.15rem] cursor-pointer font-[400] underline py-2 px-3 hover:bg-neutral-100 transition-all rounded-md"
                            >
                              Close
                            </span>
                          </div>
                        </div>
                      </OutsideAlerter>
                    )}
                    <div className="w-full mb-4">
                      <div
                        onClick={() => {
                          if (!showCalendar) {
                            setShowCalendar(true);
                            setShowNoOfGuests(false);
                          }
                        }}
                        className="w-full grid grid-cols-2 cursor-pointer"
                      >
                        <div className="flex flex-col no-bottom-border px-3 py-2 border-[0.2px] rounded-b-none rounded-l-[0.55rem] border-gray-400">
                          <div className="text-[0.7rem] font-[400]">
                            CHECK-IN
                          </div>
                          <div className="text-1rem text-gray-900 font-[350]">
                            {date.format(startDate, "D/M/YYYY")}
                          </div>
                        </div>
                        <div className="flex no-bottom-border flex-col px-3 py-2 border-y-[0.2px] rounded-b-none border-r-[0.2px] rounded-r-[0.55rem] border-gray-400">
                          <div className="text-[0.7rem] font-[400]">
                            CHECKOUT
                          </div>
                          <div className="text-1rem text-gray-900 font-[350]">
                            {date.format(endDate, "D/M/YYYY")}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          onClick={() => {
                            if (!showNoOfGuests) {
                              setShowNoOfGuests(true);
                              setShowCalendar(false);
                            }
                          }}
                          className="flex cursor-pointer flex-col px-3 py-2 border-[0.2px] rounded-b-[0.55rem] border-gray-400"
                        >
                          <div className="text-[0.7rem] font-[400]">GUESTS</div>
                          <div className="text-1rem text-gray-900 font-[350]">
                            {noOfGuests} {noOfGuests == 1 ? "guest" : "guests"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-2 w-full mb-4">
                      <button
                        disabled={!userDoc || room?.bookingDisabled}
                        onClick={() => handleBook()}
                        className={
                          (userDoc && !room?.bookingDisabled
                            ? "gradient-book"
                            : "bg-gray-500 cursor-not-allowed") +
                          " font-[400] text-white p-2 rounded-xl"
                        }
                      >
                        Book
                      </button>
                      <div className="justify-center font-[350] flex text-gray-600 text-[1rem] w-full ">
                        {userDoc
                          ? room?.bookingDisabled
                            ? "The host has disabled booking"
                            : "You won't be charged yet"
                          : "You have to sign in to book"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full mb-4">
                      <ul className="flex flex-col gap-2.5 border-b pb-4">
                        <li className="flex justify-between text-lg text-gray-700 font-[350]">
                          <div className="underline">
                            $
                            {Intl.NumberFormat("en-US", options).format(
                              Number(room.price)
                            )}{" "}
                            x{" "}
                            {date
                              .subtract(endDate, startDate)
                              .toDays()
                              .toFixed(0)}{" "}
                            nights
                          </div>
                          <span>
                            $
                            {Intl.NumberFormat("en-US", options).format(
                              (
                                room.price *
                                date.subtract(endDate, startDate).toDays()
                              ).toFixed(1)
                            )}
                          </span>
                        </li>
                        <li className="flex justify-between text-gray-700 font-[350]">
                          <div className="underline text-[1.12rem]">
                            Airbnb service fee
                          </div>
                          <span className="text-[1.12rem]">
                            $
                            {Intl.NumberFormat("en-US", options).format(
                              (
                                0.15 *
                                room.price *
                                date.subtract(endDate, startDate).toDays()
                              ).toFixed(1)
                            )}
                          </span>
                        </li>
                      </ul>
                      <div className="flex justify-between text-[1.13rem] mt-4">
                        <span>Total</span>
                        <span>
                          $
                          {Intl.NumberFormat("en-US", options).format(
                            (
                              1.15 *
                              room.price *
                              date.subtract(endDate, startDate).toDays()
                            ).toFixed(1)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 pb-2">
                  <Reviews
                    room={room}
                    ableToWrite={ableToWrite}
                    showModal={showModal}
                    setShowModal={setShowModal}
                  />
                </div>

                <div className="select-none max-w-[90vw] border-t z-0 pb-10 pt-10">
                  <h3 className=" text-[1.4rem] text-slate-900 font-[400] block mb-6">
                    Where you’ll be
                  </h3>
                  <div className="w-full h-[30rem] relative mb-7">
                    <div className="absolute z-[40] top-6 right-5 bg-white rounded-lg">
                      <div
                        onClick={() => {
                          if (viewport.zoom + 1 <= 16.5) {
                            const viewport1 = { ...viewport };
                            viewport1.zoom = viewport1.zoom + 1;
                            setViewport(viewport1);
                          }
                        }}
                        className="w-full border-b py-[0.6rem] px-[0.33rem] cursor-pointer"
                      >
                        <PlusSmIcon className="h-6" />
                      </div>
                      <div
                        onClick={() => {
                          if (viewport.zoom - 1 >= 10) {
                            const viewport1 = { ...viewport };
                            viewport1.zoom = viewport1.zoom - 1;
                            setViewport(viewport1);
                          }
                        }}
                        className="w-full py-[0.6rem] px-[0.33rem] cursor-pointer"
                      >
                        <MinusSmIcon className="h-6" />
                      </div>
                    </div>
                    <ReactMapGL
                      scrollZoom={false}
                      mapStyle="mapbox://styles/alonmons/ckyud6tzv001q14o0oxjdgk95"
                      onViewportChange={(nextViewPort) => {
                        setViewport(nextViewPort);
                      }}
                      width="100%"
                      height="100%"
                      {...viewport}
                      mapboxApiAccessToken={process.env.mapbox_key}
                      minZoom={10}
                      maxZoom={16.5}
                    >
                      {room?.location && (
                        <Marker
                          longitude={room?.location?.long}
                          latitude={room?.location?.lat}
                        >
                          <div className="relative w-10 h-10 scale-110 rounded-full translate-x-[-50%] translate-y-[-65%] bg-rose-500 flex justify-center items-center">
                            <div className="h-5 w-5 bg-rose-500 absolute bottom-[-0.01rem] rotate-45 z-1"></div>
                            <SolidHomeIcon className="h-5 text-white z-5 absolute" />
                          </div>
                        </Marker>
                      )}
                    </ReactMapGL>
                    <div
                      id="host"
                      className=" absolute bottom-[2.5rem] sm:bottom-[5.5rem] md:bottom-[6.5rem] lg:bottom-[7.5rem]"
                    ></div>
                  </div>
                  <span className="text-slate-900">
                    {room?.location?.sug?.formattedSuggestion?.secondaryText}
                  </span>
                </div>

                <div className="border-t py-10 border-b">
                  <header className="flex items-center gap-6">
                    <div
                      onClick={() =>
                        router.push({
                          pathname: "/users/show",
                          query: {
                            shownUserId: host?.id,
                          },
                        })
                      }
                      className="relative  cursor-pointer"
                    >
                      <img
                        className="rounded-full object-cover w-[4.5rem] h-[4.5rem]"
                        src={host.avatar}
                        alt=""
                      />
                      {host?.type == "superhost" && (
                        <div className="relative scale-110 right-1">
                          <div className="absolute bottom-[0rem] right-[-0.5rem] z-10">
                            <MedalIcon rose={true} height={25} />
                          </div>
                          <div className="absolute bottom-[-0.01rem] right-[-0.40rem]">
                            <MedalIcon white={true} height={25} />
                          </div>
                          <div className="absolute bottom-[-0.015rem] right-[-0.5rem]">
                            <MedalIcon white={true} height={25} />
                          </div>
                          <div className="absolute bottom-[-0.1rem] right-[-0.4rem]">
                            <MedalIcon white={true} height={25} />
                          </div>
                          <div className="absolute bottom-[0.1rem] right-[-0.4rem]">
                            <MedalIcon white={true} height={25} />
                          </div>
                          <div className="absolute bottom-[-0.5rem] right-[-1.1rem]">
                            <MedalIcon white={true} height={25} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[1.4rem] text-slate-900">
                        Hosted by{" "}
                        {truncate(capitalize(host?.name?.split(" ")[0]), {
                          length: 10,
                        })}
                      </span>
                      <span className="font-[100] text-gray-500 text-[0.9rem]">
                        Joined in{" "}
                        {date.format(new Date(host.joiningDate), "MMMM YYYY")}
                      </span>
                    </div>
                  </header>
                  <div className="grid md:grid-cols-2 gap-8 md:gap-0">
                    <div className="md:w-[83.5%] w-[90%] text-[1rem]">
                      <div className="flex py-5 px-1 gap-7">
                        <div className="flex font-[200] gap-2 items-center">
                          <StarIcon className="h-5" />
                          <span>
                            {_.sumBy(
                              host?.listings,
                              (item) => item?.reviews?.length
                            )}{" "}
                            reviews
                          </span>
                        </div>
                        {host.type == "superhost" && (
                          <div className="flex font-[200] gap-2 items-center">
                            <MedalIcon height={15} />
                            Superhost
                          </div>
                        )}
                      </div>
                      <div className="font-[200] text-gray-800">
                        {truncate(host?.host?.about, { length: 225 })}
                      </div>
                    </div>
                    <div className="flex gap-3 flex-col font-[200] text-slate-900 w-[80%] md:w-[55%]">
                      {host?.host?.spokenLanguages?.length > 0 && (
                        <div className="">
                          Languages
                          {host?.host?.spokenLanguages.map((item, index) => {
                            return `${index != 0 ? ", " : ": "}${item}`;
                          })}
                        </div>
                      )}
                      <div>Response rate: 100%</div>
                      <div>Response time: within an hour</div>
                      <div className="flex gap-3 mt-2 items-center">
                        <AirbnbMoneyIcon height={50} />
                        <span className="text-[0.8rem] font-[100] text-gray-700">
                          To protect your payment, never transfer money or
                          communicate outside of the Airbnb website or app.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </main>
        ) : (
          <main className="max-w-[1140px] mx-auto py-48">
            <h1
              style={{ lineHeight: "3.15rem" }}
              className="text-center block text-[3.5rem] text-slate-900 font-[400]"
            >
              404
            </h1>
            <h2 className="text-center block text-lg text-gray-500 font-[300]">
              Room not found
            </h2>
          </main>
        )
      ) : (
        <main className="max-w-[1140px] md:px-4 px-4 lg:px-0 mx-auto py-12">
          <header className="pb-0 w-full">
            <div className="w-3/4 lg:w-[42%] h-7 bg-gray-200 mb-2"></div>
            <div className="w-1/2 lg:w-1/4 h-4 bg-gray-200 mb-5"></div>
          </header>
          <div className="w-full h-[55vh] grid-room-loading mb-5 rounded-2xl overflow-hidden">
            <div className="w-full h-full bg-gray-200 row-span-2"></div>
            <div className="w-full h-full bg-gray-200"></div>
            <div className="w-full h-full bg-gray-200"></div>
            <div className="w-full h-full bg-gray-200"></div>
            <div className="w-full h-full bg-gray-200"></div>
          </div>
          <div className="w-full grid grid-room">
            <div className="w-full flex items-center mb-5 pr-10">
              <div className="flex flex-col w-full">
                <div className="w-3/4 lg:w-1/2 h-4 bg-gray-200 mb-2"></div>
                <div className="w-1/2 lg:w-1/4 h-4 bg-gray-200 "></div>
              </div>
              <div className="rounded-full h-[3.25rem] aspect-square w-[3.25rem] bg-gray-200"></div>
            </div>
            <div className="md:flex hidden flex-col items-start w-full">
              <div className="w-1/2 lg:w-1/3 h-7 bg-gray-200 mb-5"></div>
              <div className="w-full h-10 bg-gray-200 mb-2"></div>
            </div>
          </div>
        </main>
      )}

      {router.isReady && ready && <Footer />}
    </div>
  );
}

export default Index;
