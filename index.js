const API_KEY = "8b673d766321b78f39ca2f6a51b3c305";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieGrid = document.getElementById("movieGrid");
const genreGrid = document.getElementById("genreGrid");
const watchlistGrid = document.getElementById("watchlistGrid");
const emptyWatchlist = document.getElementById("emptyWatchlist");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalRating = document.getElementById("modalRating");
const modalOverview = document.getElementById("modalOverview");
const watchlistBtn = document.getElementById("watchlistBtn");

let selectedMovie = null;

async function fetchMovies(endpoint) {
  try {
    movieGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-danger"></div>
                <p class="mt-3 text-secondary">Loading movies...</p>
            </div>
        `;

    const response = await fetch(
      `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();

    console.log("result", data.results);

    displayMovies(data.results);
  } catch (error) {
    console.log(error);

    movieGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="mt-3 text-secondary">
                    Unable to load movies.
                </p>
            </div>
        `;
  }
}

fetchMovies("/movie/popular");

function displayMovies(movies) {
  if (!movies.length) {
    movieGrid.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-secondary">No movies found.</p>
            </div>
        `;
    return;
  }

  movieGrid.innerHTML = movies
    .map((movie) => {
      const poster = movie.poster_path
        ? `${IMAGE_URL}${movie.poster_path}`
        : "https://placehold.co/600x900/png";

      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

      const year = movie.release_date
        ? movie.release_date.substring(0, 4)
        : "Unknown";

      return `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card movie-card h-100 bg-black text-white border-secondary">

                        <img
                            src="${poster}"
                            class="card-img-top"
                            alt="${movie.title}"
                            style="height: 380px; object-fit: cover;"
                        >

                        <div class="card-body d-flex flex-column">

                            <h5 class="card-title">
                                ${movie.title}
                            </h5>

                            <div class="d-flex justify-content-between align-items-center mb-3">

                                <span class="text-secondary">
                                    ${year}
                                </span>

                                <span class="text-warning">
                                    <i class="bi bi-star-fill"></i>
                                    ${rating}
                                </span>

                            </div>

                            <button
                                class="btn btn-danger mt-auto"
                                onclick='openMovieModal(${JSON.stringify(movie).replace(/'/g, "&apos;")})'
                            >
                                View Details
                            </button>

                        </div>

                    </div>
                </div>
            `;
    })
    .join("");
}

function searchMovies() {
  const query = searchInput.value.trim();

  if (!query) {
    fetchMovies("/movie/popular");
    return;
  }

  fetchMovies(`/search/movie?query=${encodeURIComponent(query)}`);
}

searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

categoryBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.type;

    searchInput.value = "";

    fetchMovies(`/movie/${type}`);

    setActiveCategory(type);
  });
});

function setActiveCategory(type) {
  categoryBtns.forEach((button) => {
    if (button.dataset.type === type) {
      button.classList.remove("btn-outline-light");
      button.classList.add("btn-danger");
    } else {
      button.classList.remove("btn-danger");
      button.classList.add("btn-outline-light");
    }
  });
}

fetchMovies("/movie/popular");
