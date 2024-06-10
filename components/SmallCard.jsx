import Image from "next/image";
import { useRouter } from "next/router";

function SmallCard({ img, location, url }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(url)}
      className="flex items-center m-2 mt-5 space-x-4 cursor-pointer rounded-lg hover:bg-gray-100 hover:scale-105 transition transfrom duration-100 ease-out"
    >
      <div className="relative h-16 w-16">
        <Image src={img} layout="fill" className="rounded-lg" />
      </div>
      <div>
        <h2>{location}</h2>
      </div>
    </div>
  );
}

export default SmallCard;
