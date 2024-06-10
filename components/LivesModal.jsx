import { XIcon } from "@heroicons/react/solid";
import { Modal, Slide, easing } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserDocContext } from "../services/context";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  LocationMarkerIcon,
  OfficeBuildingIcon,
  SearchCircleIcon,
  SearchIcon,
} from "@heroicons/react/outline";

export default function LivesModal({ showLivesModal, setShowLivesModal }) {
  const [lives, setLives] = useState("");
  const { userDoc, setUserDoc } = useContext(UserDocContext);
  const [sug, setSug] = useState(null);
  const [showSug, setShowSug] = useState(false);
  const [showOutline, setShowOutline] = useState(false);

  const handleClose = () => setShowLivesModal(false);

  const handleSave = () => {
    const sug1 = { ...sug };
    delete sug1.id;
    const userDoc1 = { ...userDoc };
    if (userDoc1.host) userDoc1.host.lives = sug1;
    else
      userDoc1.host = {
        lives: sug1,
      };
    setUserDoc(userDoc1);
    setShowLivesModal(false);
  };

  const handleDelete = () => {
    const userDoc1 = { ...userDoc };
    delete userDoc1?.host?.lives;
    setUserDoc(userDoc1);
    setShowLivesModal(false);
  };

  useEffect(() => {
    if (!showLivesModal) {
      if (userDoc?.host?.lives?.description) {
        setLives(userDoc.host?.lives?.description);
        setSug(userDoc?.host?.lives);
      } else {
        setLives("");
        setSug({});
      }
    }
  }, [showLivesModal, userDoc]);

  const handleChange = (value) => {
    setLives(value);
  };

  useEffect(() => {
    if (userDoc?.host?.lives?.description) {
      setLives(userDoc.host?.lives?.description);
      setSug(userDoc?.host?.lives);
    }
  }, [userDoc]);

  return (
    <Modal
      onClose={handleClose}
      className="modal flex justify-center items-center"
      open={showLivesModal}
    >
      <Slide
        timeout={300}
        easing={{ enter: easing.easeOut }}
        direction="up"
        in={showLivesModal}
      >
        <div className="modal-child2 scrollbar-hide">
          <div className="bg-white sticky top-0 p-2 px-4 pt-4">
            <div
              className="p-2 relative rounded-full hover:bg-neutral-100 w-8 cursor-pointer"
              onClick={() => handleClose()}
            >
              <XIcon className="h-4 text-gray-800 cursor-pointer" />
            </div>
          </div>
          <div className="px-7 flex flex-col">
            <div className="pb-5">
              <h1 className="text-2xl text-slate-900 font-[500] pb-2">
                Where do you live?
              </h1>
              <span className="font-[400] text-gray-600">
                Enter the name of your city.
              </span>
            </div>

            <PlacesAutocomplete
              value={lives}
              onChange={handleChange}
              onSelect={handleChange}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div
                  className={`bg-white ${
                    showSug ? "rounded-xl" : "rounded-full"
                  }`}
                >
                  <div className="rounded-full bg-gray-50 flex outline-none border outline items-center space-x-3 px-4 py-3 w-full">
                    <SearchIcon className="h-6" />
                    <input
                      {...getInputProps()}
                      type="text"
                      onFocus={() => {
                        setShowOutline(true);
                        setShowSug(true);
                      }}
                      onBlur={() => setShowOutline(false)}
                      className="text-slate-900 bg-neutral-50 font-[400] outline-none w-full placeholder:text-gray-500 placeholder:font-[400]"
                      placeholder={
                        sug?.description
                          ? sug.description
                          : "Enter your city's name"
                      }
                    />
                  </div>
                  <div className={suggestions.length > 1 ? "py-3" : ""}>
                    {suggestions.map((suggestion) => {
                      if (!_.includes(suggestion.types, "locality"))
                        return null;
                      return (
                        <div className="flex flex-col">
                          <div
                            key={suggestion.description}
                            className="flex hover:bg-neutral-100 items-center py-4 px-3 cursor-pointer rounded-lg"
                            {...getSuggestionItemProps(suggestion, {
                              onClick: () => setSug(suggestion),
                            })}
                          >
                            <p className="font-[400]">
                              {suggestion.description}
                            </p>
                          </div>
                          <span className="w-[95%] self-center block border-b"></span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <footer className="w-full gap-5 px-7 flex justify-end py-4 border-t mt-[2rem]">
            <button
              disabled={!userDoc?.host?.lives}
              onClick={() => handleDelete()}
              className={`font-[500] text-white rounded-lg px-6 py-3 ${
                !userDoc?.host?.lives ? "bg-gray-600" : "bg-rose-600"
              }`}
            >
              Delete
            </button>
            <button
              disabled={!sug?.description}
              onClick={() => handleSave()}
              className={`bg-[#222222] font-[500] text-white rounded-lg px-6 py-3 ${
                !sug?.description && "bg-gray-600"
              }`}
            >
              Save
            </button>
          </footer>
        </div>
      </Slide>
    </Modal>
  );
}
