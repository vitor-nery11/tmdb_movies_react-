const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20L16.65 16.65" />
        </svg>

        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
