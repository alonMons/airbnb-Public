import { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import _ from "lodash";
import { OfficeBuildingIcon } from "@heroicons/react/solid";
import "mapbox-gl/dist/mapbox-gl.css";

function HostMap({ coords, setCoords }) {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 11,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Sorry cant locate from this browser");
    }
  };

  const success = (postion) => {
    const viewport1 = { ...viewport };
    viewport1.latitude = postion.coords.latitude;
    viewport1.longitude = postion.coords.longitude;
    setViewport(viewport1);
  };

  const error = () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((res) => {
        if (res.state === "denied") {
          alert("Please enable location premissions");
          const viewport1 = { ...viewport };
          viewport1.latitude = 34.052235;
          viewport1.longitude = -118.243683;
          setViewport(viewport1);
        }
      });
    } else {
      alert("unable to access your location");
      const viewport1 = { ...viewport };
      viewport1.latitude = 34.052235;
      viewport1.longitude = -118.243683;
      setViewport(viewport1);
    }
  };

  useEffect(() => {
    if (coords) {
      const viewport1 = { ...viewport };
      viewport1.latitude = coords.lat;
      viewport1.longitude = coords.lng;
      viewport1.zoom = 16;
      setViewport(viewport1);
    } else {
      getLocation();
    }
  }, [coords]);

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/alonmons/ckyud6tzv001q14o0oxjdgk95"
      {...viewport}
      onViewportChange={
        coords ? (nextViewPort) => setViewport(nextViewPort) : function () {}
      }
      onClick={() => setSelectedPlace(null)}
      width="100%"
      height="100%"
      mapboxApiAccessToken={process.env.mapbox_key}
    >
      {coords && (
        <Marker
          draggable
          onDragEnd={(e) => {
            let coords1 = {};
            coords1.lng = e.lngLat[0];
            coords1.lat = e.lngLat[1];
            setCoords(coords1);
          }}
          latitude={coords.lat}
          longitude={coords.lng}
        >
          <div className="relative w-10 h-10 rounded-full translate-x-[-50%] translate-y-[-50%] bg-[#222222] flex justify-center items-center">
            <div className="h-5 w-5 bg-[#222222] absolute -bottom-1 rotate-45 z-1"></div>
            <OfficeBuildingIcon className="h-5 text-white z-5 absolute" />
          </div>
        </Marker>
      )}
    </ReactMapGL>
  );
}

export default HostMap;
