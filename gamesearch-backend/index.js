import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Create the Express app
const app = express();

// CORS configuration
const CLIENT_ORIGIN = process.env.CLIENT_DOMAIN || "http://localhost:5174";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Parse JSON bodies (if you need it in future)
app.use(express.json());

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API key not found in environment variables");
}

// Game-search endpoint
app.get("/api/games", async (req, res) => {
  const { search: searchQuery } = req.query;

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(
        searchQuery
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: "Failed to fetch data from external API" });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Error fetching games:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch data from external API" });
  }
});
// seprate page for a game

app.get("/api/game", async (req, res) => {
  const { gameSlug } = req.query;

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games/${gameSlug}?key=${API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from external API");
    }

    const data = await response.json();

    return res.json(data);
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch data from external API" });
  }
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
