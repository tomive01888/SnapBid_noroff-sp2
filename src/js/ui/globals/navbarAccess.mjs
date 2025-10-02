/**
 * Generates the navigation bar with active states based on the current route.
 * The navbar contains links to "Home", "New Listing", "My Profile", and a dynamic "Login/Logout" button based on authentication status.
 *
 * @returns {HTMLElement} The navbar element with its corresponding buttons.
 */
export function generateNavbar() {
  const nav = document.getElementById("navbar");
  nav.replaceChildren();

  const currentPath = window.location.pathname;
  const token = sessionStorage.getItem("token");

  const isHome = currentPath === "/" || (currentPath === "/index.html" && currentPath !== "/");
  const isProfile = currentPath.startsWith("/profile/");
  const isAuth = currentPath.startsWith("/auth/");

  if (token) {
    ["New Listing", "My Profile"].forEach((text, index) => {
      const btn = document.createElement("a");
      btn.href = index === 0 ? "/post/create/index.html" : "/profile/listing/index.html";
      btn.textContent = text;
      btn.className =
        "cursor-pointer text-xl text-white text-center w-28 px-2 py-1 border-1 border-blue-700 rounded-md transition-colors duration-500 " +
        ((index === 0 && currentPath.startsWith("/post/create/")) || (index === 1 && isProfile)
          ? "bg-blue-500 pointer-events-none"
          : "bg-blue-600 hover:bg-blue-400/40");

      nav.appendChild(btn);
    });
  }

  const homeBtn = document.createElement("a");
  homeBtn.href = "/";
  homeBtn.textContent = "Home";
  homeBtn.className =
    "cursor-pointer text-xl text-white text-center w-28 px-2 py-1 border-1 border-blue-700 rounded-md transition-colors duration-500 " +
    (isHome ? "bg-blue-500 pointer-events-none" : "bg-blue-600 hover:bg-blue-400/40");
  nav.appendChild(homeBtn);

  const authBtn = document.createElement("a");
  authBtn.href = token ? "#" : "/auth/index.html";
  authBtn.textContent = token ? "Logout" : "Login";
  const authBtnBaseClasses =
    "cursor-pointer text-2xl font-custom text-white text-center w-26 border-1 rounded-full transition-colors duration-500";

  let colorClasses;
  if (token) {
    colorClasses = "bg-red-500 border-red-700 hover:bg-red-400/30";
  } else if (isAuth) {
    colorClasses = "bg-blue-500 pointer-events-none";
  } else {
    colorClasses = "bg-green-500 border-green-700 hover:bg-green-400/30";
  }

  authBtn.className = `${authBtnBaseClasses} ${colorClasses}`;

  if (token) {
    authBtn.addEventListener("click", logoutEvent);
  }

  nav.appendChild(authBtn);

  return nav;
}

/**
 * Logs out the user by clearing session storage and redirecting to the homepage.
 */
function logoutEvent() {
  localStorage.setItem("logged-out", true);
  sessionStorage.clear();
  window.location.href = "/";
}
