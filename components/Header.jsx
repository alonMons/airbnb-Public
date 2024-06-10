import Image from "next/image";
import {
  SearchIcon,
  GlobeAltIcon,
  MenuIcon,
  UserCircleIcon,
  UsersIcon,
  XIcon,
  LocationMarkerIcon,
} from "@heroicons/react/solid";
import { useEffect, useState, useContext } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { useRouter } from "next/router";
import { easing, Fade, Modal, Slide } from "@mui/material";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import {
  UserContext,
  UserDocContext,
  showNavOutContext,
} from "../services/context";
import { auth } from "../services/firebase";
import PlacesAutocomplete from "react-places-autocomplete";
import { omitBy, isUndefined } from "lodash";
import date from "date-and-time";
import Link from "next/link";
import { isBefore, startOfToday } from "date-fns";

function Header({ placeholder }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [noOfGuests, setNoOfGuests] = useState(1);
  const [showNav, setShowNav] = useState(false);
  const { showNavOut, setShowNavOut } = useContext(showNavOutContext);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("signup");
  const { user, setUser } = useContext(UserContext);
  const { userDoc, setUserDoc } = useContext(UserDocContext);
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [sug, setSug] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (showNavOut != showNav) {
      setShowNav(showNavOut);
    }
  }, [showNavOut]);

  useEffect(() => {
    if (showNavOut != showNav) {
      setShowNavOut(showNav);
    }
  }, [showNav]);

  const handleAdressChange = (address) => {
    if (showCalendar) setShowCalendar(false);
    setAddress(address);
  };

  const handleAddressSelect = async (address) => {
    setAddress(address);
    setShowCalendar(true);
  };

  useEffect(() => {
    if (startDate && endDate && date.isSameDay(startDate, endDate)) {
      setEndDate(date.addDays(endDate, 1));
    }
    if (isBefore(startDate, startOfToday())) {
      setStartDate(startOfToday());
    }
    if (isBefore(endDate, startDate)) {
      const endDate1 = new Date(endDate);
      setEndDate(startDate);
      setStartDate(endDate1);
    }
  }, [startDate, endDate]);

  const search = () => {
    if (location && sug) {
      const doIt = router.pathname == "/search";
      if (!doIt) {
        router.push({
          pathname: "/search",
          query: {
            location: JSON.stringify(sug),
            noOfGuests,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            fullLocation: address,
          },
        });
      } else {
        const win = window.open(
          `/search?location=${JSON.stringify(
            sug
          )}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&noOfGuests=${noOfGuests}&fullLocation=${address}`
        );
      }
      resetState();
    }
  };

  const searchByEnter = ({ key }) => {
    if (key === "Enter") search();
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

  const resetState = () => {
    setNoOfGuests(1);
    setAddress("");
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleClose = () => {
    setShowModal(false);
    setType("");
  };

  const handleNavClick = (type1) => {
    setType(type1);
    setShowModal(true);
  };

  const becomeAHost = () => {
    if (user) router.push("/become-a-host");
    else {
      setType("login");
      setShowModal(true);
    }
  };

  const changeSug = (sug1) => {
    setSug(omitBy(sug1, isUndefined));
  };

  return (
    <div
      className={
        (router?.pathname == "/search" ||
        router?.pathname == "/manage-listings" ||
        router?.pathname == "/wishlist" ||
        router?.pathname == "/my-bookings"
          ? "fixed lg:sticky"
          : "sticky") + " top-0 z-[900] w-full"
      }
    >
      <header className="sticky top-0 items-start lg:items-center z-50 flex justify-between md:grid  md:grid-cols-3 bg-white shadow-md p-5 md:px-10 content-start">
        {/* Left */}
        <div
          onClick={() => router.push("/")}
          className="hidden relative md:flex flex-col items-start justify-start h-10 cursor-pointer"
        >
          <svg
            width="110"
            className="mt-1"
            fill="currentcolor"
            style={{ display: "block", color: "#ff5372", objectFit: "contain" }}
          >
            <path d="M29.24 22.68c-.16-.39-.31-.8-.47-1.15l-.74-1.67-.03-.03c-2.2-4.8-4.55-9.68-7.04-14.48l-.1-.2c-.25-.47-.5-.99-.76-1.47-.32-.57-.63-1.18-1.14-1.76a5.3 5.3 0 00-8.2 0c-.47.58-.82 1.19-1.14 1.76-.25.52-.5 1.03-.76 1.5l-.1.2c-2.45 4.8-4.84 9.68-7.04 14.48l-.06.06c-.22.52-.48 1.06-.73 1.64-.16.35-.32.73-.48 1.15a6.8 6.8 0 007.2 9.23 8.38 8.38 0 003.18-1.1c1.3-.73 2.55-1.79 3.95-3.32 1.4 1.53 2.68 2.59 3.95 3.33A8.38 8.38 0 0022.75 32a6.79 6.79 0 006.75-5.83 5.94 5.94 0 00-.26-3.5zm-14.36 1.66c-1.72-2.2-2.84-4.22-3.22-5.95a5.2 5.2 0 01-.1-1.96c.07-.51.26-.96.52-1.34.6-.87 1.65-1.41 2.8-1.41a3.3 3.3 0 012.8 1.4c.26.4.45.84.51 1.35.1.58.06 1.25-.1 1.96-.38 1.7-1.5 3.74-3.21 5.95zm12.74 1.48a4.76 4.76 0 01-2.9 3.75c-.76.32-1.6.41-2.42.32-.8-.1-1.6-.36-2.42-.84a15.64 15.64 0 01-3.63-3.1c2.1-2.6 3.37-4.97 3.85-7.08.23-1 .26-1.9.16-2.73a5.53 5.53 0 00-.86-2.2 5.36 5.36 0 00-4.49-2.28c-1.85 0-3.5.86-4.5 2.27a5.18 5.18 0 00-.85 2.21c-.13.84-.1 1.77.16 2.73.48 2.11 1.78 4.51 3.85 7.1a14.33 14.33 0 01-3.63 3.12c-.83.48-1.62.73-2.42.83a4.76 4.76 0 01-5.32-4.07c-.1-.8-.03-1.6.29-2.5.1-.32.25-.64.41-1.02.22-.52.48-1.06.73-1.6l.04-.07c2.16-4.77 4.52-9.64 6.97-14.41l.1-.2c.25-.48.5-.99.76-1.47.26-.51.54-1 .9-1.4a3.32 3.32 0 015.09 0c.35.4.64.89.9 1.4.25.48.5 1 .76 1.47l.1.2c2.44 4.77 4.8 9.64 7 14.41l.03.03c.26.52.48 1.1.73 1.6.16.39.32.7.42 1.03.19.9.29 1.7.19 2.5zM41.54 24.12a5.02 5.02 0 01-3.95-1.83 6.55 6.55 0 01-1.6-4.48 6.96 6.96 0 011.66-4.58 5.3 5.3 0 014.08-1.86 4.3 4.3 0 013.7 1.92l.1-1.57h2.92V23.8h-2.93l-.1-1.76a4.52 4.52 0 01-3.88 2.08zm.76-2.88c.58 0 1.09-.16 1.57-.45.44-.32.8-.74 1.08-1.25.25-.51.38-1.12.38-1.8a3.42 3.42 0 00-1.47-3.04 2.95 2.95 0 00-3.12 0c-.44.32-.8.74-1.08 1.25a4.01 4.01 0 00-.38 1.8 3.42 3.42 0 001.47 3.04c.47.29.98.45 1.55.45zM53.45 8.46c0 .35-.06.67-.22.93-.16.25-.38.48-.67.64-.29.16-.6.22-.92.22-.32 0-.64-.06-.93-.22a1.84 1.84 0 01-.67-.64 1.82 1.82 0 01-.22-.93c0-.36.07-.68.22-.93.16-.3.39-.48.67-.64.29-.16.6-.23.93-.23a1.84 1.84 0 011.6.86 2 2 0 01.21.94zm-3.4 15.3V11.7h3.18v12.08h-3.19zm11.68-8.9v.04c-.15-.07-.35-.1-.5-.13-.2-.04-.36-.04-.55-.04-.89 0-1.56.26-2 .8-.48.55-.7 1.32-.7 2.31v5.93h-3.19V11.69h2.93l.1 1.83c.32-.64.7-1.12 1.24-1.48a3.1 3.1 0 011.81-.5c.23 0 .45.02.64.06.1.03.16.03.22.06v3.2zm1.28 8.9V6.74h3.18v6.5c.45-.58.96-1.03 1.6-1.38a5.02 5.02 0 016.08 1.31 6.55 6.55 0 011.6 4.49 6.96 6.96 0 01-1.66 4.58 5.3 5.3 0 01-4.08 1.86 4.3 4.3 0 01-3.7-1.92l-.1 1.57-2.92.03zm6.15-2.52c.57 0 1.08-.16 1.56-.45.44-.32.8-.74 1.08-1.25.26-.51.38-1.12.38-1.8 0-.67-.12-1.28-.38-1.79a3.75 3.75 0 00-1.08-1.25 2.95 2.95 0 00-3.12 0c-.45.32-.8.74-1.09 1.25a4.01 4.01 0 00-.38 1.8 3.42 3.42 0 001.47 3.04c.47.29.98.45 1.56.45zm7.51 2.53V11.69h2.93l.1 1.57a3.96 3.96 0 013.54-1.89 4.1 4.1 0 013.82 2.44c.35.76.54 1.7.54 2.75v7.24h-3.19v-6.82c0-.84-.19-1.5-.57-1.99-.38-.48-.9-.74-1.56-.74-.48 0-.9.1-1.27.32-.35.23-.64.52-.86.93a2.7 2.7 0 00-.32 1.35v6.92h-3.16zm12.52 0V6.73h3.19v6.5a4.67 4.67 0 013.73-1.89 5.02 5.02 0 013.95 1.83 6.57 6.57 0 011.59 4.48 6.95 6.95 0 01-1.66 4.58 5.3 5.3 0 01-4.08 1.86 4.3 4.3 0 01-3.7-1.92l-.09 1.57-2.93.03zm6.18-2.53c.58 0 1.09-.16 1.56-.45.45-.32.8-.74 1.09-1.25.25-.51.38-1.12.38-1.8a3.42 3.42 0 00-1.47-3.04 2.95 2.95 0 00-3.12 0c-.44.32-.8.74-1.08 1.25a3.63 3.63 0 00-.38 1.8 3.42 3.42 0 001.47 3.04c.47.29.95.45 1.55.45z"></path>
          </svg>
        </div>

        {/* middle */}

        <div className="max-w-[60vw]">
          <PlacesAutocomplete
            value={address}
            onChange={handleAdressChange}
            onSelect={handleAddressSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <div className="flex px-2 items-center md:border-2 relative rounded-full py-2 md:shadow-sm overflow-x-hidden">
                  <input
                    className={`bg-transparent border-gray-300 py-3 max-w-full pl-4 outline-none border p-2 rounded-full md:border-none flex-grow font-[400] text-gray-900 text-md ${
                      placeholder
                        ? "placeholder-gray-500 placeholder:font-normal text-[0.8rem] md:text-[1rem] lg:[1.2rem]"
                        : "placeholder-gray-900 placeholder:font-[400] text-[0.8rem] md:text-[1rem] lg:[1.2rem]"
                    }`}
                    type="text"
                    placeholder={placeholder || "Start your Search"}
                    {...getInputProps({ onKeyDown: (e) => searchByEnter(e) })}
                    value={address}
                  />
                  <SearchIcon
                    onClick={address ? search : function () {}}
                    className="hidden display-search h-8 bg-[#ff385c] rounded-full p-2 text-white cursor-pointer md:mx-2"
                  />
                </div>
                {!showCalendar && (
                  <div className="w-[100vw] bg-white lg:w-full absolute left-0 ">
                    <div className="mt-2 lg:pl-[33%] border-b shadow-md pb-[1rem]">
                      {loading && <div className="py-2 px-4">Loading...</div>}
                      {!showCalendar &&
                        suggestions.map((suggestion) => {
                          if (!suggestion.types.includes("locality"))
                            return null;
                          return (
                            <div
                              key={suggestion.placeId}
                              className="cursor-pointer  w-[100vw] md:w-[29rem] flex space-x-3.5 items-center py-2 px-4 hover:bg-gray-100 rounded-lg"
                              {...getSuggestionItemProps(suggestion, {
                                onClick: () => changeSug(suggestion),
                              })}
                            >
                              <div className="bg-[#f1f1f1] p-3 rounded-lg border">
                                <LocationMarkerIcon className="h-5" />
                              </div>
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
        </div>

        {/* rigth */}
        <div className="flex items-center justify-end space-x-1 md:space-x-3 text-gray-500">
          <div
            onClick={becomeAHost}
            className="hover:bg-[#f7f7f7] cursor-pointer lg:p-2 rounded-full md:px-2 lg:px-4"
          >
            <p className="hidden md:inline text-[#222222] font-[500]">
              Become a host
            </p>
          </div>

          <div
            id="icons"
            className="grid grid-cols-2 gap-1 items-center justify-center border-2 p-2 rounded-full hover:shadow-md transition box-shadow duration-150"
          >
            <div
              onClick={() => {
                if (showNav) setShowNav(false);
                else setShowNav(true);
              }}
              className="flex justify-center w-full"
            >
              <MenuIcon className="h-6 cursor-pointer text-[#222222]" />
            </div>
            <img
              onClick={
                userDoc
                  ? () =>
                      router.push({
                        pathname: "/users/show",
                        query: {
                          shownUserId: userDoc?.id,
                        },
                      })
                  : () => {}
              }
              className="w-8 h-8 object-cover rounded-full overflow-hidden cursor-pointer"
              src={
                userDoc
                  ? userDoc?.avatar
                  : "https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/placeholder.jpg?alt=media&token=e007530f-1b35-4605-9312-db3af5ee536b"
              }
            />
          </div>
        </div>
      </header>

      {showCalendar && address && (
        <div className="w-[100vw] bg-white absolute flex justify-center border-b shadow-md">
          <div className="col-span-2 pb-2 md:pb-5 bg-white sm:col-span-3 flex flex-col items-center sm:items-start sm:mx-auto pt-3 sm:max-w-none">
            <DateRangePicker
              maxDate={date.addYears(new Date(), 1)}
              minDate={new Date()}
              rangeColors={["#FD5861"]}
              color="#ff385c"
              ranges={[selectionRange]}
              onChange={handleSelect}
            />
            <div className="flex items-center border-b pb-2 mb-4 w-[100%] ">
              <h2 className="text-2xl flex-grow">Number of Guests</h2>
              <UsersIcon className="h-5" />
              <input
                className="w-9 pl-2 text-lg outline-none text-red-400"
                type="number"
                min={1}
                value={noOfGuests}
                onChange={(e) => setNoOfGuests(e.target.value)}
              />
            </div>
            <div className="flex w-[100%] pb-2">
              <button onClick={resetState} className="flex-grow text-gray-500">
                Cancel
              </button>
              <button onClick={search} className="flex-grow text-red-400">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
      {showNav && (
        <div
          id="123"
          className="absolute z-[995] top-[7.5rem] right-[2rem] w-40 bg-white rounded-xl drop-shadow-lg upper-shadow shadow-xl"
        >
          {user ? (
            <ul className="list-none py-3 text-[16px]">
              <Link href={{ pathname: "/wishlist" }}>
                <li className="text-gray-900 font-[500] nav-link">WishList</li>
              </Link>
              <div className="w-full border-t my-2.5"></div>
              <Link href={{ pathname: "/my-bookings" }}>
                <li className="nav-link text-black font-[300]">My Bookings</li>
              </Link>
              {userDoc?.type != "user" && (
                <Link href={{ pathname: "/manage-listings" }}>
                  <li className="nav-link text-black font-[300]">
                    Manage Listings
                  </li>
                </Link>
              )}
              <li
                onClick={() => becomeAHost()}
                className="nav-link font-[300] text-black"
              >
                Host your home
              </li>

              <div className="w-full border-t my-2.5"></div>
              <li
                onClick={() => auth.signOut()}
                className="text-gray-900 font-[400] nav-link"
              >
                Log out
              </li>
            </ul>
          ) : (
            <ul className="list-none py-3 text-[16px]">
              <li
                onClick={() => handleNavClick("login")}
                className="text-gray-900 font-[400] nav-link"
              >
                Log in
              </li>
              <li
                onClick={() => handleNavClick("signup")}
                className="nav-link font-[300]"
              >
                Sign up
              </li>
              <div className="w-full border-t my-2.5"></div>
              <li onClick={() => becomeAHost()} className="nav-link font-[300]">
                Host your home
              </li>
            </ul>
          )}
        </div>
      )}
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
          <div className="modal-child scrollbar-hide">
            <header className="p-5 grid grid-cols-2 sm:grid-cols-3 border-b items-center">
              <XIcon onClick={handleClose} className="h-5 cursor-pointer" />
              <h2 className="font-[500] ml-3 whitespace-nowrap">
                Log in or sign up
              </h2>
            </header>
            <div className="pb-5 pt-3">
              {type === "login" ? (
                <Login setType={setType} handleClose={handleClose} />
              ) : (
                <SignUp setType={setType} handleClose={handleClose} />
              )}
            </div>
          </div>
        </Slide>
      </Modal>
    </div>
  );
}

export default Header;
