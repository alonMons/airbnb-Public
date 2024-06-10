import _, { indexOf, isEqual } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, createContext, useContext } from "react";
import HostingFooter from "../../components/hosting/HostingFooter";
import RenderGroup from "../../components/hosting/RenderGroup";
import { UserContext, UserDocContext } from "../../services/context";
import { db, storage } from "../../services/firebase";
import { v4 } from "uuid";

export const IndexContext = createContext(0);
export const PagesContext = createContext([]);
export const TypeContext = createContext({});

function type() {
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState({});
  const { user, setUser } = useContext(UserContext);
  const { userDoc, setUserDoc } = useContext(UserDocContext);
  const [opacity, setOpacity] = useState(1);
  const router = useRouter();
  const { type, item: item1 } = router.query;

  const [property, setProperty] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [privacyType, setPrivacyType] = useState(null);
  const [coords, setCoords] = useState(null);
  const [sug, setSug] = useState(null);
  const [guests, setGuests] = useState(4);
  const [beds, setBeds] = useState(1);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [amenities, setAmenities] = useState([]);

  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  const [photo4, setPhoto4] = useState(null);
  const [photo5, setPhoto5] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(10);
  const [hostType, setHostType] = useState(null);
  const [dangerousThings, setDangerousThings] = useState([]);
  const [id, setId] = useState(v4());
  const [item, setItem] = useState();

  useEffect(() => {
    if (!photo2 && photo3) {
      setPhoto2(photo3);
      setPhoto3(photo4);
      setPhoto4(photo5);
    }
    if (!photo3 && photo4) {
      setPhoto3(photo4);
      setPhoto4(photo5);
    }
    if (!photo4 && photo5) {
      setPhoto4(photo5);
    }
  }, [photo2, photo3, photo4, photo5]);

  useEffect(() => {
    if (router.isReady && item1) {
      const item = JSON.parse(item1 || "");
      setItem(item);

      if (router.isReady && Object.keys(item).length > 1) {
        setProperty(item.property);
        setPropertyType(item.propertyType);
        setPrivacyType(item.privacyType);
        setCoords({ lat: item.location.lat, lng: item.location.long });
        setSug(item.location.sug);
        setGuests(item.floorPlan.guests);
        setBeds(item.floorPlan.beds);
        setBedrooms(item.floorPlan.bedrooms);
        setBathrooms(item.floorPlan.bathrooms);
        setAmenities(item.amenities);
        setPhoto1(item.photos[0]);
        setPhoto2(item.photos[1] ? item.photos[1] : null);
        setPhoto3(item.photos[2] ? item.photos[2] : null);
        setPhoto4(item.photos[3] ? item.photos[3] : null);
        setPhoto5(item.photos[4] ? item.photos[4] : null);
        setTitle(item.title);
        setDescription(item.description);
        setPrice(item.price);
        setHostType(item.legal.hostType);
        setDangerousThings(item.legal.dangerousThings);
        setId(item.id);
      }
    }
  }, [router.isReady, item1]);

  const pages = [
    {
      title: "What kind of place will you host?",
      type: "property-type-group",
      next: "/become-a-host/property-type",
      back: item1 ? "/manage-listings" : "/",
      count: 1,
    },
    {
      title: "Which of these best describes your place?",
      type: "property-type",
      next: "/become-a-host/privacy-type",
      back: "/become-a-host/property-type-group",
      count: 2,
    },
    {
      title: "What kind of space will guests have?",
      type: "privacy-type",
      next: "/become-a-host/location",
      back: "/become-a-host/property-type",
      count: 3,
    },
    {
      title: "Where's your place located?",
      type: "location",
      next: "/become-a-host/floor-plan",
      back: "/become-a-host/privacy-type",
      count: 4,
    },
    {
      title: "How many guests would you like to welcome?",
      type: "floor-plan",
      next: "/become-a-host/amenities",
      back: "/become-a-host/location",
      count: 5,
    },
    {
      title: "Let guests know what your place has to offer",
      type: "amenities",
      next: "/become-a-host/photo",
      back: "/become-a-host/floor-plan",
      count: 6,
    },
    {
      title: "Next, let's add a photo of your place",
      type: "photo",
      next: "/become-a-host/photos",
      back: "/become-a-host/amenities",
      count: 7,
    },
    {
      title: "Would you like to add some more photos?",
      type: "photos",
      next: "/become-a-host/title",
      back: "/become-a-host/photo",
      count: 8,
    },
    {
      title: "Let's give your place a name",
      type: "title",
      next: "/become-a-host/description",
      back: "/become-a-host/photos",
      count: 9,
    },
    {
      title: "Now, let's describe your place",
      type: "description",
      next: "/become-a-host/price",
      back: "/become-a-host/title",
      count: 10,
    },
    {
      title: "Now for the fun part—set your price",
      type: "price",
      next: "/become-a-host/legal",
      back: "/become-a-host/description",
      count: 11,
    },
    {
      title: "Just a few last questions...",
      type: "legal",
      next: "",
      back: "/become-a-host/price",
      count: 12,
    },
  ];

  useEffect(() => {
    if (!user) router.push("/");
    setPage(pages[index]);
  }, [index, user]);

  useEffect(() => {
    if (router.isReady) {
      pages.forEach((page) => {
        if (page.type === type) setIndex(page.count - 1);
      });
    }
  });

  const handleSubmit = async () => {
    if (opacity !== 0.5) {
      setOpacity(0.5);
      storage
        .ref(`listings-photos/${photo1.name}${id}`)
        .put(photo1)
        .on(
          "state_changed",
          () => {},
          (ex) => alert(ex),
          async () => {
            if (!photo2)
              storage
                .ref(`listings-photos`)
                .child(photo1.name + id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("listings")
                    .doc(id)
                    .set({
                      id,
                      userId: user.uid,
                      property,
                      propertyType,
                      privacyType,
                      location: { lat: coords.lat, long: coords.lng, sug },
                      floorPlan: { guests, beds, bedrooms, bathrooms },
                      amenities,
                      photos: [url],
                      title,
                      revenue: 0,
                      booked: [],
                      description,
                      price: Number(price),
                      legal: { hostType, dangerousThings },
                      reviews: [],
                    })
                    .catch((ex) => alert(ex))
                    .then(() => {
                      const userDoc1 = { ...userDoc };
                      const listings1 = [...userDoc.listings];
                      listings1.push(id);
                      userDoc1.listings = listings1;
                      userDoc1.type =
                        listings1.length > 5 ? "superhost" : "host";
                      setUserDoc(userDoc1);
                      router.push("/manage-listings");
                    });
                });
            if (photo2) {
              const url1 = await storage
                .ref(`listings-photos`)
                .child(photo1.name + id)
                .getDownloadURL();
              storage
                .ref(`listings-photos/${photo2.name}${id}`)
                .put(photo2)
                .on(
                  "state_changed",
                  () => {},
                  (ex) => alert(ex),
                  async () => {
                    if (!photo3)
                      storage
                        .ref(`listings-photos`)
                        .child(photo2.name + id)
                        .getDownloadURL()
                        .then((url2) => {
                          db.collection("listings")
                            .doc(id)
                            .set({
                              id,
                              userId: user.uid,
                              property,
                              propertyType,
                              privacyType,
                              location: {
                                lat: coords.lat,
                                long: coords.lng,
                                sug,
                              },
                              floorPlan: { guests, beds, bedrooms, bathrooms },
                              amenities,
                              photos: [url1, url2],
                              title,
                              revenue: 0,
                              booked: [],
                              description,
                              price: Number(price),
                              legal: { hostType, dangerousThings },
                              reviews: [],
                            })
                            .catch((ex) => alert(ex))
                            .then(() => {
                              const userDoc1 = { ...userDoc };
                              const listings1 = [...userDoc.listings];
                              listings1.push(id);
                              userDoc1.listings = listings1;
                              userDoc1.type =
                                listings1.length > 5 ? "superhost" : "host";
                              setUserDoc(userDoc1);
                              router.push("/manage-listings");
                            });
                        });
                    if (photo3) {
                      const url2 = await storage
                        .ref(`listings-photos`)
                        .child(photo2.name + id)
                        .getDownloadURL();
                      storage
                        .ref(`listings-photos/${photo3.name}${id}`)
                        .put(photo3)
                        .on(
                          "state_changed",
                          () => {},
                          (ex) => alert(ex),
                          async () => {
                            if (!photo4)
                              storage
                                .ref(`listings-photos`)
                                .child(photo3.name + id)
                                .getDownloadURL()
                                .then((url3) => {
                                  db.collection("listings")
                                    .doc(id)
                                    .set({
                                      id,
                                      userId: user.uid,
                                      property,
                                      propertyType,
                                      privacyType,
                                      location: {
                                        lat: coords.lat,
                                        long: coords.lng,
                                        sug,
                                      },
                                      floorPlan: {
                                        guests,
                                        beds,
                                        bedrooms,
                                        bathrooms,
                                      },
                                      amenities,
                                      photos: [url1, url2, url3],
                                      title,
                                      revenue: 0,
                                      booked: [],
                                      description,
                                      price: Number(price),
                                      legal: { hostType, dangerousThings },
                                      reviews: [],
                                    })
                                    .catch((ex) => alert(ex))
                                    .then(() => {
                                      const userDoc1 = { ...userDoc };
                                      const listings1 = [...userDoc.listings];
                                      listings1.push(id);
                                      userDoc1.listings = listings1;
                                      userDoc1.type =
                                        listings1.length > 5
                                          ? "superhost"
                                          : "host";
                                      setUserDoc(userDoc1);
                                      router.push("/manage-listings");
                                    });
                                });
                            if (photo4) {
                              const url3 = await storage
                                .ref(`listings-photos`)
                                .child(photo3.name + id)
                                .getDownloadURL();
                              storage
                                .ref(`listings-photos/${photo4.name}${id}`)
                                .put(photo4)
                                .on(
                                  "state_changed",
                                  () => {},
                                  (ex) => alert(ex),
                                  async () => {
                                    if (!photo5)
                                      storage
                                        .ref(`listings-photos`)
                                        .child(photo4.name + id)
                                        .getDownloadURL()
                                        .then((url4) => {
                                          db.collection("listings")
                                            .doc(id)
                                            .set({
                                              id,
                                              userId: user.uid,
                                              property,
                                              propertyType,
                                              privacyType,
                                              location: {
                                                lat: coords.lat,
                                                long: coords.lng,
                                                sug,
                                              },
                                              floorPlan: {
                                                guests,
                                                beds,
                                                bedrooms,
                                                bathrooms,
                                              },
                                              amenities,
                                              photos: [url1, url2, url3, url4],
                                              title,
                                              revenue: 0,
                                              booked: [],
                                              description,
                                              price: Number(price),
                                              legal: {
                                                hostType,
                                                dangerousThings,
                                              },
                                              reviews: [],
                                            })
                                            .catch((ex) => alert(ex))
                                            .then(() => {
                                              const userDoc1 = { ...userDoc };
                                              const listings1 = [
                                                ...userDoc.listings,
                                              ];
                                              listings1.push(id);
                                              userDoc1.listings = listings1;
                                              userDoc1.type =
                                                listings1.length > 5
                                                  ? "superhost"
                                                  : "host";
                                              setUserDoc(userDoc1);
                                              router.push("/manage-listings");
                                            });
                                        });
                                    else {
                                      const url4 = await storage
                                        .ref(`listings-photos`)
                                        .child(photo4.name + id)
                                        .getDownloadURL();
                                      storage
                                        .ref(
                                          `listings-photos/${photo5.name}${id}`
                                        )
                                        .put(photo5)
                                        .on(
                                          "state_changed",
                                          () => {},
                                          (ex) => alert(ex),
                                          async () => {
                                            storage
                                              .ref(`listings-photos`)
                                              .child(photo5.name + id)
                                              .getDownloadURL()
                                              .then((url5) => {
                                                db.collection("listings")
                                                  .doc(id)
                                                  .set({
                                                    id,
                                                    userId: user.uid,
                                                    property,
                                                    propertyType,
                                                    privacyType,
                                                    location: {
                                                      lat: coords.lat,
                                                      long: coords.lng,
                                                      sug,
                                                    },
                                                    floorPlan: {
                                                      guests,
                                                      beds,
                                                      bedrooms,
                                                      bathrooms,
                                                    },
                                                    amenities,
                                                    photos: [
                                                      url1,
                                                      url2,
                                                      url3,
                                                      url4,
                                                      url5,
                                                    ],
                                                    title,
                                                    revenue: 0,
                                                    booked: [],
                                                    description,
                                                    price: Number(price),
                                                    legal: {
                                                      hostType,
                                                      dangerousThings,
                                                    },
                                                    reviews: [],
                                                  })
                                                  .catch((ex) => alert(ex))
                                                  .then(() => {
                                                    const userDoc1 = {
                                                      ...userDoc,
                                                    };
                                                    const listings1 = [
                                                      ...userDoc.listings,
                                                    ];
                                                    listings1.push(id);
                                                    userDoc1.listings =
                                                      listings1;
                                                    userDoc1.type =
                                                      listings1.length > 5
                                                        ? "superhost"
                                                        : "host";
                                                    setUserDoc(userDoc1);
                                                    router.push(
                                                      "/manage-listings"
                                                    );
                                                  });
                                              });
                                          }
                                        );
                                    }
                                  }
                                );
                            }
                          }
                        );
                    }
                  }
                );
            }
          }
        );
    }
  };

  const handleUpdate = async () => {
    if (opacity !== 0.5) {
      setOpacity(0.5);

      if (photo1?.preview) {
        await storage.refFromURL(item.photos[0]).delete();
        await storage.ref(`listings-photos/${photo1.name}${id}`).put(photo1);
      }
      if (photo2?.preview) {
        if (item.photos[1]) await storage.refFromURL(item.photos[1]).delete();
        if (photo2.preview)
          await storage.ref(`listings-photos/${photo2.name}${id}`).put(photo2);
      }
      if (photo3?.preview) {
        if (item.photos[2]) await storage.refFromURL(item.photos[2]).delete();
        if (photo3)
          await storage.ref(`listings-photos/${photo3.name}${id}`).put(photo3);
      }
      if (photo4?.preview) {
        if (item.photos[3]) await storage.refFromURL(item.photos[3]).delete();
        if (photo4)
          await storage.ref(`listings-photos/${photo4.name}${id}`).put(photo4);
      }
      if (photo5?.preview) {
        if (item.photos[4]) await storage.refFromURL(item.photos[4]).delete();
        if (photo5)
          await storage.ref(`listings-photos/${photo5.name}${id}`).put(photo5);
      }
      const url1 = photo1?.name
        ? await storage
            .ref(`listings-photos`)
            .child(photo1.name + id)
            .getDownloadURL()
        : photo1;
      const url2 = photo2?.name
        ? await storage
            .ref(`listings-photos`)
            .child(photo2.name + id)
            .getDownloadURL()
        : photo2;
      const url3 = photo3?.name
        ? await storage
            .ref(`listings-photos`)
            .child(photo3.name + id)
            .getDownloadURL()
        : photo3;
      const url4 = photo4?.name
        ? await storage
            .ref(`listings-photos`)
            .child(photo4.name + id)
            .getDownloadURL()
        : photo4;
      const url5 = photo5?.name
        ? await storage
            .ref(`listings-photos`)
            .child(photo5.name + id)
            .getDownloadURL()
        : photo5;

      if (url5) {
        db.collection("listings")
          .doc(id)
          .update({
            id,
            userId: user.uid,
            property,
            propertyType,
            privacyType,
            location: {
              lat: coords.lat,
              long: coords.lng,
              sug,
            },
            floorPlan: {
              guests,
              beds,
              bedrooms,
              bathrooms,
            },
            amenities,
            photos: [url1, url2, url3, url4, url5],
            title,
            description,
            price: Number(price),
            legal: {
              hostType,
              dangerousThings,
            },
          });
      } else if (url4) {
        db.collection("listings")
          .doc(id)
          .update({
            id,
            userId: user.uid,
            property,
            propertyType,
            privacyType,
            location: {
              lat: coords.lat,
              long: coords.lng,
              sug,
            },
            floorPlan: {
              guests,
              beds,
              bedrooms,
              bathrooms,
            },
            amenities,
            photos: [url1, url2, url3, url4],
            title,
            description,
            price: Number(price).toFixed(1),
            legal: {
              hostType,
              dangerousThings,
            },
          });
      } else if (url3) {
        db.collection("listings")
          .doc(id)
          .update({
            id,
            userId: user.uid,
            property,
            propertyType,
            privacyType,
            location: {
              lat: coords.lat,
              long: coords.lng,
              sug,
            },
            floorPlan: {
              guests,
              beds,
              bedrooms,
              bathrooms,
            },
            amenities,
            photos: [url1, url2, url3],
            title,
            description,
            price: Number(price).toFixed(1),
            legal: {
              hostType,
              dangerousThings,
            },
          });
      } else if (url2) {
        db.collection("listings")
          .doc(id)
          .update({
            id,
            userId: user.uid,
            property,
            propertyType,
            privacyType,
            location: {
              lat: coords.lat,
              long: coords.lng,
              sug,
            },
            floorPlan: {
              guests,
              beds,
              bedrooms,
              bathrooms,
            },
            amenities,
            photos: [url1, url2],
            title,
            description,
            price: Number(price).toFixed(1),
            legal: {
              hostType,
              dangerousThings,
            },
          });
      } else {
        db.collection("listings")
          .doc(id)
          .update({
            id,
            userId: user.uid,
            property,
            propertyType,
            privacyType,
            location: {
              lat: coords.lat,
              long: coords.lng,
              sug,
            },
            floorPlan: {
              guests,
              beds,
              bedrooms,
              bathrooms,
            },
            amenities,
            photos: [url1],
            title,
            description,
            price: Number(price),
            legal: {
              hostType,
              dangerousThings,
            },
          });
      }
      router.push({
        pathname: item ? "/manage-listings" : "/",
      });
    }
  };

  const handleDelete = async () => {
    if (opacity !== 0.5) {
      setOpacity(0.5);
      const allPhotos = (
        await storage.ref("listings-photos").listAll()
      ).items.map(async (item) => {
        if (item.name.includes(id)) {
          await item.delete();
        }
      });
      const userDoc1 = { ...userDoc };
      const listings1 = [...userDoc.listings];
      const index = listings1.indexOf(id);
      listings1.splice(index, 1);
      userDoc1.listings = listings1;
      userDoc1.type =
        listings1.length > 0
          ? listings1.length > 5
            ? "superhost"
            : "host"
          : "user";
      db.collection("listings")
        .doc(id)
        .delete()
        .catch((ex) => console.log(ex))
        .then(() =>
          db
            .collection("users")
            .doc(user.uid)
            .update({
              ...userDoc1,
            })
            .catch((ex) => console.log(ex))
            .then(() => router.push("/"))
        );
    }
  };

  return (
    <TypeContext.Provider
      value={{
        item,
        setItem,
        property,
        setProperty,
        propertyType,
        setPropertyType,
        privacyType,
        setPrivacyType,
        coords,
        setCoords,
        sug,
        setSug,
        guests,
        setGuests,
        beds,
        setBeds,
        bedrooms,
        setBedrooms,
        bathrooms,
        setBathrooms,
        amenities,
        setAmenities,
        photo1,
        setPhoto1,
        photo2,
        setPhoto2,
        photo3,
        setPhoto3,
        photo4,
        setPhoto4,
        photo5,
        setPhoto5,
        title,
        setTitle,
        description,
        setDescription,
        price,
        setPrice,
        hostType,
        setHostType,
        dangerousThings,
        setDangerousThings,
      }}
    >
      <IndexContext.Provider value={{ index, setIndex }}>
        <PagesContext.Provider value={pages}>
          <Head>
            <title>{page.title}</title>
            <link
              rel="icon"
              href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
            />
          </Head>
          <div className=" max-h-screen overflow-scroll md:overflow-hidden">
            <div>
              <main className="grid md:grid-cols-2 max-w-screen w-screen md:h-screen">
                <div className="h-[21rem] md:h-full w-full host-gradient relative">
                  <header className="px-14 py-8 flex justify-start">
                    <svg
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                      onClick={() => router.push("/")}
                      className="h-[32px] w-[32px] fill-white cursor-pointer"
                    >
                      <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.42-6.414 3.615l-.28.019-.267.006C5.377 31 2.5 28.584 2.5 24.522l.005-.469c.026-.928.23-1.768.83-3.244l.216-.524c.966-2.298 6.083-12.989 7.707-16.034C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.33v.206C4.5 27.395 6.411 29 8.857 29c1.773 0 3.87-1.236 5.831-3.354-2.295-2.938-3.855-6.45-3.855-8.91 0-2.913 1.933-5.386 5.178-5.42 3.223.034 5.156 2.507 5.156 5.42 0 2.456-1.555 5.96-3.855 8.907C19.277 27.766 21.37 29 23.142 29c2.447 0 4.358-1.605 4.358-4.478l-.004-.411c-.019-.672-.17-1.296-.714-2.62l-.248-.6c-1.065-2.478-5.993-12.768-7.538-15.664C18.053 3.539 17.24 3 16 3zm.01 10.316c-2.01.021-3.177 1.514-3.177 3.42 0 1.797 1.18 4.58 2.955 7.044l.21.287.174-.234c1.73-2.385 2.898-5.066 2.989-6.875l.006-.221c0-1.906-1.167-3.4-3.156-3.421h-.001z"></path>
                    </svg>
                  </header>
                  <h1 className="w-3/4 absolute top-1/2 left-1/2 translate-x-[-55%] translate-y-[-50%] text-5xl text-white font-[500]">
                    {page?.title}
                  </h1>
                </div>
                <div className="md:overflow-scroll overflow-y-visible scrollbar-hide md:h-screen relative">
                  <header
                    className={`px-14 py-8 top-0 sticky hidden md:flex justify-end ${
                      type !== "location" && "bg-white border-b"
                    } z-50`}
                  >
                    <p
                      onClick={() => router.push("/")}
                      className="cursor-pointer px-4 py-1 text-sm bg-gray-100 text-slate-900 font-[500] rounded-full"
                    >
                      Exit
                    </p>
                  </header>

                  <RenderGroup opacity={opacity} />

                  <HostingFooter
                    item={item}
                    opacity={opacity}
                    handleSubmit={handleSubmit}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                  />
                </div>
              </main>
            </div>
          </div>
        </PagesContext.Provider>
      </IndexContext.Provider>
    </TypeContext.Provider>
  );
}

export default type;
