import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import SmallCard from "../components/SmallCard";
import MediumCard from "../components/MediumCard";
import LargeCard from "../components/LargeCard";
import Footer from "../components/Footer";

export default function Home({ places, types }) {
  return (
    <div className="scroll-smooth">
      <Head>
        <title>Airbnb</title>
        <link
          rel="icon"
          href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo.png"
        />
      </Head>

      <Header />
      <Banner exploreData={places} />

      <main className="max-w-7xl mx-auto px-8 sm:px-16">
        <section className="pt-6">
          <h2 className="text-4xl font-[500] pb-5">Explore Cities</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {places?.map((city) => (
              <SmallCard
                key={city.location}
                img={city.img}
                url={city.search}
                location={city.location}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-[500] pb-7 pt-9">Live Anywhere</h2>

          <div className="flex scrollbar-hide overflow-scroll p-3 -ml-3 space-x-3">
            {types?.map((card) => (
              <MediumCard key={card.img} img={card.img} title={card.title} />
            ))}
          </div>
        </section>

        <LargeCard
          img={"https://links.papareact.com/4cj"}
          title="The Greatest Outdoors"
          description="Wishlists curated by Airbnb"
          buttonText="Get Inspired"
        />
      </main>

      <Footer />
    </div>
  );
}
// Fetching data from the JSON file
import fsPromises from "fs/promises";
export async function getStaticProps() {
  const placesData = await fsPromises.readFile("json/places.json");
  const places = JSON.parse(placesData);

  const typesData = await fsPromises.readFile("json/types.json");
  const types = JSON.parse(typesData);

  return {
    props: { places, types },
  };
}
