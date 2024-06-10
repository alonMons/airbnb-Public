import { XIcon } from "@heroicons/react/solid";
import { Modal, Slide, easing } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserDocContext } from "../services/context";

export default function NameModal({ showNameModal, setShowNameModal }) {
  const [name, setName] = useState("");
  const handleClose = () => setShowNameModal(false);
  const { userDoc, setUserDoc } = useContext(UserDocContext);

  const handleSave = () => {
    const userDoc1 = { ...userDoc };
    userDoc1.name = name;
    setUserDoc(userDoc1);
    setShowNameModal(false);
  };

  useEffect(() => {
    if (!showNameModal) {
      if (userDoc?.name) setName(userDoc.name);
      else setName("");
    }
  }, [showNameModal, userDoc]);

  const handleChange = (value) => {
    if (value.length <= 25) {
      setName(value);
    }
  };

  return (
    <Modal
      onClose={handleClose}
      className="modal flex justify-center items-center"
      open={showNameModal}
    >
      <Slide
        timeout={300}
        easing={{ enter: easing.easeOut }}
        direction="up"
        in={showNameModal}
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
                How would you like to be called?
              </h1>
            </div>
            <input
              value={name}
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              maxLength={25}
              placeholder="Where I went to name:"
              className="p-4 border rounded-lg outline-none placeholder:font-[250] placeholder:text-gray-500"
            />
            <div className="flex justify-end">
              <span className="text-gray-600 py-1 text-[0.85rem] font-[500]">
                {name.length}/25 characters
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
