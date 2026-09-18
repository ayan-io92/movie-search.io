const NO_POSTER = "https://placehold.co/500x750/png?text=No+Poster";
const API_KEY = "8b673d766321b78f39ca2f6a51b3c305";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("search");
const message = document.getElementById("message");
const genreGrid = document.getElementById("genreGrid");
const watchlistGrid = document.getElementById("watchlistGrid");
const watchlistBtn = document.getElementById("addToWatchlist");
const movieModal = document.getElementById("movieModal");
const carouselContainer = document.getElementById("movieCarousel");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let selectedMovie = null;

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
      const poster = movie.poster_path
        ? IMAGE_URL + movie.poster_path
        : NO_POSTER;

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
            onerror="this.src='${NO_POSTER}'"
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
    fetchMovies("/movie/popular");
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

if (searchInput) {
  searchInput.addEventListener("input", function () {
    searchMovie();
  });
}

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
    console.error(error);

    if (genreGrid) {
      genreGrid.innerHTML = "<p>Unable to load genres.</p>";
    }
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
  fetchMovies(`/discover/movie?with_genres=${genreId}`);

  if (movieContainer) {
    movieContainer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function addToWatchlist() {
  if (!selectedMovie) {
    return;
  }

  const alreadyAdded = watchlist.some(function (movie) {
    return movie.id === selectedMovie.id;
  });

  if (alreadyAdded) {
    message.textContent = "Movie is already in your watchlist.";
    return;
  }

  watchlist.push(selectedMovie);

  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  displayWatchlist();

  message.textContent = `${selectedMovie.title} added to watchlist.`;

  if (movieModal) {
    const modal = bootstrap.Modal.getInstance(movieModal);

    if (modal) {
      modal.hide();
    }
  }
}

function displayWatchlist() {
  if (!watchlistGrid) {
    return;
  }

  if (watchlist.length === 0) {
    watchlistGrid.innerHTML =
      "<p class='empty-message'>Your watchlist is empty</p>";
    return;
  }

  watchlistGrid.innerHTML = watchlist
    .map(function (movie) {
      const poster = movie.poster_path
        ? IMAGE_URL + movie.poster_path
        : NO_POSTER;

      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

      return `
        <div class="movie">
          <img
            src="${poster}"
            alt="${movie.title}"
            onerror="this.src='${NO_POSTER}'"
          >

          <div class="movie-info">
            <h2>${movie.title}</h2>

            <p class="rating">
              ⭐ ${rating}
            </p>

            <button
              class="details-btn"
              onclick="removeFromWatchlist(${movie.id})"
            >
              Remove
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function removeFromWatchlist(movieId) {
  watchlist = watchlist.filter(function (movie) {
    return movie.id !== movieId;
  });

  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  displayWatchlist();
}

function clearWatchlist() {
  watchlist = [];

  localStorage.removeItem("watchlist");

  displayWatchlist();
}

async function openMovieModal(movieId) {
  try {
    const url = `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to fetch movie details");
    }

    const movie = await response.json();

    selectedMovie = movie;

    const moviePoster = document.getElementById("moviePoster");
    const movieTitle = document.getElementById("movieTitle");
    const movieRating = document.getElementById("movieRating");
    const movieReleaseDate = document.getElementById("movieReleaseDate");
    const movieLanguage = document.getElementById("movieLanguage");
    const movieOverview = document.getElementById("movieOverview");

    if (moviePoster) {
      moviePoster.src = movie.poster_path
        ? IMAGE_URL + movie.poster_path
        : NO_POSTER;
    }

    if (movieTitle) {
      movieTitle.textContent = movie.title || "Unknown Movie";
    }

    if (movieRating) {
      movieRating.textContent = movie.vote_average
        ? `⭐ ${movie.vote_average.toFixed(1)}`
        : "⭐ N/A";
    }

    if (movieReleaseDate) {
      movieReleaseDate.textContent = movie.release_date || "Not Available";
    }

    if (movieLanguage) {
      movieLanguage.textContent = movie.original_language
        ? movie.original_language.toUpperCase()
        : "Not Available";
    }

    if (movieOverview) {
      movieOverview.textContent = movie.overview || "No overview available.";
    }

    if (movieModal) {
      const modal = bootstrap.Modal.getOrCreateInstance(movieModal);
      modal.show();
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchCarouselMovies() {
  if (!carouselContainer) {
    return;
  }

  try {
    const url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to load carousel movies");
    }

    const data = await response.json();

    displayCarousel(data.results.slice(0, 5));
  } catch (error) {
    console.error(error);
  }
}

function displayCarousel(movies) {
  if (!carouselContainer || movies.length === 0) {
    return;
  }

  carouselContainer.innerHTML = movies
    .map(function (movie, index) {
      const backdrop = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : NO_POSTER;

      const title = movie.title || "Unknown Movie";

      return `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img
            src="${backdrop}"
            class="d-block w-100"
            alt="${title}"
            onerror="this.src='${NO_POSTER}'"
          >

          <div class="carousel-caption">
            <h2>${title}</h2>

            <p>
              ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
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

if (watchlistBtn) {
  watchlistBtn.addEventListener("click", addToWatchlist);
}

function displayMobileCarousel(movies) {
  carouselInner.innerHTML = "";
  carouselIndicators.innerHTML = "";

  if (!movies.length) {
    return;
  }

  movies.forEach((movie, index) => {
    const image = movie.backdrop_path
      ? `${BACKDROP_URL}${movie.backdrop_path}`
      : movie.poster_path
        ? `${IMAGE_URL}${movie.poster_path}`
        : "https://placehold.co/780x440/png?text=No+Image";

    const title = movie.title || "Unknown Movie";

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    const item = document.createElement("div");

    item.className = "carousel-item";

    if (index === 0) {
      item.classList.add("active");
    }

    item.innerHTML = `
            <img src="${image}" alt="${title}">

            <div class="carousel-caption">

                <h5>${title}</h5>

                <p>⭐ ${rating}</p>

                <button
                    class="carousel-details-btn"
                    onclick="openMovieModal(${movie.id})">
                    View Details
                </button>

            </div>
        `;

    carouselInner.appendChild(item);

    const indicator = document.createElement("button");

    indicator.type = "button";
    indicator.dataset.bsTarget = "#movieCarousel";
    indicator.dataset.bsSlideTo = index;

    indicator.setAttribute("aria-label", `Slide ${index + 1}`);

    if (index === 0) {
      indicator.classList.add("active");
      indicator.setAttribute("aria-current", "true");
    }

    carouselIndicators.appendChild(indicator);
  });
}

fetchMovies("/movie/popular");
fetchGenres();
displayWatchlist();
fetchCarouselMovies();
function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");

    window.location.href = "index.html";
}