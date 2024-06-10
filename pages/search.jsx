import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import _ from "lodash";
import { format } from "date-fns";
import InfoCard from "../components/InfoCard";
import { db } from "../services/firebase";
import Map from "../components/Map";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getDistance } from "geolib";
import Geocode from "react-geocode";
import date from "date-and-time";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import BlankInfoCard from "../components/BlankInfoCard";

function Search({ searchResults: allSearchResults1 }) {
  const router = useRouter();
  const {
    location: stringLocation,
    noOfGuests: originNoOfGuests,
    startDate: originStartDate,
    endDate: originEndDate,
  } = router.query;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [location, setLocation] = useState({});
  const [title, setTitle] = useState("");
  const [sortType, setSortType] = useState("asc");
  const [noOfGuests, setNoOfGuests] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [allSearchResults, setAllSearchResults] = useState(allSearchResults1);
  const [viewportOut, setViewportOut] = useState();
  const [datedSearchResults, setDatedSearchResults] = useState([]);
  const [filter, setFilter] = useState({ path: "price", order: "asc" });
  const [mapReady, setMapReady] = useState(false);
  const [listingReady, setListingReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      if (originEndDate && originStartDate) {
        setStartDate(new Date(originStartDate));
        setEndDate(new Date(originEndDate));
      } else {
        setStartDate(new Date());
        setEndDate(date.addDays(new Date(), 1));
      }

      if (originNoOfGuests) setNoOfGuests(Number(originNoOfGuests));
      else setNoOfGuests(1);
    }
  }, [router.isReady, originEndDate, originStartDate, originNoOfGuests]);

  const formatedStartDate = format(
    new Date(startDate || new Date()),
    "dd MMMM yyyy"
  );
  const formatedEndDate = format(
    new Date(endDate || new Date()),
    "dd MMMM yyyy"
  );
  const range = `${formatedStartDate} - ${formatedEndDate}`;

  useEffect(() => {
    if (router.isReady && stringLocation) {
      setLocation(JSON.parse(stringLocation));
    }
  }, [stringLocation, router]);

  useEffect(() => {
    Geocode.setApiKey(process.env.mapApiKey);
    db.collection("listings").onSnapshot((docs) =>
      setAllSearchResults(docs.docs.map((doc) => doc.data()))
    );
  }, []);

  useEffect(() => {
    if (
      viewportOut &&
      !(viewportOut.longitude == 0 && viewportOut.latitude == 0) &&
      mapReady &&
      datedSearchResults?.length > 0
    ) {
      const datedSearchResults1 = [...datedSearchResults];
      const searchResults1 = datedSearchResults1.filter((item) => {
        item.distance = getDistance(
          { longitude: item.location.long, latitude: item.location.lat },
          { longitude: viewportOut.longitude, latitude: viewportOut.latitude }
        );
        const zoom = viewportOut?.zoom;
        if (zoom < 9) return item.distance < 45000;
        else if (zoom < 10) return item.distance < 20000;
        else if (zoom < 11) return item.distance < 12500;
        else if (zoom < 12) return item.distance < 7500;
        else return item.distance < 5000;
      });
      searchResults1.sort((a, b) => {
        if (a.distance > b.distance) return 1;
        else return -1;
      });
      setSearchResults(searchResults1);
    }
  }, [mapReady, datedSearchResults, viewportOut]);

  useEffect(() => {
    if (allSearchResults?.length > 0 && noOfGuests && startDate && endDate) {
      const searchResults1 = allSearchResults.filter((item) => {
        const disabledDates = [];
        for (const bookedDate of item.booked) {
          for (
            let i = 0;
            date.addDays(new Date(bookedDate.startDate), i) <=
            new Date(bookedDate.endDate);
            i++
          ) {
            disabledDates.push(date.addDays(new Date(bookedDate.startDate), i));
          }
        }
        disabledDates.push(date.addDays(new Date(), -1));
        disabledDates.push(date.addDays(date.addYears(new Date(), 1), 1));
        for (const dis1 of disabledDates) {
          for (const dis2 of disabledDates) {
            const dis3 = date.addDays(dis2, 2);
            if (date.isSameDay(dis1, dis3)) {
              const dis4 = date.addDays(dis2, 1);
              let included = false;
              for (const dis5 of disabledDates) {
                if (date.isSameDay(dis5, dis4)) {
                  included = true;
                }
              }
              if (!included) {
                disabledDates.push(dis4);
              }
            }
          }
        }
        const bookingDates = [];
        for (
          let j = 0;
          date.addDays(new Date(startDate), j) <= new Date(new Date(endDate));
          j++
        ) {
          bookingDates.push(date.addDays(new Date(startDate), j));
        }
        for (let bookDate of bookingDates) {
          for (let disabledDate of disabledDates) {
            if (date.isSameDay(disabledDate, bookDate)) {
              return false;
            }
          }
        }

        if (item.floorPlan.guests < noOfGuests) return false;
        return true;
      });
      setDatedSearchResults(searchResults1);
    }
  }, [allSearchResults, noOfGuests, startDate, endDate]);

  useEffect(() => {
    if (!mapReady) setListingReady(false);
  }, [mapReady]);

  useEffect(() => {
    if (viewportOut && mapReady) {
      console.log(1);
      Geocode.fromLatLng(
        String(viewportOut.latitude),
        String(viewportOut.longitude)
      )
        .then((response) => {
          const titles = response?.results[0].address_components;
          for (let i = 0; i < titles?.length; i++) {
            if (_.includes(titles[i].types, "locality")) {
              setTitle(titles[i].short_name);
            }
          }
          setListingReady(true);
        })
        .catch((e) => {
          console.log(e);
          setListingReady(true);
        });
    }
  }, [mapReady, router.query]);

  useEffect(() => {
    if (location?.formattedSuggestion?.mainText) {
      setTitle(location?.formattedSuggestion?.mainText);
    }
  }, [location]);

  useEffect(() => {
    const searchResults1 = _.orderBy(
      searchResults,
      [filter.path],
      [filter.order]
    );
    setSearchResults(searchResults1);
  }, [filter]);

  const handleSort = (type) => {
    const filter1 = { ...filter };
    filter1.path = type;
    filter1.order = filter1.order === "asc" ? "desc" : "asc";
    setFilter(filter1);
  };

  return (
    <div>
      <Head>
        <title>
          {title ? `${title} | ${range} | ${noOfGuests} guests` : "Search"}
        </title>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
      </Head>

      <Header placeholder={`${title} | ${range} | ${noOfGuests} guests`} />

      <section className="flex lg:hidden h-[65vh] vw-[100vw] fixed w-full top-0 z-[1]">
        <Map
          searchResults={searchResults}
          location={location}
          setViewportOut={setViewportOut}
          viewportOut={viewportOut}
          endDate={endDate}
          startDate={startDate}
          noOfGuests={Number(noOfGuests)}
          setReady={setMapReady}
        />
      </section>

      <main className="flex grid-search z-[40]">
        {listingReady ? (
          <section className="flex-grow absolute lg:pt-10 lg:static top-[57vh] xl:pt-8 px-6 bg-white rounded-t-[1.7rem] z-[40]">
            <div className="w-full flex justify-center pt-2 lg:hidden mb-6">
              <span className="border-t-2 border-gray-500 p-1 w-[30%] fill-gray-500 h-[0.5px]"></span>
            </div>
            <ArrowLeftIcon
              onClick={() => router.back()}
              className="h-6 cursor-pointer mb-9"
            />
            <p className="text-xs overflow-hidden">
              {searchResults.length} Stays - {range} - for
              {noOfGuests == 1 ? " one guest" : ` ${noOfGuests} guests`}
            </p>
            <h1 className="text-3xl font-[400] mt-2">
              Stays in <span className="capitalize">{title}</span>
            </h1>

            <div className="xl:py-5 lg:py-3 lg:pt-4 mt-1 py-1 flex items-center mb-5 sm:space-x-3 text-gray-800 flex-wrap max-h-[150px] overflow-hidden">
              <p
                className="button shadow-md"
                onClick={() => handleSort("price")}
              >
                Price
              </p>
            </div>

            <div className="flex flex-col max-w-full pb-28">
              {listingReady &&
                (searchResults.length > 0 ? (
                  searchResults?.map((item) => (
                    <InfoCard
                      key={item.id}
                      item={item}
                      originEndDate={originEndDate}
                      originStartDate={originStartDate}
                      originNoOfGuests={noOfGuests}
                    />
                  ))
                ) : (
                  <div className="mx-auto pt-20 pb-36 text-4xl text-slate-900 font-[400]">
                    Couldn't find listings
                  </div>
                ))}
            </div>
          </section>
        ) : (
          <section className="flex-grow w-full absolute lg:pt-10 lg:static top-[57vh] xl:pt-8 px-6 bg-white rounded-t-[1.7rem] z-[40]">
            <div className="w-full flex justify-center pt-2 lg:hidden mb-6">
              <span className="border-t-2 border-gray-500 p-1 w-[30%] fill-gray-500 h-[0.5px]"></span>
            </div>
            <div className="mt-[4.8rem] w-full lg:w-[60%] h-4 bg-gray-200 mb-3"></div>
            <div className="w-3/4 lg:w-1/2 h-9 bg-gray-200 "></div>
            <div className="my-6 mb-3 w-[4rem] bg-gray-200 rounded-full h-9"></div>
            <div className="py-3 flex flex-col gap-5 pb-28">
              {searchResults?.length > 0
                ? searchResults.map((item) => <BlankInfoCard />)
                : [1, 2, 3].map((item) => <BlankInfoCard />)}
            </div>
          </section>
        )}

        <section className="hidden lg:inline-flex height-map sticky top-[6.8rem]">
          <Map
            setReady={setMapReady}
            searchResults={searchResults}
            location={location}
            setViewportOut={setViewportOut}
            viewportOut={viewportOut}
            endDate={endDate}
            startDate={startDate}
            noOfGuests={Number(noOfGuests)}
          />
        </section>
      </main>
    </div>
  );
}

export default Search;

export const getStaticProps = async () => {
  const searchResults1 = await db.collection("listings").get();
  const searchResults = searchResults1.docs.map((doc) => doc.data());

  return {
    props: {
      searchResults,
    },
  };
};
