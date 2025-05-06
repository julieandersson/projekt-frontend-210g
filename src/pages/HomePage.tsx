import BookGallery from "../components/BookGallery";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const [searchParams] = useSearchParams(); // hämtar sökparametrar från URL
  // Hämtar sidnummer från sökparameter, om det inte finns så sätts det till 1
  const page = Number(searchParams.get("page")) || 1;

  return (
    <>
    <h1>Recensera Mera</h1>
    <section>
        <p>
        <strong>Recensera Mera</strong> är en plats för bokälskare som vill upptäcka nya titlar, läsa vad andra tycker och dela sina egna bokrecensioner. Här hittar du ett ständigt växande bibliotek av böcker. Börja med att utforska nedan och hitta din nästa favorit!
        </p>
      </section>
      <h2 className="text-2xl font-bold mb-6">Upptäck böcker</h2>
      <BookGallery search="subject:mystery" initialPage={page} />
    </>
  );
};

export default HomePage;