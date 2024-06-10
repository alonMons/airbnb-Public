import AmenitiesItem from "./AmenitiesItem";

function AmenitiesItems() {
  return (
    <div className="pb-32">
      <div className="mx-auto w-5/6 mt-7">
        <h2 className="text-xl text-slate-900 font-[400]">
          Do you have any standout amenities?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
          <AmenitiesItem
            title="Pool"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fpool.png?alt=media&token=49beae4e-980e-4e1a-8dc1-d5ced5d0007d"
          />
          <AmenitiesItem
            title="Hot tub"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fhot-tub.png?alt=media&token=08df1a30-70b9-4e11-8da7-77c397a1ab24"
          />
          <AmenitiesItem
            title="Patio"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fterrace.png?alt=media&token=6aeb65d6-fcbb-4213-8656-7816c529bf8f"
          />
          <AmenitiesItem
            title="BBQ grill"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fgrill.png?alt=media&token=965f577d-831c-4975-9b19-072ed4331007"
          />
          <AmenitiesItem
            title="Fire pit"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fbonfire.png?alt=media&token=6a826063-c21c-424d-9c19-08c594a8cf8e"
          />
          <AmenitiesItem
            title="Pool table"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fpool-table.png?alt=media&token=3b394792-2ee5-4e60-910c-a4e22e872979"
          />
          <AmenitiesItem
            title="Indoor fireplace"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Ffireplace.png?alt=media&token=a9add8c3-3e30-47b3-bf25-2d407dfe7e5f"
          />
          <AmenitiesItem
            title="Outdoor dining area"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fpicnic-table.png?alt=media&token=aeaf7c48-088c-4ff2-ae57-fd1673597510"
          />
          <AmenitiesItem
            title="Exercise equipment"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fdumbbell.png?alt=media&token=6465fad1-82e8-475a-9214-7222ffe881cf"
          />
        </div>
      </div>
      <div className="mx-auto w-5/6 mt-7">
        <h2 className="text-xl text-slate-900 font-semibold">
          What about these guest favorites?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          <AmenitiesItem
            title="Wifi"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fwifi.png?alt=media&token=5d573127-39f7-459e-be78-f074351571fe"
          />
          <AmenitiesItem
            title="TV"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fmonitor.png?alt=media&token=cb96f51e-96f2-434f-b731-1e1e3bdc7db3"
          />
          <AmenitiesItem
            title="Kitchen"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Foven.png?alt=media&token=d3157a57-ab82-4b30-a3bd-7d7dd88f7bc0"
          />
          <AmenitiesItem
            title="Washer"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fwasher.png?alt=media&token=4194d6d7-4cf1-47d9-bfa9-0d2ce7c2c6c5"
          />
          <AmenitiesItem
            title="Free parking on premises"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fcar.png?alt=media&token=014d2c43-699d-4bd6-ba97-e93e0a151332"
          />
          <AmenitiesItem
            title="Paid parking on premises"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fcar-money.png?alt=media&token=892e311c-bd25-4e55-b563-80071303d00b"
          />
          <AmenitiesItem
            title="Air conditioning"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fsnowflake.png?alt=media&token=54e64487-efd3-4058-a213-114ddc0b6116"
          />
          <AmenitiesItem
            title="Dedicated workspace"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fdesk.png?alt=media&token=1647f425-6edf-4b32-85f3-15397128860f"
          />
          <AmenitiesItem
            title="Outdoor shower"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fshower.png?alt=media&token=8737850e-ddf0-47bb-aa9f-a12cfea5d46c"
          />
        </div>
      </div>
      <div className="mx-auto w-5/6 mt-7">
        <h2 className="text-xl text-slate-900 font-semibold">
          Have any of these safety items?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
          <AmenitiesItem
            title="Smoke Alarm"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fsmoke-alarm.png?alt=media&token=fbc58163-4074-404a-b4b3-62e38b4947ef"
          />
          <AmenitiesItem
            title="First aid kit"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Ffirst-aid-kit.png?alt=media&token=10f5b56f-9de7-4699-96a4-1ba57ba8ceb5"
          />
          <AmenitiesItem
            title="Carbon monoxide alarm"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Fcarbon-monoxide.png?alt=media&token=f0d97bda-e31b-4626-bc6d-8b05606310e2"
          />
          <AmenitiesItem
            title="Fire extinguisher"
            img="https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/amenities%2Ffire-extinguisher.png?alt=media&token=55de2940-c44b-4a8e-b326-315a030b5e3d"
          />
        </div>
      </div>
    </div>
  );
}

export default AmenitiesItems;
