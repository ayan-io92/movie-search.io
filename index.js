const API_KEY = "8b673d766321b78f39ca2f6a51b3c305";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("search");
const message = document.getElementById("message");
const genreGrid = document.getElementById("genreGrid");

const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalRating = document.getElementById("modalRating");
const modalReleaseDate = document.getElementById("modalReleaseDate");
const modalGenres = document.getElementById("modalGenres");
const modalRuntime = document.getElementById("modalRuntime");
const modalLanguage = document.getElementById("modalLanguage");
const modalOverview = document.getElementById("modalOverview");
const watchlistButton = document.getElementById("addToWatchlist");

let selectedMovie = null;

const noPoster = "https://placehold.co/500x750/png?text=No+Poster";

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
    console.error("Movie error:", error);

    message.textContent = "Unable to load movies. Please try again.";

    movieContainer.innerHTML = "";
  }
}

function displayMovies(movies) {
  if (!movies.length) {
    movieContainer.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movieContainer.innerHTML = movies
    .map(function (movie) {
      const poster = movie.poster_path
        ? IMAGE_URL + movie.poster_path
        : noPoster;

      const title = movie.title || "Unknown Movie";

      const rating =
        movie.vote_average !== undefined && movie.vote_average !== null
          ? movie.vote_average.toFixed(1)
          : "N/A";

      const year = movie.release_date
        ? movie.release_date.substring(0, 4)
        : "Unknown";

      return `
                <div class="movie">

                    <img
                        src="${poster}"
                        alt="${title}"
                        onerror="this.src='${noPoster}'"
                    >

                    <div class="movie-info">

                        <h2>${title}</h2>

                        <p class="rating">
                            ⭐ ${rating}
                        </p>

                        <p>
                            Release: ${year}
                        </p>

                        <button
                            class="details-btn"
                            onclick="openMovieModal(${movie.id})"
                        >
                            View Details
                        </button>

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

  const moviesSection = document.getElementById("movies");

  if (moviesSection) {
    moviesSection.scrollIntoView({
      behavior: "smooth",
    });
  }
}

const searchButton = document.querySelector(".search-area button");

if (searchButton) {
  searchButton.addEventListener("click", searchMovie);
}

if (searchInput) {
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchMovie();
    }
  });
}

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
    const url = `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to fetch genres");
    }

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
                    class="filter genre-button"
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

function getWatchlist() {
  const savedMovies = localStorage.getItem("watchlist");

  if (!savedMovies) {
    return [];
  }

  try {
    return JSON.parse(savedMovies);
  } catch (error) {
    console.error("Watchlist error:", error);
    return [];
  }
}

function saveWatchlist(watchlist) {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

function addToWatchlist() {
  if (!selectedMovie) {
    return;
  }

  const watchlist = getWatchlist();

  const alreadyAdded = watchlist.some(function (movie) {
    return movie.id === selectedMovie.id;
  });

  if (alreadyAdded) {
    updateWatchlistButton();
    return;
  }

  const movieToSave = {
    id: selectedMovie.id,
    title: selectedMovie.title,
    poster_path: selectedMovie.poster_path,
    vote_average: selectedMovie.vote_average,
    release_date: selectedMovie.release_date,
    overview: selectedMovie.overview,
  };

  watchlist.push(movieToSave);

  saveWatchlist(watchlist);

  updateWatchlistButton();
}

function updateWatchlistButton() {
  if (!watchlistButton || !selectedMovie) {
    return;
  }

  const watchlist = getWatchlist();

  const alreadyAdded = watchlist.some(function (movie) {
    return movie.id === selectedMovie.id;
  });

  if (alreadyAdded) {
    watchlistButton.textContent = "✓ Added to Watchlist";

    watchlistButton.disabled = true;
  } else {
    watchlistButton.textContent = "＋ Add to Watchlist";

    watchlistButton.disabled = false;
  }
}

if (watchlistButton) {
  watchlistButton.addEventListener("click", addToWatchlist);
}

async function openMovieModal(id) {
  try {
    const url = `${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch movie");
    }

    const movie = await response.json();

    selectedMovie = movie;

    if (modalPoster) {
      modalPoster.src = movie.poster_path
        ? IMAGE_URL + movie.poster_path
        : noPoster;

      modalPoster.alt = movie.title || "Movie Poster";
    }

    if (modalTitle) {
      modalTitle.textContent = movie.title || "N/A";
    }

    if (modalRating) {
      modalRating.textContent =
        movie.vote_average !== undefined && movie.vote_average !== null
          ? movie.vote_average.toFixed(1)
          : "N/A";
    }

    if (modalReleaseDate) {
      modalReleaseDate.textContent = movie.release_date || "N/A";
    }

    if (modalGenres) {
      modalGenres.textContent =
        movie.genres && movie.genres.length
          ? movie.genres
              .map(function (genre) {
                return genre.name;
              })
              .join(", ")
          : "N/A";
    }

    if (modalRuntime) {
      modalRuntime.textContent = movie.runtime
        ? movie.runtime + " minutes"
        : "N/A";
    }

    if (modalLanguage) {
      modalLanguage.textContent = movie.original_language
        ? movie.original_language.toUpperCase()
        : "N/A";
    }

    if (modalOverview) {
      modalOverview.textContent = movie.overview || "No overview available.";
    }

    updateWatchlistButton();

    const modalElement = document.getElementById("movieModal");

    if (!modalElement) {
      console.error("movieModal does not exist in HTML");
      return;
    }

    if (typeof bootstrap === "undefined") {
      console.error("Bootstrap JavaScript is not loaded");
      return;
    }

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.show();
  } catch (error) {
    console.error("Modal error:", error);

    message.textContent = "Unable to load movie details.";
  }
}

fetchMovies("/movie/popular");
fetchGenres();
