import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function BecomeAHost() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      router.push({
        pathname: "/become-a-host/property-type-group",
        query: {
          item: router.query.item,
        },
      });
    }
  }, [router.isReady]);

  return (
    <div>
      <Head>
        <title>Become A host</title>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
      </Head>
    </div>
  );
}

export default BecomeAHost;
