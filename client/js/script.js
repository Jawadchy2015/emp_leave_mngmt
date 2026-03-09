const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const formMessage = document.getElementById("formMessage");

function showFieldError(element, message) {
  element.textContent = message;
  element.classList.remove("hidden");
}

function clearFieldError(element) {
  element.textContent = "";
  element.classList.add("hidden");
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.classList.remove("hidden");

  if (type === "success") {
    formMessage.className =
      "rounded-xl px-4 py-3 text-sm bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
  } else {
    formMessage.className =
      "rounded-xl px-4 py-3 text-sm bg-red-500/15 text-red-300 border border-red-500/20";
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  clearFieldError(usernameError);
  clearFieldError(passwordError);
  formMessage.classList.add("hidden");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  let isValid = true;

  if (!username) {
    showFieldError(usernameError, "Username is required.");
    isValid = false;
  }

  if (!password) {
    showFieldError(passwordError, "Password is required.");
    isValid = false;
  }

  if (!isValid) return;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showFormMessage(data.message || "Login failed.", "error");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
    showFormMessage("Login successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 800);
  } catch (error) {
    showFormMessage("Unable to connect to server.", "error");
  }
});