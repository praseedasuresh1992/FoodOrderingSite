import Header from "../components/layout/Header";
// import Footer from "../components/layout/Footer";

// import Hero from "../components/home/Hero";
import FeaturedMenu from "../components/home/FeaturedMenu";
// import AboutSection from "../components/home/AboutSection";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* <Hero /> */}
        <FeaturedMenu />
        {/* <AboutSection /> */}
      </main>

      {/* <Footer /> */}
    </>
  );
}