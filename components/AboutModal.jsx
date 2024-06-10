import { XIcon } from "@heroicons/react/solid";
import { Modal, Slide, easing } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserDocContext } from "../services/context";

export default function AboutModal({ showAboutModal, setShowAboutModal }) {
  const [about, setAbout] = useState("");
  const handleClose = () => setShowAboutModal(false);
  const { userDoc, setUserDoc } = useContext(UserDocContext);

  const handleSave = () => {
    const userDoc1 = { ...userDoc };
    if (userDoc1.host) userDoc1.host.about = about;
    else
      userDoc1.host = {
        about,
      };
    setUserDoc(userDoc1);
    setShowAboutModal(false);
  };

  useEffect(() => {
    if (!showAboutModal) {
      if (userDoc?.host?.about) setAbout(userDoc.host?.about);
      else setAbout("");
    }
  }, [showAboutModal, userDoc]);

  const handleChange = (value) => {
    if (value.length <= 450) {
      setAbout(value);
    }
  };

  return (
    <Modal
      onClose={handleClose}
      className="modal flex justify-center items-center"
      open={showAboutModal}
    >
      <Slide
        timeout={300}
        easing={{ enter: easing.easeOut }}
        direction="up"
        in={showAboutModal}
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
                About you
              </h1>
              <span className="font-[400] text-gray-600">
                Tell us a little bit about yourself, so your future hosts or
                guests can get to know you.
              </span>
            </div>
            <textarea
              rows={5}
              value={about}
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              maxLength={450}
              className="p-4 border rounded-lg outline-none placeholder:font-[400] placeholder:text-gray-500"
            />
            <div className="flex justify-end">
              <span className="text-gray-600 py-1 text-[0.85rem] font-[500]">
                {about.length}/450 characters
              </span>
            </div>
          </div>
          <footer className="w-full px-7 flex justify-end py-4 border-t mt-[2rem]">
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
