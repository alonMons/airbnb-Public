import { random } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";

function Banner({ exploreData }) {
  const router = useRouter();
  return (
    <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] xl:h-[600px]">
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/57b9f708-bb12-498c-bc33-769f8fc43e63.webp?alt=media&token=4db092bc-64b6-4b82-b44d-a48191599d9c&_gl=1*1k56p5b*_ga*MTE3NDcwNDUwMy4xNjgwMTEzOTI5*_ga_CW55HF8NVT*MTY5NjE3NDc2NS41Ni4xLjE2OTYxNzQ3NzguNDcuMC4w"
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute top-1/2 w-full text-center">
        <p className="text-sm sm:text-lg font-[500]">
          Not sure where to go? Perfect.
        </p>
        <button
          onClick={() =>
            router.push(exploreData[random(0, exploreData.length - 1)].search)
          }
          className=" bg-white px-10 py-4 shadow-md rounded-full font-[500] my-3 hover:shadow-xl active:scale-90 transition duration-150"
        >
          <span className="flexible">I'm Flexible</span>
        </button>
      </div>
    </div>
  );
}

export default Banner;
