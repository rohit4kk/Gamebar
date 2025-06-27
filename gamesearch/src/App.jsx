import { useState, useEffect } from "react";
import Search from "./components/Search";
import useFetch from "./hooks/useFetch";
import { fetchGames } from "./api";
import GameCard from "./components/GameCard";
import ErrorMessage from "./components/ErrorMessage";
import Spinner from "./components/Spinner";
import GameDetails from "./components/GameDetails";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading, fetchData, error } = useFetch(() =>
    fetchGames({ query: searchQuery })
  );

  const [showGameDetails, setShowGameDetails] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <main className="w-full p-2 flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        <h1 className="text-gradient text-4xl font-bold">searchGames</h1>
        <img src="./28.png" alt="Game Icon" className="w-24 h-24" />
      </div>

      {/* Search Bar (always visible) */}
      <div className="w-full max-w-4xl mb-4">
        <Search
          query={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowGameDetails(false); // hide details when starting a new search
          }}
        />
      </div>

      {/* Results Grid or GameDetails */}
      <div className="w-full max-w-4xl">
        {!showGameDetails ? (
          // Results view
          loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : data ? (
            data.results.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.results
                  .filter((game) => game.added > 35)
                  .map((game) => (
                    <GameCard
                      key={game.slug}
                      name={game.name}
                      coverLink={game.background_image}
                      playtime={game.playtime}
                      genres={game.genres}
                      onClick={() => {
                        setCurrentGame(game);
                        setShowGameDetails(true);
                      }}
                    />
                  ))}
              </div>
            ) : (
              <ErrorMessage message="No games found!" />
            )
          ) : null
        ) : (
          // Details view
          <GameDetails
            currentGame={currentGame}
            goBack={() => {
              setShowGameDetails(false);
              setCurrentGame(null);
            }}
          />
        )}

        {error && <ErrorMessage message="Network Error Occurred!" />}
      </div>
    </main>
  );
}
