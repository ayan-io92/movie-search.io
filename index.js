const API_KEY = "8b673d766321b78f39ca2f6a51b3c305";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("search");
const message = document.getElementById("message");

const genreGrid = document.getElementById("genreGrid");
const watchlistGrid = document.getElementById("watchlistGrid");

let watchlist = [];

/* Get Movies */

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

/* Display Movies */

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

                    <button
                        onclick='addToWatchlist(${JSON.stringify(movie)})'
                        style="
                            margin-top: 10px;
                            padding: 8px 12px;
                            border: none;
                            border-radius: 5px;
                            background: #ef304d;
                            color: white;
                            cursor: pointer;
                        "
                    >
                        Add to Watchlist
                    </button>

                </div>

            </div>
        `;
    })
    .join("");
}

/* Search Movies */

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

/* Search Button */

const searchButton = document.querySelector(".search-area button");

if (searchButton) {
  searchButton.addEventListener("click", function () {
    searchMovie();
  });
}

/* Search With Enter */

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie();
  }
});

/* Filter Buttons */

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

// /* Genres */

// async function fetchGenres() {
//   try {
//     const response = await fetch(
//       `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
//     );

//     const data = await response.json();

//     displayGenres(data.genres || []);
//   } catch (error) {
//     console.error("Genre error:", error);
//   }
// }

// function displayGenres(genres) {
//   if (!genreGrid) {
//     return;
//   }

//   genreGrid.innerHTML = genres
//     .map(function (genre) {
//       return `
//             <button
//                 class="filter"
//                 onclick="searchGenre(${genre.id})"
//             >
//                 ${genre.name}
//             </button>
//         `;
//     })
//     .join("");
// }

// /* Search By Genre */

// function searchGenre(genreId) {
//   searchInput.value = "";

//   fetchMovies(`/discover/movie?with_genres=${genreId}`);

//   document.getElementById("movies").scrollIntoView({
//     behavior: "smooth",
//   });
// }

// /* Watchlist */

// function addToWatchlist(movie) {
//   const alreadyAdded = watchlist.some(function (item) {
//     return item.id === movie.id;
//   });

//   if (alreadyAdded) {
//     message.textContent = "Movie is already in your watchlist.";

//     return;
//   }

//   watchlist.push(movie);

//   message.textContent = `${movie.title} added to watchlist.`;

//   displayWatchlist();
// }

// function displayWatchlist() {
//   if (!watchlistGrid) {
//     return;
//   }

//   if (watchlist.length === 0) {
//     watchlistGrid.innerHTML =
//       "<p class='empty-message'>Your watchlist is empty</p>";

//     return;
//   }

//   watchlistGrid.innerHTML = watchlist
//     .map(function (movie) {
//       let poster = "https://placehold.co/500x750/png?text=No+Poster";

//       if (movie.poster_path) {
//         poster = IMAGE_URL + movie.poster_path;
//       }

//       return `
//                 <div class="movie">

//                     <img
//                         src="${poster}"
//                         alt="${movie.title}"
//                     >

//                     <div class="movie-info">

//                         <h2>${movie.title}</h2>

//                         <p class="rating">
//                             ⭐ ${
//                               movie.vote_average
//                                 ? movie.vote_average.toFixed(1)
//                                 : "N/A"
//                             }
//                         </p>

//                         <button
//                             onclick="removeFromWatchlist(${movie.id})"
//                             style="
//                                 margin-top: 10px;
//                                 padding: 8px 12px;
//                                 border: none;
//                                 border-radius: 5px;
//                                 background: #555;
//                                 color: white;
//                                 cursor: pointer;
//                             "
//                         >
//                             Remove
//                         </button>

//                     </div>

//                 </div>
//             `;
//     })
//     .join("");
// }

// /* Remove From Watchlist */

// function removeFromWatchlist(movieId) {
//   watchlist = watchlist.filter(function (movie) {
//     return movie.id !== movieId;
//   });

//   displayWatchlist();
// }

// /* Load Movies When Page Opens */

// fetchMovies("/movie/popular");

// fetchGenres();

// displayWatchlist();
