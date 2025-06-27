const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export async function fetchGames({ query }) {
  const response = await fetch(`${API_ENDPOINT}/games?search=${query}`);
  return await response.json();
}

export async function fetchGameData({ gameSlug }) {
  const response = await fetch(`${API_ENDPOINT}/game?gameSlug=${gameSlug}`);
  return await response.json();
}