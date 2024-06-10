import React, { useContext, useState } from "react";
import HostMap from "./HostMap";
import { LocationMarkerIcon } from "@heroicons/react/solid";
import { OfficeBuildingIcon } from "@heroicons/react/solid";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { TypeContext } from "../../pages/become-a-host/[type]";
import { isUndefined, omitBy } from "lodash";

function Location() {
  const [showSug, setShowSug] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [address, setAddress] = useState("");
  const { coords, setCoords } = useContext(TypeContext);
  const { sug, setSug } = useContext(TypeContext);
  const { item, setItem } = useContext(TypeContext);

  const handleChange = (address) => setAddress(address);

  const handleSelect = async (address) => {
    const result = await geocodeByAddress(address);
    const ll = await getLatLng(result[0]);
    setAddress(address);
    setCoords(ll);
  };

  const changeSug = (sug1) => {
    setSug(omitBy(sug1, isUndefined));
  };

  return (
    <div className="md:h-screen h-[40rem] w-full md:absolute md:top-0">
      <div className="absolute z-[1000000000] top-[25%] left-1/2 translate-x-[-50%] w-2/3">
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div
              className={`bg-white ${showSug ? "rounded-xl" : "rounded-full"}`}
            >
              <div
                className={`${
                  showOutline
                    ? "outline-slate-900 outline-2"
                    : "outline-transparent"
                } ${
                  showSug ? "rounded-xl" : "rounded-full"
                } flex border-4 outline border-transparent items-center space-x-3 bg-white p-4 w-full`}
              >
                <LocationMarkerIcon className="h-7" />
                <input
                  {...getInputProps()}
                  type="text"
                  onFocus={() => {
                    setShowOutline(true);
                    setShowSug(true);
                  }}
                  onBlur={() => setShowOutline(false)}
                  className="text-slate-900 font-[400] outline-none w-full placeholder:text-gray-500 placeholder:font-[400]"
                  placeholder={
                    item ? item.location.sug.description : "Enter your address"
                  }
                />
              </div>
              <div className={suggestions.length > 1 ? "py-3" : ""}>
                {suggestions.map((suggestion) => {
                  if (!suggestion.types.includes("route")) return null;
                  return (
                    <div
                      key={suggestion.description}
                      className="flex hover:bg-gray-50 items-center space-x-4 py-1.5 px-3 cursor-pointer"
                      {...getSuggestionItemProps(suggestion, {
                        onClick: () => changeSug(suggestion),
                      })}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#f7f7f7] flex justify-center items-center">
                        <OfficeBuildingIcon className="h-5" />
                      </div>
                      <p className="font-[350]">{suggestion.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
      <HostMap coords={coords} setCoords={setCoords} />
    </div>
  );
}

export default Location;
