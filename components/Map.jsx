import { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { geocodeByPlaceId, getLatLng } from "react-places-autocomplete";
import { getCenter } from "geolib";
import _ from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import Link from "next/link";

function Map({
  searchResults,
  location,
  fromWishlist,
  setViewportOut,
  viewportOut,
  endDate,
  startDate,
  noOfGuests,
  setReady,
}) {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 8.5,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const router = useRouter();
  const [placeId, setPlaceId] = useState("");
  const [did, setDid] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(async () => {
    if (fromWishlist) {
      const viewport1 = { ...viewport };
      viewport1.latitude = searchResults[0].location.lat;
      viewport1.longitude = searchResults[0].location.long;

      setViewport(viewport1);
      if (setViewportOut) {
        setViewportOut(viewport1);
      }
    } else {
      if (location.placeId && !did) {
        setPlaceId(location.placeId);
        const viewport1 = { ...viewport };
        const place = await geocodeByPlaceId(location.placeId);
        const { lat, lng } = await getLatLng(place[0]);
        viewport1.latitude = lat;
        viewport1.longitude = lng;
        viewport1.zoom = 12;
        setViewport(viewport1);
        if (setViewportOut) {
          setViewportOut(viewport1);
        }
        setDid(true);
      }
    }
  }, [searchResults, location]);

  const options = { maximumFractionDigits: 2 };

  useEffect(() => {
    if (viewportOut) setViewport(viewportOut);
  }, [viewportOut]);

  return (
    <ReactMapGL
      onLoad={() => {
        setLoad(true);
        if (setReady) setReady(true);
      }}
      onInteractionStateChange={(e) => {
        if (setReady && load) {
          if (e.isDragging) setReady(false);
          else setReady(true);
        }
      }}
      mapStyle="mapbox://styles/alonmons/ckyud6tzv001q14o0oxjdgk95"
      {...viewport}
      minZoom={router.pathname == "/search" ? 8 : 3}
      maxZoom={17}
      onViewportChange={(nextViewPort) => {
        setViewport(nextViewPort);
        if (setViewportOut) {
          setViewportOut(nextViewPort);
        }
      }}
      onClick={() => setSelectedPlace(null)}
      width="100%"
      height="100%"
      mapboxApiAccessToken={process.env.mapbox_key}
    >
      {searchResults?.map((item) => (
        <div key={item.id}>
          <Marker longitude={item.location.long} latitude={item.location.lat}>
            <Link
              href={{
                pathname: "/rooms",
                query: {
                  roomId: item.id,
                  originEndDate: endDate?.toISOString(),
                  originStartDate: startDate?.toISOString(),
                  originNoOfGuests: noOfGuests,
                },
              }}
            >
              <a target="_blank">
                <p
                  className={`${
                    _.isEqual(item, selectedPlace) && "bg-[#222222] text-white"
                  } bg-white rounded-full px-2 py-1.5 text-sm font-[450] shadow-lg hover:scale-105 transition transform duration-150 cursor-pointer hover:z-65`}
                >
                  ${Intl.NumberFormat("en-US", options).format(item.price)} /
                  night
                </p>
              </a>
            </Link>
          </Marker>
        </div>
      ))}
    </ReactMapGL>
  );
}

export default Map;
