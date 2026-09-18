let users = JSON.parse(localStorage.getItem("users")) || [];

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotPasswordForm = document.getElementById("forgotPassword");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const showForgot = document.getElementById("showForgot");
const backToLogin = document.getElementById("backToLogin");

showSignup.addEventListener("click", (e) => {
  e.preventDefault();

  loginForm.style.display = "none";
  signupForm.style.display = "block";
  forgotPasswordForm.style.display = "none";
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();

  loginForm.style.display = "block";
  signupForm.style.display = "none";
  forgotPasswordForm.style.display = "none";
});

showForgot.addEventListener("click", (e) => {
  e.preventDefault();

  loginForm.style.display = "none";
  signupForm.style.display = "none";
  forgotPasswordForm.style.display = "block";
});

backToLogin.addEventListener("click", (e) => {
  e.preventDefault();

  loginForm.style.display = "block";
  signupForm.style.display = "none";
  forgotPasswordForm.style.display = "none";
});

document.getElementById("login").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");

  const user = users.find((u) => {
    return u.email === email && u.password === password;
  });

  if (!user) {
    message.textContent = "Invalid email or password.";
    message.style.color = "red";
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  message.textContent = `Welcome, ${user.username}!`;
  message.style.color = "green";

  setTimeout(() => {
    window.location.href = "home.html";
  }, 3000);
});

document.getElementById("signup").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  const message = document.getElementById("signupMessage");

  const existingUser = users.find((u) => {
    return u.email === email;
  });

  if (existingUser) {
    message.textContent = "An account with this email already exists.";
    message.style.color = "red";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    message.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    message.style.color = "red";
    return;
  }

  const newUser = {
    username: username,
    email: email,
    password: password,
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  message.textContent = "Account created successfully!";
  message.style.color = "green";
  loginForm.style.display = "block";
  signupForm.style.display = "none";

  document.getElementById("signup").reset();
});

document.getElementById("resetPassword").addEventListener("submit", (e) => {
  e.preventDefault();

  forgotPassword();
});

function forgotPassword() {
  const email = document.getElementById("forgotEmail").value.trim();

  const newPassword = document.getElementById("newPassword").value.trim();

  const confirmPassword = document
    .getElementById("confirmNewPassword")
    .value.trim();

  const message = document.getElementById("forgotMessage");

  const user = users.find((u) => {
    return u.email === email;
  });

  if (!user) {
    message.textContent = "Email address not found.";
    message.style.color = "red";
    return;
  }

  if (newPassword.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    message.style.color = "red";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    message.style.color = "red";
    return;
  }

  user.password = newPassword;

  localStorage.setItem("users", JSON.stringify(users));

  message.textContent = "Password reset successfully!";
  message.style.color = "green";

  document.getElementById("resetPassword").reset();

  setTimeout(() => {
    forgotPasswordForm.style.display = "none";
    loginForm.style.display = "block";

    message.textContent = "";
  }, 2000);
}

function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  icon.addEventListener("click", () => {
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
}
login.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (email && password) {
    document.getElementById("loginMessage").textContent = "Login successful!";

    login.reset();
  }
});
login.addEventListener("submit", function (e) {
  e.preventDefault();

  const spinner = document.getElementById("loginSpinner");
  const loginText = document.getElementById("loginText");

  spinner.classList.remove("d-none");
  loginText.textContent = "Loading...";

  setTimeout(() => {
    spinner.classList.add("d-none");
    loginText.textContent = "Login";
  }, 1000);
});
