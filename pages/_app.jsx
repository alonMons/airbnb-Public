import "../styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import { useState, useEffect, Fragment } from "react";
import { auth, db } from "../services/firebase";
import {
  UserContext,
  UserDocContext,
  showNavOutContext,
} from "../services/context";
import _ from "lodash";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(undefined);
  const [showNavOut, setShowNavOut] = useState(false);
  const router = useRouter();

  useEffect(async () => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    if (user) {
      const userDoc1 = await db
        .collection("users")
        .doc(user?.uid)
        .get()
        .then((doc) => doc.data());
      setUserDoc(userDoc1);
    }
  }, [user?.uid]);

  useEffect(async () => {
    if (user) {
      db.collection("users")
        .doc(user?.uid)
        .get()
        .then((doc) => {
          if (!_.isEqual(doc.data(), userDoc)) {
            db.collection("users")
              .doc(user?.uid)
              .update({ ...userDoc })
              .catch((ex) => alert(ex));
          }
        });
    }
  }, [userDoc, user]);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot((snapshot) => {
          if (!_.isEqual(snapshot.data(), userDoc)) {
            setUserDoc(snapshot.data());
          }
        });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUserDoc(undefined);
    }
  }, [user]);

  return (
    <UserDocContext.Provider value={{ userDoc, setUserDoc }}>
      <UserContext.Provider value={{ user, setUser }}>
        <showNavOutContext.Provider value={{ showNavOut, setShowNavOut }}>
          <span
            className="scrollbar-hide airbnb-cereal"
            onClick={() => {
              if (showNavOut) setShowNavOut(false);
            }}
          >
            <script
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.mapApiKey}&libraries=places`}
            ></script>
            {(router.pathname !== "/become-a-host/[type]" ||
              router.query.type === "property-type-group" ||
              router.query.type === "legal") && (
              <NextNProgress height={5} color="#ff385c" />
            )}
            <Component {...pageProps} />
          </span>
        </showNavOutContext.Provider>
      </UserContext.Provider>
    </UserDocContext.Provider>
  );
}

export default MyApp;
