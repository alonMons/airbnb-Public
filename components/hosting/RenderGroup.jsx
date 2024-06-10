import { useRouter } from "next/router";
import { useEffect } from "react";
import Amenities from "./Amenities";
import Description from "./Description";
import FloorPlan from "./FloorPlan";
import Legal from "./Legal";
import Location from "./Location";
import Photo from "./Photo";
import Photos from "./Photos";
import Price from "./Price";
import PrivacyType from "./PrivacyType";
import Property from "./Property";
import PropertyType from "./PropertyType";
import Title from "./Title";

function RenderGroup({ opacity }) {
  const router = useRouter();
  const { type } = router.query;

  useEffect(() => {
    if (router.isReady) {
      if (
        !(
          type === "property-type-group" &&
          type === "property-type" &&
          type === "privacy-type" &&
          type === "location" &&
          type === "floor-plan" &&
          type === "amenities" &&
          type === "photo" &&
          type === "photos" &&
          type === "title" &&
          type === "description" &&
          type === "price" &&
          type === "legal"
        )
      ) {
        router.push("/become-a-host/property-type-group");
      }
    }
  }, [router.isReady]);

  if (type === "property-type-group") return <Property />;
  if (type === "property-type") return <PropertyType />;
  if (type === "privacy-type") return <PrivacyType />;
  if (type === "location") return <Location />;
  if (type === "floor-plan") return <FloorPlan />;
  if (type === "amenities") return <Amenities />;
  if (type === "photo") return <Photo />;
  if (type === "photos") return <Photos />;
  if (type === "title") return <Title />;
  if (type === "description") return <Description />;
  if (type === "price") return <Price />;
  if (type === "legal") return <Legal opacity={opacity} />;
  return <div></div>;
}

export default RenderGroup;
