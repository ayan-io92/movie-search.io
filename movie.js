const API_KEY = "8b673d766321b78f39ca2f6a51b3c305";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const NO_POSTER = "https://placehold.co/500x750/png?text=No+Poster";
const NO_IMAGE = "https://placehold.co/780x440/png?text=No+Image";

let selectedMovie = null;
let currentMovieId = null;

const movieContainer = document.getElementById("movieContainer");
const genreGrid = document.getElementById("genreGrid");
const watchlistGrid = document.getElementById("watchlistGrid");

const searchInput =
  document.getElementById("searchInput") || document.getElementById("search");

const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");

const movieModalElement = document.getElementById("movieModal");

const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieRating = document.getElementById("movieRating");
const movieReleaseDate = document.getElementById("movieReleaseDate");
const movieLanguage = document.getElementById("movieLanguage");
const movieOverview = document.getElementById("movieOverview");

const addToWatchlist = document.getElementById("addToWatchlist");

const userAvatar = document.getElementById("userAvatar");
const userDropdown = document.getElementById("userDropdown");
const closeUserDropdown = document.getElementById("closeUserDropdown");

const dropdownAvatar = document.getElementById("dropdownAvatar");
const dropdownUsername = document.getElementById("dropdownUsername");
const dropdownEmail = document.getElementById("dropdownEmail");

const loggedInOptions = document.getElementById("loggedInOptions");
const loggedOutOptions = document.getElementById("loggedOutOptions");

const changePasswordBtn = document.getElementById("changePasswordBtn");

const logoutBtn = document.getElementById("logoutBtn");

const signupBtn = document.getElementById("signupBtn");

const profileLoginBtn = document.getElementById("profileLoginBtn");

const changePasswordForm = document.getElementById("changePasswordForm");

const passwordMessage = document.getElementById("passwordMessage");

const commentForm = document.getElementById("commentForm");

const commentInput = document.getElementById("commentInput");

const commentBtn = document.getElementById("commentBtn");

const commentMessage = document.getElementById("commentMessage");

const commentsContainer = document.getElementById("commentsContainer");

const commentCharacters = document.getElementById("commentCharacters");

const commentCount = document.getElementById("commentCount");

function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser"));
  } catch (error) {
    return null;
  }
}

function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  } catch (error) {
    return [];
  }
}

function saveWatchlist(watchlist) {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

async function fetchMovies(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    if (message) {
      message.textContent = "Unable to load movies right now.";
    }

    return [];
  }
}

function createMovieCard(movie) {
  const poster = movie.poster_path ? IMAGE_URL + movie.poster_path : NO_POSTER;

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  const releaseDate = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "N/A";

  return ` <div class="movie">
<img src="${poster}" alt="${escapeHTML(movie.title || "Movie")}">

        <div class="movie-info">
            <h2 title="${escapeHTML(movie.title || "Untitled")}">
                ${escapeHTML(movie.title || "Untitled")}
            </h2>

            <p>
                ${releaseDate}
                <span class="mx-1">•</span>
                <span class="rating">
                    <i class="fa-solid fa-star"></i>
                    ${rating}
                </span>
            </p>

            <button
                type="button"
                class="details-btn"
                onclick="openMovieDetails(${movie.id})"
            >
                View Details
            </button>
        </div>
    </div>
`;
}

function displayMovies(movies) {
  if (!movieContainer) {
    return;
  }

  if (!movies.length) {
    movieContainer.innerHTML = `             <div class="empty-message">                 <i class="fa-solid fa-film mb-3"></i>                 <p>No movies found.</p>             </div>
        `;

    return;
  }

  movieContainer.innerHTML = movies.map(createMovieCard).join("");
}

async function loadPopularMovies() {
  if (message) {
    message.textContent = "Loading movies...";
  }

  const movies = await fetchMovies(
    `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
  );

  displayMovies(movies);

  if (message) {
    message.textContent = movies.length
      ? `${movies.length} movies available`
      : "";
  }
}

function searchMovie() {
  if (!searchInput) {
    return;
  }

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
  searchButton.addEventListener("input", function () {
    searchMovie();
  });
}
async function loadGenres() {
  if (!genreGrid) {
    return;
  }

  const response = await fetch(
    `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
  );

  if (!response.ok) {
    return;
  }

  const data = await response.json();

  genreGrid.innerHTML = "";

  data.genres.forEach(function (genre) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "filter";
    button.textContent = genre.name;

    button.addEventListener("click", function () {
      loadMoviesByGenre(genre.id, genre.name);
    });

    genreGrid.appendChild(button);
  });
}

async function loadMoviesByGenre(genreId, genreName) {
  if (message) {
    message.textContent = `Loading ${genreName} movies...`;
  }

  const movies = await fetchMovies(
    `${API_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=1`,
  );

  displayMovies(movies);

  if (message) {
    message.textContent = `${genreName} movies`;
  }

  const moviesSection = document.getElementById("movies");

  if (moviesSection) {
    moviesSection.scrollIntoView({
      behavior: "smooth",
    });
  }
}

async function openMovieDetails(movieId) {
  const response = await fetch(
    `${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
  );

  if (!response.ok) {
    return;
  }

  const movie = await response.json();

  selectedMovie = movie;
  currentMovieId = movie.id;

  if (moviePoster) {
    moviePoster.src = movie.poster_path
      ? IMAGE_URL + movie.poster_path
      : NO_POSTER;

    moviePoster.alt = movie.title || "Movie";
  }

  if (movieTitle) {
    movieTitle.textContent = movie.title || "Untitled";
  }

  if (movieRating) {
    movieRating.innerHTML = `             <i class="fa-solid fa-star"></i>
            ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        `;
  }

  if (movieReleaseDate) {
    movieReleaseDate.textContent = movie.release_date || "N/A";
  }

  if (movieLanguage) {
    movieLanguage.textContent = movie.original_language
      ? movie.original_language.toUpperCase()
      : "N/A";
  }

  if (movieOverview) {
    movieOverview.textContent = movie.overview || "No overview available.";
  }

  updateWatchlistButton();

  loadComments(movie.id);

  if (movieModalElement) {
    const modal = bootstrap.Modal.getOrCreateInstance(movieModalElement);

    modal.show();
  }
}

function updateWatchlistButton() {
  if (!addToWatchlist || !selectedMovie) {
    return;
  }

  const watchlist = getWatchlist();

  const exists = watchlist.some(function (movie) {
    return movie.id === selectedMovie.id;
  });

  if (exists) {
    addToWatchlist.innerHTML = `             <i class="fa-solid fa-check me-2"></i>
            Added to Watchlist
        `;
  } else {
    addToWatchlist.innerHTML = `             <i class="fa-solid fa-plus me-2"></i>
            Add to Watchlist
        `;
  }
}

function toggleWatchlist() {
  if (!selectedMovie) {
    return;
  }

  let watchlist = getWatchlist();

  const movieIndex = watchlist.findIndex(function (movie) {
    return movie.id === selectedMovie.id;
  });

  if (movieIndex !== -1) {
    watchlist.splice(movieIndex, 1);
  } else {
    watchlist.push({
      id: selectedMovie.id,
      title: selectedMovie.title,
      poster_path: selectedMovie.poster_path,
      release_date: selectedMovie.release_date,
      vote_average: selectedMovie.vote_average,
      overview: selectedMovie.overview,
      original_language: selectedMovie.original_language,
    });
  }

  saveWatchlist(watchlist);

  updateWatchlistButton();
  displayWatchlist();
}

function displayWatchlist() {
  if (!watchlistGrid) {
    return;
  }

  const watchlist = getWatchlist();

  if (!watchlist.length) {
    watchlistGrid.innerHTML = `             <div class="empty-message">                 <i class="fa-solid fa-bookmark mb-3"></i>                 <p>Your watchlist is empty.</p>                 <span>Add movies you want to watch later.</span>             </div>
        `;

    return;
  }

  watchlistGrid.innerHTML = watchlist.map(createMovieCard).join("");
}

function loadUserProfile() {
  const loggedInUser = getLoggedInUser();

  if (loggedInUser) {
    const username = loggedInUser.username || "User";

    const email = loggedInUser.email || "";

    const firstLetter = username.charAt(0).toUpperCase();

    if (userAvatar) {
      userAvatar.innerHTML = firstLetter;
    }

    if (dropdownAvatar) {
      dropdownAvatar.innerHTML = firstLetter;
    }

    if (dropdownUsername) {
      dropdownUsername.textContent = username;
    }

    if (dropdownEmail) {
      dropdownEmail.textContent = email;
    }

    if (loggedInOptions) {
      loggedInOptions.style.display = "flex";
    }

    if (loggedOutOptions) {
      loggedOutOptions.style.display = "none";
    }
  } else {
    if (userAvatar) {
      userAvatar.innerHTML = `                 <i class="fa-regular fa-user"></i>
            `;
    }

    if (dropdownAvatar) {
      dropdownAvatar.innerHTML = `
            <i class="fa-regular fa-user"></i>
        `;
    }

    if (dropdownUsername) {
      dropdownUsername.textContent = "No User";
    }

    if (dropdownEmail) {
      dropdownEmail.textContent = "No account is logged in";
    }

    if (loggedInOptions) {
      loggedInOptions.style.display = "none";
    }

    if (loggedOutOptions) {
      loggedOutOptions.style.display = "flex";
    }
  }
}

function openUserDropdown() {
  if (userDropdown) {
    userDropdown.classList.add("show");
  }
}

function closeUserDropdownMenu() {
  if (userDropdown) {
    userDropdown.classList.remove("show");
  }
}

function logoutUser() {
  localStorage.removeItem("loggedInUser");

  closeUserDropdownMenu();

  loadUserProfile();

  window.location.href = "authentication.html";
}

function openSignupPage() {
  window.location.href = "authentication.html?page=signup";
}

function openLoginPage() {
  window.location.href = "authentication.html";
}

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = value || "";

  return div.innerHTML;
}

function getComments(movieId) {
  try {
    const allComments = JSON.parse(localStorage.getItem("movieComments")) || {};

    return allComments[movieId] || [];
  } catch (error) {
    return [];
  }
}

function saveComments(movieId, comments) {
  let allComments = {};

  try {
    allComments = JSON.parse(localStorage.getItem("movieComments")) || {};
  } catch (error) {
    allComments = {};
  }

  allComments[movieId] = comments;

  localStorage.setItem("movieComments", JSON.stringify(allComments));
}

function loadComments(movieId) {
  if (!commentsContainer) {
    return;
  }

  const comments = getComments(movieId);

  if (!comments.length) {
    commentsContainer.innerHTML = `             <div class="no-comments">                 <i class="fa-regular fa-comment"></i>                 <p>No comments yet.</p>                 <span>Be the first to share your thoughts.</span>             </div>
        `;

    return;
  }

  commentsContainer.innerHTML = comments
    .map(function (comment) {
      return createCommentHTML(comment);
    })
    .join("");
}

function createCommentHTML(comment) {
  const username = comment.username || "User";

  const firstLetter = username.charAt(0).toUpperCase();

  return ` <div class="comment" data-comment-id="${comment.id}">


        <div class="comment-header">

            <div class="comment-avatar">
            ${firstLetter}
            </div>

            <div>
                <div class="comment-user">
                    ${username}
                </div>

                <div class="comment-date">
                    ${escapeHTML(comment.date)}
                </div>
            </div>

        </div>

        <div class="comment-text">
            ${escapeHTML(comment.text)}
        </div>

        <div class="comment-actions">

            <button
                type="button"
                class="comment-action"
                onclick="editComment('${comment.id}')"
            >
                <i class="fa-solid fa-pen me-1"></i>
                Edit
            </button>

            <button
                type="button"
                class="comment-action delete"
                onclick="deleteComment('${comment.id}')"
            >
                <i class="fa-solid fa-trash me-1"></i>
                Delete
            </button>

        </div>

    </div>
`;
}

function addComment() {
  if (!commentInput || !commentBtn) {
    return;
  }

  const commentText = commentInput.value.trim();

  if (commentMessage) {
    commentMessage.textContent = "";
    commentMessage.className = "small mt-2";
  }

  if (!commentText) {
    if (commentMessage) {
      commentMessage.textContent = "Please write a comment first.";

      commentMessage.classList.add("text-warning");
    }

    return;
  }

  const loggedInUser = getLoggedInUser();

  if (!loggedInUser) {
    if (commentMessage) {
      commentMessage.textContent = "Please sign up first.";

      commentMessage.classList.add("text-danger");
    }

    return;
  }

  if (!currentMovieId) {
    return;
  }

  const username = loggedInUser.username || "User";

  const comments = getComments(currentMovieId);

  const newComment = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 8),

    username: username,

    email: loggedInUser.email || "",

    text: commentText,

    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };

  comments.unshift(newComment);

  saveComments(currentMovieId, comments);

  commentInput.value = "";

  if (commentCharacters) {
    commentCharacters.textContent = "";
  }

  if (commentMessage) {
    commentMessage.textContent = "Comment added successfully.";

    commentMessage.className = "small mt-2 text-success";
  }

  loadComments(currentMovieId);
}

function deleteComment(commentId) {
  if (!currentMovieId) {
    return;
  }

  const loggedInUser = getLoggedInUser();

  if (!loggedInUser) {
    return;
  }

  let comments = getComments(currentMovieId);

  const comment = comments.find(function (item) {
    return item.id === commentId;
  });

  if (!comment) {
    return;
  }

  if (comment.email !== (loggedInUser.email || "")) {
    return;
  }

  comments = comments.filter(function (item) {
    return item.id !== commentId;
  });

  saveComments(currentMovieId, comments);

  loadComments(currentMovieId);
}

function editComment(commentId) {
  if (!currentMovieId) {
    return;
  }

  const loggedInUser = getLoggedInUser();

  if (!loggedInUser) {
    return;
  }

  const comments = getComments(currentMovieId);

  const comment = comments.find(function (item) {
    return item.id === commentId;
  });

  if (!comment) {
    return;
  }

  if (comment.email !== (loggedInUser.email || "")) {
    return;
  }

  const newText = prompt("Edit your comment:", comment.text);

  if (newText === null) {
    return;
  }

  const updatedText = newText.trim();

  if (!updatedText) {
    return;
  }

  comment.text = updatedText;

  saveComments(currentMovieId, comments);

  loadComments(currentMovieId);
}

if (searchInput) {
  searchInput.addEventListener("input", function (event) {
    searchMovies();
  });
}

if (addToWatchlist) {
  addToWatchlist.addEventListener("click", toggleWatchlist);
}

if (userAvatar) {
  userAvatar.addEventListener("click", function (event) {
    event.stopPropagation();

    if (userDropdown && userDropdown.classList.contains("show")) {
      closeUserDropdownMenu();
    } else {
      openUserDropdown();
    }
  });
}

if (closeUserDropdown) {
  closeUserDropdown.addEventListener("click", function () {
    closeUserDropdownMenu();
  });
}

document.addEventListener("click", function (event) {
  if (
    userDropdown &&
    userAvatar &&
    !userDropdown.contains(event.target) &&
    !userAvatar.contains(event.target)
  ) {
    closeUserDropdownMenu();
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutUser);
}

if (signupBtn) {
  signupBtn.addEventListener("click", openSignupPage);
}

if (profileLoginBtn) {
  profileLoginBtn.addEventListener("click", openLoginPage);
}

function openChangePasswordPage() {
  closeUserDropdownMenu();
  window.location.href = "authentication.html?page=changePassword";
}

if (changePasswordBtn) {
  changePasswordBtn.addEventListener("click", openChangePasswordPage);
}

if (changePasswordForm) {
  changePasswordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
      return;
    }

    const oldPassword = document.getElementById("oldPassword")?.value.trim();

    const newPassword = document.getElementById("newPassword")?.value.trim();

    const confirmNewPassword = document
      .getElementById("confirmNewPassword")
      ?.value.trim();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      if (passwordMessage) {
        passwordMessage.textContent = "Please fill in all fields.";

        passwordMessage.className = "text-danger";
      }

      return;
    }

    if (newPassword.length < 6) {
      if (passwordMessage) {
        passwordMessage.textContent =
          "New password must be at least 6 characters.";

        passwordMessage.className = "text-danger";
      }

      return;
    }

    if (newPassword !== confirmNewPassword) {
      if (passwordMessage) {
        passwordMessage.textContent = "New passwords do not match.";

        passwordMessage.className = "text-danger";
      }

      return;
    }

    let users = [];

    try {
      users = JSON.parse(localStorage.getItem("users")) || [];
    } catch (error) {
      users = [];
    }

    const userIndex = users.findIndex(function (user) {
      return user.email === loggedInUser.email;
    });

    if (userIndex === -1) {
      if (passwordMessage) {
        passwordMessage.textContent = "User account not found.";

        passwordMessage.className = "text-danger";
      }

      return;
    }

    if (users[userIndex].password !== oldPassword) {
      if (passwordMessage) {
        passwordMessage.textContent = "Old password is incorrect.";

        passwordMessage.className = "text-danger";
      }

      return;
    }

    users[userIndex].password = newPassword;

    localStorage.setItem("users", JSON.stringify(users));

    if (passwordMessage) {
      passwordMessage.textContent = "Password changed successfully.";

      passwordMessage.className = "text-success";
    }

    changePasswordForm.reset();

    setTimeout(function () {
      const modalElement = document.getElementById("changePasswordModal");

      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
          modal.hide();
        }
      }

      if (passwordMessage) {
        passwordMessage.textContent = "";
      }
    }, 1200);
  });
}

if (commentBtn) {
  commentBtn.addEventListener("click", addComment);
}

if (commentInput && commentCharacters) {
  commentInput.addEventListener("input", function () {
    commentCharacters.textContent = `${commentInput.value.length} characters`;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadPopularMovies();
  loadGenres();
  displayWatchlist();
  loadUserProfile();
});
