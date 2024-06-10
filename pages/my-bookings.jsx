import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserContext, UserDocContext } from "../services/context";
import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import date from "date-and-time";
import { auth, db } from "../services/firebase";
import BlankInfoCard from "../components/BlankInfoCard";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import BookingsMap from "../components/BookingsMap";
import Link from "next/link";

function MyBookings() {
  const { userDoc, setUserDoc } = useContext(UserDocContext);
  const { user, setUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [ready, setReady] = useState(false);
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState({ path: "total", order: "asc" });
  const router = useRouter();

  useEffect(async () => {
    if (bookings.length > 0 || listings?.length > 0) {
      const listings1 = [];
      for (const item of bookings) {
        const room = await db
          .collection("listings")
          .doc(item.room)
          .get()
          .then((item) => item.data());
        room.startDate = new Date(item.startDate);
        room.endDate = new Date(item.endDate);
        room.total = Number(
          (
            date.subtract(room.endDate, room.startDate).toDays() *
            room.price *
            1.15
          ).toFixed(2)
        );
        if (date.addDays(room.endDate, 7) < new Date()) {
          handleDelete(room);
        } else listings1.push(room);
      }
      const listings2 = listings1.sort((a, b) => {
        if (new Date(a.startDate) > new Date(b.startDate)) {
          return 1;
        } else return -1;
      });
      setListings(listings2);
      setReady(true);
    }
  }, [bookings]);

  useEffect(async () => {
    if (userDoc?.myBookings?.length >= 0) {
      const bookings1 = [];
      for (const booking of userDoc?.myBookings) {
        const room = await db
          .collection("listings")
          .doc(booking.room)
          .get()
          .then((item) => item.data());
        if (room) bookings1.push(booking);
        else {
          const index = _.findIndex(userDoc?.myBookings, booking);
          const userDoc1 = { ...userDoc };
          const myBookings1 = [...userDoc1?.myBookings];
          myBookings1.splice(index, 1);
          userDoc1.myBookings = myBookings1;
          setUserDoc(userDoc1);
        }
      }
      setBookings(bookings1);
    }
    if (userDoc?.myBookings?.length == 0) setReady(true);
  }, [userDoc]);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
      } else {
        setReady(true);
      }
    });
  }, []);

  const handleDelete = (item) => {
    if (item.startDate > new Date()) {
      const booked1 = [...item.booked];
      let index = -1;
      for (const i = 0; i < booked1.length; i++) {
        if (
          booked1[i].byUser == userDoc.id &&
          date.isSameDay(new Date(booked1[i].startDate), item.startDate) &&
          date.isSameDay(new Date(booked1[i].endDate), item.endDate)
        ) {
          index = i;
        }
      }
      const revenue1 = Number((item.revenue - item.total / 1.15).toFixed(2));
      console.log(item);
      console.log(revenue1);

      booked1.splice(index, 1);
      db.collection("listings")
        .doc(item.id)
        .update({
          booked: booked1,
          revenue: revenue1,
        })
        .then(() => {
          const userDoc1 = { ...userDoc };
          const myBookings1 = [...userDoc1.myBookings];
          let index1 = -1;
          for (const i = 0; i < myBookings1.length; i++) {
            if (
              myBookings1[i].room == item.id &&
              date.isSameDay(
                new Date(myBookings1[i].startDate),
                item.startDate
              ) &&
              date.isSameDay(new Date(myBookings1[i].endDate), item.endDate)
            ) {
              index = i;
            }
          }
          myBookings1.splice(index, 1);
          userDoc1.myBookings = myBookings1;
          setUserDoc(userDoc1);
        });
    }
  };

  useEffect(() => {
    if (listings) {
      const listings1 = _.orderBy(listings, [filter.path], [filter.order]);
      setListings(listings1);
    }
  }, [filter]);

  const handleSort = (type) => {
    const filter1 = { ...filter };
    filter1.path = type;
    filter1.order = filter1.order === "asc" ? "desc" : "asc";
    setFilter(filter1);
  };

  const options = { maximumFractionDigits: 2 };

  return (
    <div>
      <Head>
        <title>My Bookings</title>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
      </Head>

      <Header />

      {ready ? (
        user ? (
          listings?.length > 0 ? (
            <main className="">
              <section className="flex lg:hidden h-[100vh] fixed w-full top-0 z-[0]">
                <BookingsMap listings={listings} />
              </section>
              <main className="grid lg:grid-cols-3 z-[40] bg-white">
                <section className="flex-grow absolute lg:col-span-2 lg:pt-8 lg:static top-[57vh]  w-[100vw] sm:w-full xl:pt-6 px-6 bg-white rounded-t-[1.7rem] z-[40]">
                  <div className="w-full flex justify-center pt-2 lg:hidden mb-6">
                    <span className="border-t-2 border-gray-500 p-1 w-[30%] fill-gray-500 h-[0.5px]"></span>
                  </div>
                  <ArrowLeftIcon
                    onClick={() => router.back()}
                    className="h-6 cursor-pointer mb-6"
                  />
                  <h2 className="block text-3xl font-[400] text-[#222222] mt-4 mb-2">
                    Bookings
                  </h2>
                  <div className="py-5 inline-flex items-center mb-5 sm:space-x-3 sm:m-0 sm:p-4 sm:pb-6 text-gray-800 flex-wrap max-h-[150px] overflow-hidden">
                    <p
                      onClick={() => handleSort("total")}
                      className="button font-[300]"
                    >
                      Price
                    </p>
                    <p
                      onClick={() => handleSort("endDate")}
                      className="button font-[300]"
                    >
                      Date
                    </p>
                  </div>
                  <div className="flex flex-col max-w-full gap-4 py-2 z-[40] mb-10">
                    {listings?.map((item) => {
                      return (
                        <div
                          key={
                            item.id +
                            item.startDate.toISOString() +
                            item.endDate.toISOString()
                          }
                          className="flex p-5 flex-col z-[40] bg-white max-w-full space-y-1 justify-center sm:justify-start sm:flex-row sm:items-center rounded-2xl p-4 border hover:opacity-95 hover:scale-[1.01] hover:shadow-lg transition-all duration-200 ease-out first:border-t last:mb-5"
                        >
                          <Link
                            href={{
                              pathname: "rooms",
                              query: {
                                roomId: item.id,
                              },
                            }}
                          >
                            <a target="_blank">
                              <img
                                src={item?.photos[0] ? item.photos[0] : null}
                                className="rounded-2xl cursor-pointer object-cover relative h-52 w-full mb-4 sm:mb-0 sm:h-40 sm:w-64 md:h-52 md:w-80 flex-shrink-0"
                              />
                            </a>
                          </Link>
                          <div className="flex flex-col flex-grow pl-5">
                            <div className="flex justify-between items-center">
                              <p className="text-slate-600 py-1 font-[150]">
                                {item.location.sug?.terms[0]?.value}
                              </p>
                            </div>
                            <h4 className="text-xl">{item.title}</h4>
                            <div className="border-b w-10 pt-2" />
                            <p className="pt-2 text-[1.05rem] font-[300] text-gray-700 flex-grow sm:mb-5 pb-4">
                              {date.format(item.startDate, "MMM D, YYYY")} To{" "}
                              {date.format(item.endDate, "MMM D, YYYY")}
                            </p>
                            <div className="flex justify-between items-center cancel-button-div">
                              <button
                                disabled={item.startDate < new Date()}
                                onClick={() => handleDelete(item)}
                                className={`${
                                  item.startDate < new Date()
                                    ? "cursor-not-allowed bg-slate-600"
                                    : "bg-rose-700"
                                } font-[400]  text-white py-[0.4rem] px-4 sm:px-8 rounded-xl`}
                              >
                                Cancel
                              </button>
                              <div className="flex flex-col">
                                <p className="text-lg lg:text-2xl font-[400] pb-2 mr-2">
                                  $
                                  {Intl.NumberFormat("en-US", options).format(
                                    date
                                      .subtract(item.endDate, item.startDate)
                                      .toDays() *
                                      item.price *
                                      1.15
                                  )}{" "}
                                  / total
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
                <section className="hidden lg:inline-flex h-[85vh] sticky top-[7.1rem]">
                  <BookingsMap listings={listings} />
                </section>
              </main>
            </main>
          ) : (
            <main className="flex flex-col space-y-10 justify-center items-center py-48 px-4">
              <h1 className="text-2xl font-[500] text-[#222222]">
                You have no Bookings.
              </h1>
            </main>
          )
        ) : (
          <main className="flex justify-center items-center py-48 px-4">
            <h1 className="text-2xl font-[500] text-[#222222]">
              You have to Login to see your bookings.
            </h1>
          </main>
        )
      ) : (
        <main className="grid grid-room h-[80vh]">
          <div className="w-full h-full pt-16 px-6">
            <div className="w-1/3 lg:w-1/4 h-8 bg-gray-200"></div>
            <div className="w-1/2 lg:w-1/3 h-6 mt-2 bg-gray-200"></div>
            <div className="w-full flex flex-col gap-5 mt-7">
              <BlankInfoCard />
              <BlankInfoCard />
              <BlankInfoCard />
            </div>
          </div>
          <div className="w-full h-full hidden lg:flex bg-gray-200"></div>
        </main>
      )}

      {ready && (
        <footer className="hidden lg:flex">
          <Footer />
        </footer>
      )}
    </div>
  );
}
export default MyBookings;
