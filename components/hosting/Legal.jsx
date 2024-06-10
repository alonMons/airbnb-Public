import React, { useContext, useState } from "react";
import _ from "lodash";
import { TypeContext } from "../../pages/become-a-host/[type]";

function Legal({ opacity }) {
  const { hostType, setHostType } = useContext(TypeContext);
  const { dangerousThings, setDangerousThings } = useContext(TypeContext);

  const changeHostType = (type) => {
    if (opacity !== 0.5) {
      if (type === "individual") {
        if (hostType !== "individual") setHostType("individual");
      }
      if (type === "business") {
        if (hostType !== "bussiness") setHostType("bussiness");
      } else {
        setHostType(type);
      }
    }
  };

  const changeDangerousThings = (thing) => {
    if (opacity !== 0.5) {
      const dangerousThings1 = [...dangerousThings];
      const index = dangerousThings1.indexOf(thing);
      if (index === -1) {
        dangerousThings1.push(thing);
        setDangerousThings(dangerousThings1);
      } else {
        dangerousThings1.splice(index, 1);
      }
      setDangerousThings(dangerousThings1);
    }
  };

  return (
    <div className="w-3/4 mx-auto py-5 pb-16" style={{ opacity }}>
      <div className="mb-12">
        <h1 className="text-xl text-slate-900 font-[400] mb-5">
          How are you hosting on Airbnb?
        </h1>
        <form>
          <div
            onClick={() => changeHostType("individual")}
            className="flex items-end justify-between my-1.5"
          >
            <label htmlFor="individual" className="text-gray-700">
              I'm hosting as a private individual
            </label>
            <input
              checked={hostType === "individual"}
              id="individual"
              type="radio"
              className="w-4 h-4 host-type"
            />
          </div>
          <div
            onClick={() => changeHostType("business")}
            className="flex items-end justify-between my-1.5"
          >
            <label htmlFor="business" className="text-gray-700">
              I'm hosting as a business
            </label>
            <input
              checked={hostType === "bussiness"}
              id="business"
              type="radio"
              className="w-4 h-4"
            />
          </div>
        </form>
      </div>
      <div className="mb-12">
        <h1 className="text-xl text-slate-900 font-[400] mb-5">
          Do you have any of these at your place?
        </h1>
        <form>
          <div
            onClick={() => changeDangerousThings("security cameras")}
            className="flex justify-between my-1.5"
          >
            <label htmlFor="security cameras" className="text-gray-700">
              Security camera(s)
            </label>
            <input
              checked={dangerousThings.indexOf("security cameras") !== -1}
              id="security cameras"
              type="checkbox"
              className="w-5 h-5"
            />
          </div>
          <div
            onClick={() => changeDangerousThings("weapons")}
            className="flex justify-between my-1.5"
          >
            <label htmlFor="weapons" className="text-gray-700">
              Weapons
            </label>
            <input
              checked={dangerousThings.indexOf("weapons") !== -1}
              id="weapons"
              type="checkbox"
              className="w-5 h-5"
            />
          </div>
          <div
            onClick={() => changeDangerousThings("dangerous animals")}
            className="flex justify-between my-1.5"
          >
            <label htmlFor="dangerous animals" className="text-gray-700">
              Dangerous animals
            </label>
            <input
              checked={dangerousThings.indexOf("dangerous animals") !== -1}
              id="dangerous animals"
              type="checkbox"
              className="w-5 h-5"
            />
          </div>
        </form>
      </div>
      <div className="mb-12">
        <h1 className="text-xl text-slate-900 font-[400] mb-5">
          Some important things to know
        </h1>
        <p className="text-gray-700 max-w-[85%] text-sm">
          Be sure to comply with your{" "}
          <span className="underline text-gray-900 font-[400] cursor-pointer">
            local laws
          </span>{" "}
          and review Airbnb's{" "}
          <span className="underline text-gray-900 font-[400] cursor-pointer">
            nondiscrimination policy
          </span>{" "}
          and{" "}
          <span className="underline text-gray-900 font-[400] cursor-pointer">
            guest and Host fees
          </span>
          . Update your{" "}
          <span className="underline text-gray-900 font-[400] cursor-pointer">
            cancellation policy
          </span>{" "}
          after you publish.
        </p>
      </div>
    </div>
  );
}

export default Legal;
