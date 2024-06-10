import React, { useContext, useEffect, useState } from "react";
import {
  PlusSmIcon,
  MinusSmIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/solid";
import { TypeContext } from "../../pages/become-a-host/[type]";

function Price() {
  const { price, setPrice } = useContext(TypeContext);

  const handlePlus = () => {
    if (!price) {
      setPrice(10);
    } else {
      setPrice(Number(price) + 10);
    }
  };

  const handleMinus = () => {
    blur();
    if (price) {
      setPrice(Number(price) - 10);
    }
  };

  useEffect(() => {
    blur();
    if (!price || price <= 0) {
      setPrice("");
    }
  }, [price]);

  return (
    <div className="md:absolute md:top-1/2 md:left-1/2 md:translate-x-[-50%] overflow-x-hidden md:translate-y-[-50%] md:w-3/4 h-80 max-w-[350px] md:max-w-none">
      <div className="flex ml-3 mt-10 gap-4 md:gap-6 md:justify-center items-center">
        <div
          onClick={handleMinus}
          className={`p-3 cursor-pointer rounded-full border border-gray-700 ${
            price <= 0 && "cursor-not-allowed border-gray-200"
          }`}
        >
          <MinusSmIcon
            className={`h-5 text-gray-700 ${price <= 0 && "text-gray-200"}`}
          />
        </div>
        <div
          className={`${
            price >= 10000 || price < 10 || !price
              ? "border-red-800 bg-[#fff8f6]"
              : "border-gray-600"
          } flex border  text-center w-52 md:w-1/2 overflow-hidden rounded-md p-4 md:justify-center items-center`}
        >
          <input
            min={0}
            type="number"
            value={price}
            placeholder="$00"
            onChange={(e) => setPrice(e.target.value)}
            className="price text-4xl text-center z-2 font-[400] text-slate-900 placeholder:text-gray-500 outline-none w-56 md:max-w-[100%] bg-transparent"
          />
        </div>
        <div
          onClick={handlePlus}
          className={`p-3 cursor-pointer z-100 rounded-full border border-gray-700 ${
            price >= 10000 && "cursor-not-allowed border-gray-200"
          }`}
        >
          <PlusSmIcon
            className={`h-5 text-gray-700 ${price >= 10000 && "text-gray-200"}`}
          />
        </div>
      </div>
      <span className="text-center block pt-3 pb-2 text-[15px]">
        $ per night
      </span>
      {(!price || price < 10 || price >= 10000) && (
        <span className="absolute left-1/2 translate-x-[-50%] whitespace-nowrap text-center gap-1 pb-3 pt-2 text-xs text-[#c13515] flex justify-center items-center">
          <ExclamationCircleIcon className="h-4" /> Please enter a base price
          between 10$ and 10,000$.
        </span>
      )}
    </div>
  );
}

export default Price;
