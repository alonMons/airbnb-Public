import React, { useCallback, useContext, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Head from "next/head";
import { useRouter } from "next/router";
import { auth, db, storage } from "../../services/firebase";
import { UserDocContext } from "../../services/context";
import { CameraIcon } from "@heroicons/react/outline";
import { useDropzone } from "react-dropzone";
import CapIcon from "../../components/Icons/CapIcon";
import SuitCaseIcon from "../../components/Icons/SuitCaseIcon";
import GlobeIcon from "../../components/Icons/GlobeIcon";
import GlobeAltIcon from "../../components/Icons/GlobeAltIcon";
import SchoolModal from "../../components/SchoolModal";
import LivesModal from "../../components/LivesModal";
import WorkModal from "../../components/WorkModal";
import LanguagesModal from "../../components/LanguagesModal";
import AboutModal from "../../components/AboutModal";
import NameModal from "../../components/NameModal";

export default function Edit() {
  const router = useRouter();
  const { userId } = router.query;
  const [ready, setReady] = useState(false);
  const { userDoc, setUserDoc } = useContext(UserDocContext);
  const placeholder =
    "https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/placeholder.jpg?alt=media&token=e007530f-1b35-4605-9312-db3af5ee536b";
  const [photo, setPhoto] = useState({});
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showLivesModal, setShowLivesModal] = useState(false);
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
      } else {
        setReady(true);
      }
    });
  }, []);

  useEffect(() => {
    if (userDoc) setReady(true);
  }, [userDoc]);

  const handleDelete = () => {
    storage.refFromURL(userDoc.avatar)?.delete();
    const userDoc1 = { ...userDoc };
    userDoc1.avatar = placeholder;
    setUserDoc(userDoc1);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setPhoto(
      acceptedFiles.map((file) => {
        if (
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/webp"
        ) {
          if (file.size < 2000)
            return alert(
              "The file is too small. Please upload a photo that exceeds 2KB."
            );
          if (file.size > 10485760)
            return alert(
              "The file is too large. Please upload a photo that subceeds 10MB."
            );
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        } else
          alert(
            "The images you upload must be JPEG or PNG files. Please check your file type and try again."
          );
      })[0]
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  useEffect(() => {
    if (photo.preview) {
      storage
        .ref(`users/${photo.name + userDoc.id}`)
        .put(photo)
        .on(
          "state_changed",
          () => {},
          (ex) => alert(ex),
          async () => {
            storage
              .ref(`users/${photo.name + userDoc.id}`)
              .getDownloadURL()
              .then((url) => {
                const userDoc1 = { ...userDoc };
                userDoc1.avatar = url;
                setUserDoc(userDoc1);
              });
          }
        );
    }
  }, [photo]);

  return (
    <div>
      <Head>
        <title>Edit profile</title>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
      </Head>

      <Header />

      <SchoolModal
        showSchoolModal={showSchoolModal}
        setShowSchoolModal={setShowSchoolModal}
      />

      <LivesModal
        showLivesModal={showLivesModal}
        setShowLivesModal={setShowLivesModal}
      />

      <WorkModal
        showWorkModal={showWorkModal}
        setShowWorkModal={setShowWorkModal}
      />

      <LanguagesModal
        showLanguagesModal={showLanguagesModal}
        setShowLanguagesModal={setShowLanguagesModal}
      />

      <AboutModal
        setShowAboutModal={setShowAboutModal}
        showAboutModal={showAboutModal}
      />

      <NameModal
        showNameModal={showNameModal}
        setShowNameModal={setShowNameModal}
      />

      {ready ? (
        userId == userDoc?.id ? (
          <main className="flex flex-col lg:grid lg:grid-cols-3 py-12 px-4 lg:px-0">
            <div className="w-full h-[17.5rem] flex justify-center lg:sticky top-[10rem]">
              <div className="relative">
                <img
                  src={userDoc.avatar}
                  className="object-cover rounded-full w-[14.5rem] h-[14.5rem]"
                  alt=""
                />
                <div className="absolute top-[13.25rem] flex justify-center w-full">
                  {userDoc.avatar == placeholder ? (
                    <div className="cursor-pointer" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="flex cursor-pointer items-center text-[0.9rem] shadow-xl gap-[0.4rem] rounded-full px-4 py-[0.42rem] bg-white">
                        <CameraIcon className="h-[1.1rem]" />
                        Add
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleDelete()}
                      className="flex cursor-pointer items-center text-[0.9rem] shadow-xl gap-[0.4rem] rounded-full px-4 py-[0.42rem] bg-white"
                    >
                      <CameraIcon className="h-[1.1rem]" />
                      Remove
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-2 w-full lg:pr-28">
              <header className="pb-4 lg:pb-2">
                <h1 className="block text-[2rem] pb-3 font-[500] text-slate-900">
                  Your profile
                </h1>
                <span className="font-[100] text-[1rem] text-gray-500">
                  The information you share will be used across Airbnb to help
                  other guests and Hosts get to know you.
                </span>
              </header>
              <div
                style={{ rowGap: "0px" }}
                className="grid lg:grid-cols-2 lg:grid-rows-2 gap lg:gap-20 font-[200]"
              >
                <div className="w-full flex flex-col">
                  <div
                    onClick={() => setShowSchoolModal(true)}
                    className={`flex items-center ${
                      !userDoc.host?.school && "text-gray-500"
                    } cursor-pointer gap-3 py-[1.15rem] hover:bg-neutral-100 rounded-lg px-2 h-full`}
                  >
                    <CapIcon height={27.5} />
                    Where I went to school
                    {userDoc.host?.school && `: ${userDoc.host?.school}`}
                  </div>
                  <span className="border-b w-[94%] self-center"></span>
                </div>
                <div className="w-full flex flex-col">
                  <div
                    onClick={() => setShowLivesModal(true)}
                    className={`flex items-center ${
                      !userDoc.host?.lives && "text-gray-500"
                    } cursor-pointer gap-3 py-[1.15rem] hover:bg-neutral-100 rounded-lg px-2 h-full`}
                  >
                    <GlobeIcon height={27.5} />
                    Where I live
                    {userDoc.host?.lives &&
                      `: ${userDoc.host?.lives?.description}`}
                  </div>
                  <span className=" border-b w-[94%] self-center"></span>
                </div>

                <div className="w-full flex flex-col">
                  <div
                    onClick={() => setShowWorkModal(true)}
                    className={`flex items-center ${
                      !userDoc.host?.work && "text-gray-500"
                    } cursor-pointer gap-3 py-[1.15rem] hover:bg-neutral-100 rounded-lg px-2 h-full`}
                  >
                    <SuitCaseIcon height={27.5} />
                    My work{userDoc.host?.work && `: ${userDoc.host?.work}`}
                  </div>
                  <span className=" border-b w-[94%] self-center"></span>
                </div>
                <div className="w-full flex flex-col">
                  <div
                    onClick={() => setShowLanguagesModal(true)}
                    className={`flex items-center ${
                      !userDoc.host?.spokenLanguages?.length > 0 &&
                      "text-gray-500"
                    } cursor-pointer gap-3 py-[1.15rem] hover:bg-neutral-100 rounded-lg px-2 h-full`}
                  >
                    <GlobeAltIcon height={27.5} />
                    Languages I speak
                    {userDoc?.host?.spokenLanguages?.length > 0 &&
                      userDoc?.host?.spokenLanguages.map((item, index) => {
                        return `${index != 0 ? ", " : ": "}${item}`;
                      })}
                  </div>
                  <span className=" border-b w-[94%] self-center"></span>
                </div>
              </div>
              <div className="py-8">
                <h2 className="block text-2xl pb-5 font-[500] text-slate-900">
                  About you
                </h2>
                <div className="w-full flex flex-col p-5 justify-center border-[1.5px] border-dotted border-gray-400 rounded-lg">
                  <span className="font-[100] text-gray-600 pb-1">
                    {userDoc?.host?.about
                      ? userDoc?.host?.about
                      : "Write something fun and punchy."}
                  </span>
                  <span
                    onClick={() => setShowAboutModal(true)}
                    className="text-slate-900 underline cursor-pointer"
                  >
                    {userDoc?.host?.about ? "Edit intro" : "Add intro"}
                  </span>
                </div>
              </div>
              <div className="py-8">
                <h2 className="block text-2xl pb-5 font-[500] text-slate-900">
                  Your name
                </h2>
                <div className="w-full flex p-5 justify-between items-center border-[1.5px] border-dotted border-gray-400 rounded-lg">
                  <span className="font-[200] text-[1.1rem] text-gray-600 pb-1">
                    {userDoc?.name}
                  </span>
                  <span
                    onClick={() => setShowNameModal(true)}
                    className="text-slate-900 underline cursor-pointer"
                  >
                    Edit name
                  </span>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <main className="flex flex-col items-center py-[12rem]">
            <span className="mx-auto text-[1.85rem] font-[500] text-slate-900">
              No permission to access this page
            </span>
            <span
              onClick={() => router.back()}
              className="underline cursor-pointer text-gray-700 text-lg"
            >
              Go back
            </span>
          </main>
        )
      ) : (
        <main className="grid lg:grid-cols-3 px-4 md:px-10 py-20">
          <div className="w-full flex justify-center mb-10">
            <div className="rounded-full w-[14.5rem] h-[14.5rem] bg-gray-200"></div>
          </div>
          <div className="col-span-2">
            <div className="w-1/2 lg:w-1/4 h-8 bg-gray-200 mb-2"></div>
            <div className="w-full lg:w-3/4 h-4 bg-gray-200"></div>
            <div className="grid lg:grid-cols-2 gap-2 mt-5">
              <div className="w-full h-[4.5rem] rounded-lg bg-gray-200"></div>
              <div className="w-full h-[4.5rem] rounded-lg bg-gray-200"></div>
              <div className="w-full h-[4.5rem] rounded-lg bg-gray-200"></div>
              <div className="w-full h-[4.5rem] rounded-lg bg-gray-200"></div>
            </div>
            <div className="mt-10">
              <div className="w-1/2 lg:w-1/4 h-6 bg-gray-200 mb-2"></div>
              <div className="w-full rounded-lg bg-gray-200 mt-3 h-[8rem]"></div>
            </div>
          </div>
        </main>
      )}

      {ready && <Footer />}
    </div>
  );
}
