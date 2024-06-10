import { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { geocodeByPlaceId, getLatLng } from "react-places-autocomplete";
import { getCenter } from "geolib";
import _ from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import Link from "next/link";
import date from "date-and-time";

function BookingsMap({ listings }) {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 8.5,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const viewport1 = { ...viewport };
    viewport1.latitude = listings[0]?.location?.lat
      ? listings[0].location.lat
      : 0;
    viewport1.longitude = listings[0]?.location?.long
      ? listings[0].location.long
      : 0;
    setViewport(viewport1);
  }, [listings]);

  const options = { maximumFractionDigits: 2 };

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/alonmons/ckyud6tzv001q14o0oxjdgk95"
      {...viewport}
      minZoom={3}
      maxZoom={17}
      onViewportChange={(nextViewPort) => {
        setViewport(nextViewPort);
      }}
      onClick={() => setSelectedPlace(null)}
      width="100%"
      height="100%"
      mapboxApiAccessToken={process.env.mapbox_key}
    >
      {listings?.map((item) => (
        <div key={item.id}>
          <Marker longitude={item.location.long} latitude={item.location.lat}>
            <Link
              href={{
                pathname: "/rooms",
                query: {
                  roomId: item.id,
                },
              }}
            >
              <a target="_blank">
                <p
                  className={`${
                    _.isEqual(item, selectedPlace) && "bg-[#222222] text-white"
                  } bg-white rounded-full px-2 py-1.5 text-sm font-[450] shadow-lg hover:scale-105 transition transform duration-150 cursor-pointer hover:z-65`}
                >
                  $
                  {Intl.NumberFormat("en-US", options).format(
                    date.subtract(item.endDate, item.startDate).toDays() *
                      item.price *
                      1.15
                  )}{" "}
                  / total
                </p>
              </a>
            </Link>
          </Marker>
        </div>
      ))}
    </ReactMapGL>
  );
}

export default BookingsMap;
