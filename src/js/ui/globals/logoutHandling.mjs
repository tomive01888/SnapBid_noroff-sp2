export function logoutListener() {
  localStorage.setItem("logged-out", true);
  sessionStorage.clear();
  window.location.href = "/";
}

export function updateUIForLogout() {
  document.getElementById("profile-wrapper").classList.add("hidden");
  document.getElementById("wallet-wrapper").classList.add("hidden");
}
