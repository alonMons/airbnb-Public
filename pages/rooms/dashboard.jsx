import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import { UserDocContext } from "../../services/context";
import { db } from "../../services/firebase";
import date from "date-and-time";
import { DateRangePicker } from "react-date-range";
import Head from "next/head";
import { truncate } from "lodash";
import Book from "../../components/Book";
import ReactSwitch from "react-switch";

export default function Dashboard() {
  const router = useRouter();
  const { roomId } = router.query;
  const { userDoc, setUserDoc } = useContext(UserDocContext);
  const [room, setRoom] = useState();
  const [ready, setReady] = useState(false);
  const [type, setType] = useState("analytics");

  useEffect(() => {
    if (room && room.booked?.length > 0) {
      let counter = room.booked.length;
      const booked1 = [];
      for (const bookedDate of room.booked) {
        if (new Date() < new Date(bookedDate.startDate)) {
          counter--;
          booked1.push(bookedDate);
        }
      }
      if (counter > 0) {
        const room1 = { ...room };
        room1.booked = booked1;
        db.collection("listings")
          .doc(room.id)
          .update(room1)
          .then(() => {
            setRoom(room1);
          });
      }

      setReady(true);
    }
    if (room && room.booked?.length == 0) {
      setReady(true);
    }
  }, [room]);

  const options = { maximumFractionDigits: 2 };

  useEffect(async () => {
    if (router.isReady) {
      const room1 = await db
        .collection("listings")
        .doc(roomId)
        .get()
        .then((item) => item.data());
      if (!room1) setReady(true);
      else {
        if (room1.booked.length > 0) {
          const booked1 = [...room1.booked].sort((a, b) => {
            if (new Date(a.startDate) > new Date(b.endDate)) {
              return 1;
            } else return -1;
          });
          room1.booked = booked1;
        }
        setRoom(room1);
      }
    }
  }, [router]);

  const handleChange = (value) => {
    const room1 = { ...room };
    room1.bookingDisabled = value;
    db.collection("listings")
      .doc(roomId)
      .update({
        bookingDisabled: value,
      })
      .then(() => {
        setRoom(room1);
      });
  };

  return (
    <div>
      <Head>
        <title>Listing Dashboard</title>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
      </Head>

      <Header />

      {ready ? (
        room ? (
          userDoc && room.userId == userDoc.id ? (
            <main className="p-10 px-12 w-full">
              <div className="grid md:grid-cols-2 gap-6">
                <img
                  className="w-full h-[25rem] object-cover rounded-2xl md:sticky md:top-[12.3rem] mb-[1rem] md:mb-[4rem]"
                  src={room.photos[0]}
                  alt=""
                />
                {type == "analytics" ? (
                  <div className="mb-[4rem] md:mb-0 relative">
                    <h1 className="text-3xl font-[400] text-slate-900 mb-[1rem] md:mb-0">
                      {room.title}
                    </h1>
                    <p className="my-2 pt-1">{room.description}</p>
                    <div className="py-2">
                      <h2 className="text-[1.35rem] mr-2 inline-block font-[400] text-slate-900">
                        Gross revenue:
                      </h2>
                      <span className="text-[1.15rem] text-slate-800">
                        {Intl.NumberFormat("en-US", options).format(
                          room?.revenue?.toFixed(2)
                        )}
                        $
                      </span>
                    </div>
                    <div className="pb-2 py-2">
                      <h2 className="text-[1.35rem] inline-block mr-2 font-[400] text-slate-900">
                        Next Booking:
                      </h2>
                      {room.booked.length > 0 && (
                        <h3 className="text-[1.15rem] text-slate-800 inline-block">
                          {date.format(
                            new Date(room.booked[0].startDate),
                            "ddd, MMM D, YYYY"
                          )}{" "}
                          To{" "}
                          {date.format(
                            new Date(room.booked[0].endDate),
                            "ddd, MMM D, YYYY"
                          )}
                        </h3>
                      )}
                    </div>
                    <div className="md:bottom-[3.6rem] mt-6 left-0 my-2 flex flex-col-reverse lg:flex-row gap-3  lg:justify-between w-full">
                      <button
                        onClick={() => setType("bookings")}
                        className="text-[1.15rem]  font-[400] text-slate-800 bg-neutral-100 py-2 px-4 rounded-[0.6rem]"
                      >
                        All Bookings
                      </button>
                      <div className="flex items-center gap-3">
                        <span className="text-[1.15rem] font-[400] text-slate-800">
                          {room?.bookingDisabled
                            ? "Enable booking"
                            : "Disable booking"}
                        </span>
                        <ReactSwitch
                          checkedIcon={false}
                          uncheckedIcon={false}
                          onColor="#F43F3F"
                          checked={room?.bookingDisabled}
                          onChange={(value) => handleChange(value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className=" relative">
                    <h1 className="block text-3xl mb-4 font-[400] text-slate-900">
                      Bookings:
                    </h1>
                    <ul className="pt-4">
                      {room?.booked?.map((item) => {
                        return <Book item={item} />;
                      })}
                    </ul>
                    <button
                      onClick={() => setType("analytics")}
                      className="text-[1.15rem] absolute top-0 translate-y-[-25%] right-0 my-2 font-[400] text-slate-800 bg-neutral-100 py-2 px-4 rounded-[0.6rem]"
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>
            </main>
          ) : (
            <main>
              <h1>
                <main className="max-w-[1140px] mx-auto py-48">
                  <h1
                    style={{ lineHeight: "3.15rem" }}
                    className="text-center block text-[1.75rem] text-slate-900 font-semibold"
                  >
                    Premission denied
                  </h1>
                </main>
              </h1>
            </main>
          )
        ) : (
          <main>
            <main className="max-w-[1140px] mx-auto py-48">
              <h1
                style={{ lineHeight: "3.15rem" }}
                className="text-center block text-[3.5rem] text-slate-900 font-semibold"
              >
                404
              </h1>
              <h2 className="text-center block text-lg text-gray-500 font-[300]">
                Room not found
              </h2>
            </main>
          </main>
        )
      ) : (
        <main className="p-10 grid md:grid-cols-2 gap-6">
          <div className="w-full h-[25rem] bg-gray-200 rounded-2xl"></div>
          <div className="relative">
            <div className="w-[70%] h-7 bg-gray-200"></div>
            <div className="w-[55%] h-6 mt-2 bg-gray-200"></div>
            <div className="py-4">
              <div className="w-[80%] h-3 mt-1 bg-gray-200"></div>
              <div className="w-[80%] h-3 mt-1 bg-gray-200"></div>
              <div className="w-[80%] h-3 mt-1 bg-gray-200"></div>
            </div>
            <div className="mt-4 w-1/3 h-5 mb-4 bg-gray-200"></div>
            <div className="mt-4 w-1/3 h-5 mb-3 bg-gray-200"></div>
            <button className="w-[10rem] h-10 absolute bottom-0 md:bottom-2 left-0 bg-gray-200 rounded-[0.6rem]"></button>
          </div>
        </main>
      )}

      {ready && <Footer />}
    </div>
  );
}
