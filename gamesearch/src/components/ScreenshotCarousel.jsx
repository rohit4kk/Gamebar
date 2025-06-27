import { useState, useEffect } from "react";

export default function ScreenshotCarousel({ screenshots }) {
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  useEffect(() => {
    // trick to preload the images
    for (const screenshot of screenshots) {
      const img = new Image();
      img.src = screenshot.image;
    }
  }, []);

  return (
    <div
      className="bg-gray-800 rounded-lg w-full h-full max-h-96 overflow-hidden relative"
    >
      <button
        className="bg-gray-200 rounded-full p-4 absolute top-40 right-5 shadow-gray-700 shadow-xl z-10"
        onClick={() => {
          setCurrentScreenshotIndex((currentScreenshotIndex) => {
            if (currentScreenshotIndex < screenshots.length - 1) {
              return currentScreenshotIndex + 1;
            }

            return 0;
          });
        }}
      ><img src="./arrow-right.svg" /></button>
      <button
        className="bg-gray-200 rounded-full p-4 absolute top-40 left-5 shadow-gray-700 shadow-xl z-10"
        onClick={() => {
          setCurrentScreenshotIndex((currentScreenshotIndex) => {
            if (currentScreenshotIndex > 0) {
              return currentScreenshotIndex - 1;
            }

            return screenshots.length - 1;
          });
        }}
      ><img src="./arrow-left.svg" /></button>

      <img
        className="object-cover w-full h-full absolute z-0 blur-md opacity-50"
        src={screenshots[currentScreenshotIndex].image}
      />
      <img
        className="object-contain w-full h-full absolute"
        src={screenshots[currentScreenshotIndex].image}
      />

      <span className="bg-gray-900 rounded-full px-4 py-1 text-gray-300 text-xs absolute right-2 top-2 shadow-gray-700 shadow-xl">
        {currentScreenshotIndex + 1} / {screenshots.length}
      </span>
    </div>
  );
}