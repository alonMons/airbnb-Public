import Head from "next/head";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function index() {
  return (
    <div>
      <Head>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
        <title>Page not found</title>
      </Head>

      <div className="sticky top-0 z-[100]">
        <Header />
      </div>

      <main className="w-full py-[10rem] flex justify-center">
        <div className="flex flex-col items-center">
          <div
            style={{ lineHeight: "3.5rem" }}
            className="text-[3.5rem] font-[500] text-slate-900 text-center"
          >
            404
          </div>
          <div className="text-center">page not found</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
