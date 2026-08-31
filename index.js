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
                <p class="mt-3 text-secondary">Unable to load movies.</p>
            </div>
        `;
  }
}
fetchMovies("/movie/popular");

function displayMovies(movies) {
  if (!movies.length) {
    movieGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-film fs-1 text-secondary"></i>
                <h4 class="mt-3">No movies found</h4>
                <p class="text-secondary">
                    Try searching for another movie.
                </p>
            </div>
        `;
    return;
  }

  movieGrid.innerHTML = movies
    .map((movie) => {
      const poster = movie.poster_path
        ? `${IMAGE_URL}${movie.poster_path}`
        : "https://placehold.co/600x900?text=No+Image";

      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

      const year = movie.release_date
        ? movie.release_date.substring(0, 4)
        : "Unknown";

      return `
            <div class="col-md-3 col-sm-6 mb-4">
                <div class="card h-100 shadow-sm">

                    <img 
                        src="${poster}" 
                        class="card-img-top"
                        alt="${movie.title}"
                    >

                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>

                        <p class="card-text text-secondary">
                            ${movie.overview || "No description available."}
                        </p>

                        <div class="d-flex justify-content-between">
                            <span>
                                <i class="bi bi-star-fill text-warning"></i>
                                ${rating}
                            </span>

                            <span class="text-secondary">
                                ${year}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        `;
    })
    .join("");
}
