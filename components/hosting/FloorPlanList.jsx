import { MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";

function FloorPlanList({ items }) {
  const handleMinus = (item) => {
    if (item.title === "Bathrooms") {
      if (item.data <= 0.5) return;
      else item.setData(item.data - 0.5);
    } else {
      if (item.data <= 1) return;
      else item.setData(item.data - 1);
    }
  };

  const handlePlus = (item) => {
    console.log(item);
    if (item.title === "Guests") {
      if (item.data >= 16) return;
      else item.setData(item.data + 1);
    } else if (item.title === "Bathrooms") {
      if (item.data >= 50) return;
      else item.setData(item.data + 0.5);
    } else {
      if (item.data >= 50) return;
      else item.setData(item.data + 1);
    }
  };

  return (
    <ul className="flex flex-col items-center w-full">
      {items.map((item) => (
        <li className="flex items-center justify-between w-3/4 space-y-8">
          <h3 className="text-slate-900 text-2xl font-[400]">{item.title}</h3>
          <div className="flex space-x-4 items-center">
            <div
              onClick={() => handleMinus(item)}
              className={`flex justify-center items-center cursor-pointer rounded-full w-8 h-8 border ${
                item.title === "Bathrooms"
                  ? item.data <= 0.5
                    ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                    : "border-[#bcbcbc] text-[#717171]"
                  : item.data <= 1
                  ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                  : "border-[#bcbcbc] text-[#717171]"
              }`}
            >
              <MinusSmIcon className="h-5" />
            </div>
            <p className="font-[400]">{item.data}</p>
            <div
              onClick={() => handlePlus(item)}
              className={`flex justify-center items-center cursor-pointer rounded-full w-8 h-8 border ${
                item.title === "Guests"
                  ? item.data >= 16
                    ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                    : "border-[#bcbcbc] text-[#717171]"
                  : item.data >= 50
                  ? "border-[#efefef] text-[#efefef] cursor-not-allowed"
                  : "border-[#bcbcbc] text-[#717171]"
              } `}
            >
              <PlusSmIcon className="h-5" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default FloorPlanList;
