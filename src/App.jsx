import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error("Error to fetch movies");
        }

        const data = await response.json();

        if (!data.results) {
          throw new Error(data.status_message || "Failed to fetch movies");
        }

        if (isMounted) {
          setMoviesList(data.results);
        }
      } catch (error) {
        console.error("Error searching movies:", error);

        if (isMounted) {
          setMoviesList([]);
          setErrorMessage("Error fetching movies. Please try again later");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMovies = moviesList.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="mt-[20px]">All Movies</h2>

          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {filteredMovies.map((movie) => (
                <li key={movie.id} className="text-white">
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
