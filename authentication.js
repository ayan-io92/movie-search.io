let users = JSON.parse(localStorage.getItem("users")) || [];

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotPasswordForm = document.getElementById("forgotPassword");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const showForgot = document.getElementById("showForgot");
const backToLogin = document.getElementById("backToLogin");

function showForm(formName) {
  loginForm.style.display = formName === "login" ? "block" : "none";
  signupForm.style.display = formName === "signup" ? "block" : "none";
  forgotPasswordForm.style.display = formName === "forgot" ? "block" : "none";
}

showSignup.addEventListener("click", function (e) {
  e.preventDefault();
  showForm("signup");
});

showLogin.addEventListener("click", function (e) {
  e.preventDefault();
  showForm("login");
});

showForgot.addEventListener("click", function (e) {
  e.preventDefault();
  showForm("forgot");
});

backToLogin.addEventListener("click", function (e) {
  e.preventDefault();
  showForm("login");
});

document.querySelectorAll(".toggle-password").forEach(function (icon) {
  icon.addEventListener("click", function () {
    const targetId = icon.dataset.target;
    const input = document.getElementById(targetId);

    if (!input) {
      return;
    }

    if (input.type === "password") {
      input.type = "text";

      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";

      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

document.getElementById("login").addEventListener("submit", function (e) {
  e.preventDefault();

  users = JSON.parse(localStorage.getItem("users")) || [];

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");

  const user = users.find(function (item) {
    return item.email === email;
  });

  if (!user) {
    message.textContent = "This email does not exist.";
    message.style.color = "#dc3545";
    return;
  }

  if (user.password !== password) {
    message.textContent = "Invalid email or password.";
    message.style.color = "#dc3545";
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  message.textContent = `Welcome, ${user.username}!`;
  message.style.color = "#28a745";

  document.getElementById("login").reset();

  setTimeout(function () {
    message.textContent = "";
    window.location.href = "index.html";
  }, 1200);
});

document.getElementById("signup").addEventListener("submit", function (e) {
  e.preventDefault();

  users = JSON.parse(localStorage.getItem("users")) || [];

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const message = document.getElementById("signupMessage");

  if (username.length < 2) {
    message.textContent = "Please enter a valid username.";
    message.style.color = "#dc3545";
    return;
  }

  const existingUser = users.find(function (user) {
    return user.email.toLowerCase() === email.toLowerCase();
  });

  if (existingUser) {
    message.textContent = "An account with this email already exists.";
    message.style.color = "#dc3545";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    message.style.color = "#dc3545";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    message.style.color = "#dc3545";
    return;
  }

  const newUser = {
    username: username,
    email: email,
    password: password,
    avatar: "",
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  message.textContent = "Account created successfully.";
  message.style.color = "#28a745";

  document.getElementById("signup").reset();

  setTimeout(function () {
    message.textContent = "";

    showForm("login");

    document.getElementById("loginEmail").value = email;
  }, 1200);
});

document
  .getElementById("resetPassword")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    users = JSON.parse(localStorage.getItem("users")) || [];

    const email = document.getElementById("forgotEmail").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmNewPassword")
      .value.trim();

    const message = document.getElementById("forgotMessage");

    const userIndex = users.findIndex(function (user) {
      return user.email.toLowerCase() === email.toLowerCase();
    });

    if (userIndex === -1) {
      message.textContent = "Email address not found.";
      message.style.color = "#dc3545";
      return;
    }

    if (newPassword.length < 6) {
      message.textContent = "Password must be at least 6 characters.";
      message.style.color = "#dc3545";
      return;
    }

    if (newPassword !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      message.style.color = "#dc3545";
      return;
    }

    users[userIndex].password = newPassword;

    localStorage.setItem("users", JSON.stringify(users));

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (
      loggedInUser &&
      loggedInUser.email.toLowerCase() === email.toLowerCase()
    ) {
      loggedInUser.password = newPassword;

      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    }

    message.textContent = "Password reset successfully.";
    message.style.color = "#28a745";

    document.getElementById("resetPassword").reset();

    setTimeout(function () {
      message.textContent = "";

      showForm("login");

      document.getElementById("loginEmail").value = email;
    }, 1500);
  });

const changePassword = document.getElementById("changePassword");
const parms = new URLSearchParams(window.location.search);
const page = parms.get("page");

if (page === "changePassword") {
  signupForm.style.display = "none";
  loginForm.style.display = "none";
  changePassword.style.display = "block";
} else if (page === "signup") {
  changePassword.style.display = "none";
  loginForm.style.display = "none";
  signupForm.style.display = "block";
}
