const storedUser = localStorage.getItem("loggedInUser");
const welcomeName = document.getElementById("welcomeName");
const welcomeRole = document.getElementById("welcomeRole");
const logoutBtn = document.getElementById("logoutBtn");

if (!storedUser) {
  window.location.href = "./index.html";
} else {
  const user = JSON.parse(storedUser);
  welcomeName.textContent = user.fullName || user.username;
  welcomeRole.textContent = `Role: ${user.role}`;
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "./index.html";
});