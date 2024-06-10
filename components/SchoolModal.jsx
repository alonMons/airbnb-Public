import { XIcon } from "@heroicons/react/solid";
import { Modal, Slide, easing } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserDocContext } from "../services/context";

export default function SchoolModal({ showSchoolModal, setShowSchoolModal }) {
  const [school, setSchool] = useState("");
  const handleClose = () => setShowSchoolModal(false);
  const { userDoc, setUserDoc } = useContext(UserDocContext);

  const handleSave = () => {
    const userDoc1 = { ...userDoc };
    if (userDoc1.host) userDoc1.host.school = school;
    else
      userDoc1.host = {
        school,
      };
    setUserDoc(userDoc1);
    setShowSchoolModal(false);
  };

  useEffect(() => {
    if (!showSchoolModal) {
      if (userDoc?.host?.school) setSchool(userDoc.host?.school);
      else setSchool("");
    }
  }, [showSchoolModal, userDoc]);

  const handleChange = (value) => {
    if (value.length <= 40) {
      setSchool(value);
    }
  };

  return (
    <Modal
      onClose={handleClose}
      className="modal flex justify-center items-center"
      open={showSchoolModal}
    >
      <Slide
        timeout={300}
        easing={{ enter: easing.easeOut }}
        direction="up"
        in={showSchoolModal}
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
                Where did you go to school?
              </h1>
              <span className="font-[400] text-gray-600">
                Whether it’s home school, high school, or trade school, name the
                school that made you who you are.
              </span>
            </div>
            <input
              value={school}
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              maxLength={40}
              placeholder="Where I went to school:"
              className="p-4 border rounded-lg outline-none placeholder:font-[400] placeholder:text-gray-500"
            />
            <div className="flex justify-end">
              <span className="text-gray-600 py-1 text-[0.85rem] font-[500]">
                {school.length}/40 characters
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
