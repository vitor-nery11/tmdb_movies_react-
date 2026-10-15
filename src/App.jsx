import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza debouncedSearchTerm 600ms após o usuário parar de digitar
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 600, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        if (!API_KEY) {
          throw new Error("Missing VITE_TMDB_API_KEY environment variable");
        }

        const query = debouncedSearchTerm.trim();
        const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

        const response = await fetch(endpoint, {
          ...API_OPTIONS,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`TMDB request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.results)) {
          throw new Error(data.status_message || "Failed to fetch movies");
        }

        setMoviesList(data.results || []);

        if (query && data.results.length > 0) {
          try {
            await updateSearchCount(query, data.results[0]);
          } catch (error) {
            console.error("Error updating Appwrite search count:", error);
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Error searching movies:", error);
        setMoviesList([]);
        setErrorMessage(
          error.message === "Missing VITE_TMDB_API_KEY environment variable"
            ? "Configure VITE_TMDB_API_KEY in .env.local and restart the dev server."
            : "Error fetching movies. Please try again later"
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm]); // Dispara apenas quando o termo com debounce muda

  return (
    <main>
      <div className="pattern"></div>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero banner" />
          <h1>
            Find <span className="text-gradient">movies</span> you enjoy without
            the hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-5">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <div className="movie-grid">
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;