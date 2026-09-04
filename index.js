const API_KEY = "8b673d766321b78f39ca2f6a51b3c305";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("search");
const message = document.getElementById("message");
const genreGrid = document.getElementById("genreGrid");

async function fetchMovies(endpoint) {
  try {
    message.textContent = "Loading movies...";
    movieContainer.innerHTML = "";

    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${API_URL}${endpoint}${separator}api_key=${API_KEY}&language=en-US`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to fetch movies");
    }

    const data = await response.json();

    displayMovies(data.results || []);
    message.textContent = "";
  } catch (error) {
    console.error(error);
    message.textContent = "Unable to load movies. Please try again.";
    movieContainer.innerHTML = "";
  }
}

function displayMovies(movies) {
  if (movies.length === 0) {
    movieContainer.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movieContainer.innerHTML = movies
    .map(function (movie) {
      let poster = "https://placehold.co/500x750/png?text=No+Poster";

      if (movie.poster_path) {
        poster = IMAGE_URL + movie.poster_path;
      }

      const title = movie.title || "Unknown Movie";

      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

      const year = movie.release_date
        ? movie.release_date.substring(0, 4)
        : "Unknown";

      return `
                <div class="movie">
                    <img
                        src="${poster}"
                        alt="${title}"
                        onerror="this.src='https://placehold.co/500x750/png?text=No+Poster'"
                    >

                    <div class="movie-info">
                        <h2>${title}</h2>

                        <p class="rating">
                            ⭐ ${rating}
                        </p>

                        <p>
                            Release: ${year}
                        </p>
                    </div>
                </div>
            `;
    })
    .join("");
}

function searchMovie() {
  const movieName = searchInput.value.trim();

  if (movieName === "") {
    message.textContent = "Please enter a movie name.";
    movieContainer.innerHTML = "";
    return;
  }

  const query = encodeURIComponent(movieName);

  fetchMovies(`/search/movie?query=${query}`);
}

const searchButton = document.querySelector(".search-area button");

if (searchButton) {
  searchButton.addEventListener("click", function () {
    searchMovie();
  });
}

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie();
  }
});

const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    searchInput.value = "";

    const text = button.textContent.trim();

    if (text === "Popular") {
      fetchMovies("/movie/popular");
    } else if (text === "Now Playing") {
      fetchMovies("/movie/now_playing");
    } else if (text === "Top Rated") {
      fetchMovies("/movie/top_rated");
    } else if (text === "Upcoming") {
      fetchMovies("/movie/upcoming");
    }
  });
});

async function fetchGenres() {
  try {
    const response = await fetch(
      `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    );

    const data = await response.json();

    displayGenres(data.genres || []);
  } catch (error) {
    console.error("Genre error:", error);
  }
}

function displayGenres(genres) {
  if (!genreGrid) {
    return;
  }

  genreGrid.innerHTML = genres
    .map(function (genre) {
      return `
                <button
                    class="filter"
                    onclick="searchGenre(${genre.id})"
                >
                    ${genre.name}
                </button>
            `;
    })
    .join("");
}

function searchGenre(genreId) {
  searchInput.value = "";

  fetchMovies(`/discover/movie?with_genres=${genreId}`);

  const moviesSection = document.getElementById("movies");

  if (moviesSection) {
    moviesSection.scrollIntoView({
      behavior: "smooth",
    });
  }
}

fetchMovies("/movie/popular");
fetchGenres();
