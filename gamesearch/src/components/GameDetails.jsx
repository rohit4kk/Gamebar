import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { fetchGameData } from "../api";
import Spinner from "./Spinner";
import ScreenshotCarousel from "./ScreenshotCarousel";

function createParagraphs(inputString) {
  const sentences = inputString.match(/[^.!?]+[.!?]+/g) || [];
  const paragraphs = [];

  for (let i = 0; i < sentences.length; i += 3) {
    const paragraph = sentences.slice(i, i + 3).join(" ").trim();
    paragraphs.push(paragraph);
  }

  return paragraphs;
}

export default function GameDetails({ currentGame, goBack }) {
  const [description, setDescription] = useState([]);
  const { data, loading, fetchData, error, reset } = useFetch(() =>
    fetchGameData({ gameSlug: currentGame.slug })
  );

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  useEffect(() => {
    if (data) {
      const rawDescription = data.description_raw;
      const paragraphs = createParagraphs(rawDescription);
      setDescription(paragraphs);
    }
  }, [data]);

  return (
    <section>
      <button className="main-button flex" onClick={goBack}>
        <img src="./back-arrow.svg" alt="Back" />
        <span className="mx-2">Go Back</span>
      </button>

      {loading || !data ? (
        <div className="flex justify-center mt-4">
          <Spinner />
        </div>
      ) : (
        <div className="mt-4">
          {/* Banner */}
          <div className="w-full relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-80"></div>
            <h1 className="text-gray-200 text-2xl absolute top-5 left-5">
              {currentGame.name}
            </h1>
            <img
              className="w-full h-40 object-cover rounded-md"
              src={currentGame.background_image}
              alt={currentGame.name}
            />
          </div>

          {/* Description */}
          <div className="text-gray-300 mt-4">
            {description.map((paragraph, index) => (
              <p className="mt-2" key={index}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Screenshot Carousel Placeholder */}
         <div className="w-full flex flex-col items-center p-4 h-96">
  {currentGame.short_screenshots.length !== 0 && (
    <ScreenshotCarousel
      screenshots={currentGame.short_screenshots.slice(0)} // exclude the first screenshot since it's the same as the cover
    />
  )}
</div>

          {/* Genres and Platforms */}
          <div className="grid grid-cols-2 py-4">
            <div className="flex flex-col">
              <h2 className="text-gray-300 text-xl">Genres</h2>
              <ul className="flex flex-wrap gap-2 py-2">
                {currentGame.genres.map((genre) => (
                  <li className="genre-pill" key={genre.name}>
                    {genre.name}
                  </li>
                ))}
              </ul>

              <h2 className="text-gray-300 text-xl">Platforms</h2>
              <ul className="flex flex-wrap gap-2 py-2">
                {currentGame.platforms.map((platform) => (
                  <li key={platform.platform.name} className="platform-pill">
                    {platform.platform.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase Button */}
            <div className="flex justify-center items-center">
              <button
                className="main-button flex items-center"
                onClick={() =>
                  window.open(
                    `https://google.com/search?q=where+to+buy+${currentGame.name}`,
                    "_blank"
                  )
                }
              >
                <span className="ml-4 mr-2">Purchase</span>
                <img
                  src="./shopping-bag.svg"
                  className="size-6 mr-4"
                  alt="Cart"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
