import { XIcon } from "@heroicons/react/solid";
import { Modal, Slide, easing } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserDocContext } from "../services/context";

export default function WorkModal({ showWorkModal, setShowWorkModal }) {
  const [work, setWork] = useState("");
  const handleClose = () => setShowWorkModal(false);
  const { userDoc, setUserDoc } = useContext(UserDocContext);

  const handleSave = () => {
    const userDoc1 = { ...userDoc };
    if (userDoc1.host) userDoc1.host.work = work;
    else
      userDoc1.host = {
        work,
      };
    setUserDoc(userDoc1);
    setShowWorkModal(false);
  };

  useEffect(() => {
    if (!showWorkModal) {
      if (userDoc?.host?.work) setWork(userDoc.host.work);
      else setWork("");
    }
  }, [showWorkModal, userDoc]);

  const handleChange = (value) => {
    if (value.length <= 25) {
      setWork(value);
    }
  };

  return (
    <Modal
      onClose={handleClose}
      className="modal flex justify-center items-center"
      open={showWorkModal}
    >
      <Slide
        timeout={300}
        easing={{ enter: easing.easeOut }}
        direction="up"
        in={showWorkModal}
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
                What do you do for work?
              </h1>
              <span className="font-[400] text-gray-600">
                Tell us what your profession is. If you don’t have a traditional
                job, tell us your life’s calling. Example: Nurse, parent to four
                kids, or retired surfer.
              </span>
            </div>
            <input
              value={work}
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              maxLength={25}
              placeholder="My work:"
              className="p-4 border rounded-lg outline-none placeholder:font-[400] placeholder:text-gray-500"
            />
            <div className="flex justify-end">
              <span className="text-gray-600 py-1 text-[0.85rem] font-[500]">
                {work.length}/25 characters
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
