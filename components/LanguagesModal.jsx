import { XIcon } from "@heroicons/react/solid";
import { Modal, Slide, easing } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserDocContext } from "../services/context";
import { SearchIcon } from "@heroicons/react/outline";
import Language from "./Language";

export default function LanguagesModal({
  showLanguagesModal,
  setShowLanguagesModal,
}) {
  const allLanguages = [
    "Afrikaans",
    "Albanian",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Basque",
    "Belarusian",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Burmese",
    "Catalan",
    "Chinese",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Estonian",
    "Filipino",
    "Finnish",
    "French",
    "Galician",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Haitian",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Kannada",
    "Khmer",
    "Korean",
    "Kyrgyz",
    "Lao",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Malay",
    "Maltese",
    "Norwegian",
    "Persian",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Serbian",
    "Sign",
    "Slovakian",
    "Slovenian",
    "Spanish",
    "Swahili",
    "Swahili",
    "Tagalog",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Vietnamese",
    "Xhosa",
    "Zulu",
  ];
  const [search, setSearch] = useState("");
  const [spokenLanguages, setSpokenLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const handleClose = () => setShowLanguagesModal(false);
  const { userDoc, setUserDoc } = useContext(UserDocContext);

  const handleSave = () => {
    const userDoc1 = { ...userDoc };
    if (userDoc1.host) userDoc1.host.spokenLanguages = spokenLanguages;
    else
      userDoc1.host = {
        spokenLanguages,
      };
    setUserDoc(userDoc1);
    setShowLanguagesModal(false);
  };

  useState(() => {
    setFilteredLanguages([...allLanguages]);
  }, []);

  useEffect(() => {
    if (!showLanguagesModal) {
      if (userDoc?.host?.school)
        setSpokenLanguages(userDoc.host?.spokenLanguages);
      else setSpokenLanguages([]);
      setSearch("");
    }
  }, [showLanguagesModal, userDoc]);

  useEffect(() => {
    if (userDoc?.host?.spokenLanguages) {
      setSpokenLanguages(userDoc?.host?.spokenLanguages);
    }
  }, [userDoc]);

  useEffect(() => {
    if (spokenLanguages) {
      const spokenLanguages1 = [...spokenLanguages];
      spokenLanguages.sort((a, b) => {
        if (a < b) return -1;
        else return 1;
      });
    }
  }, [spokenLanguages]);

  useEffect(() => {
    if (search) {
      const filteredLanguages1 = [];
      for (const language of allLanguages) {
        if (language.toLowerCase().indexOf(search.toLowerCase()) != -1) {
          filteredLanguages1.push(language);
        }
      }
      setFilteredLanguages(filteredLanguages1);
    } else setFilteredLanguages(allLanguages);
  }, [search]);

  return (
    <Modal
      onClose={handleClose}
      className="modal flex justify-center items-center"
      open={showLanguagesModal}
    >
      <Slide
        timeout={300}
        easing={{ enter: easing.easeOut }}
        direction="up"
        in={showLanguagesModal}
      >
        <div className="modal-child2 scrollbar-hide overflow-scroll">
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
                Languages you speak
              </h1>
            </div>
            <div className="rounded-full bg-neutral-50 flex outline-none border outline items-center space-x-3 px-4 py-3 w-full">
              <SearchIcon className="h-6" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="text-slate-900 bg-gray-50 font-[400] outline-none w-full placeholder:text-gray-500 placeholder:font-[400]"
                placeholder="Search for a language"
              />
            </div>
            <div>
              <ul className="pt-2">
                {allLanguages.map((language, index) => (
                  <div
                    className={
                      filteredLanguages.indexOf(language) == -1 && "hidden"
                    }
                  >
                    <Language
                      language={language}
                      filteredLanguages={filteredLanguages}
                      spokenLanguages={spokenLanguages}
                      setSpokenLanguages={setSpokenLanguages}
                    />
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <footer className="w-full px-7 flex justify-end py-4 border-t sticky bg-white bottom-0">
            <button
              onClick={() => handleSave()}
              className="bg-[#222222] font-[500] text-white rounded-lg px-6 py-3"
            >
              Save
            </button>
          </footer>
        </div>
      </Slide>
    </Modal>
  );
}
