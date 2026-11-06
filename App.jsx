import { useEffect, useState } from "react";
import Prayer from "./component/Prayer";
import "./index.css";

const cities = [
  { name: "القاهرة", value: "Cairo" },
  { name: "الإسكندرية", value: "Alexandria" },
  { name: "الجيزة", value: "Giza" },
  { name: "المنصورة", value: "Mansoura" },
  { name: "أسوان", value: "Aswan" },
  { name: "الأقصر", value: "Luxor" },
];

const prayerNames = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

function App() {
  const [city, setCity] = useState("Cairo");
  const [timings, setTimings] = useState(null);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setError("");

        const today = new Date();
        const formattedDate = [
          String(today.getDate()).padStart(2, "0"),
          String(today.getMonth() + 1).padStart(2, "0"),
          today.getFullYear(),
        ].join("-");

        const params = new URLSearchParams({
          city,
          country: "Egypt",
          method: "5",
        });

        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?${params}`
        );

        if (!response.ok) {
          throw new Error("تعذر تحميل مواقيت الصلاة");
        }

        const result = await response.json();
        setTimings(result.data.timings);
        setDate(result.data.date.readable);
      } catch (err) {
        console.error(err);
        setError("حصلت مشكلة أثناء تحميل مواقيت الصلاة.");
      }
    };

    fetchPrayerTimes();
  }, [city]);

  return (
    <section>
      <div className="container">
        <div className="top-sec">
          <div className="city">
            <h3>المدينة</h3>
            <select value={city} onChange={(event) => setCity(event.target.value)}>
              {cities.map((cityItem) => (
                <option key={cityItem.value} value={cityItem.value}>
                  {cityItem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="date">
            <h3>التاريخ</h3>
            <h4>{date || "جارٍ التحميل..."}</h4>
          </div>
        </div>

        {error && <p>{error}</p>}

        {timings &&
          Object.entries(prayerNames).map(([key, name]) => (
            <Prayer key={key} name={name} time={timings[key]} />
          ))}
      </div>
    </section>
  );
}

export default App;