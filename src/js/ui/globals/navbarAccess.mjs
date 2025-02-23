/**
 * Generates the navigation bar with active states based on the current route.
 * The navbar contains links to "Home", "Account", or "My Profile" and a "Logout" button when the user is authenticated.
 *
 * @returns {HTMLElement} The navbar element with its corresponding buttons
 */
export function generateNavbar() {
  const nav = document.getElementById("navbar");
  nav.innerHTML = "";

  const currentPath = window.location.pathname;

  const isAuth = currentPath.startsWith("/auth/");
  const isProfile = currentPath.startsWith("/profile/");
  const isHome = !isAuth && !isProfile && (currentPath === "/" || currentPath.endsWith("/index.html"));

  function createNavButton(text, href, isActive) {
    const btn = document.createElement("a");
    btn.href = href;
    btn.textContent = text;
    btn.className =
      "cursor-pointer text-xl text-white text-center w-36 border-1 border-blue-700 rounded-md transition-colors duration-500 " +
      (isActive ? "bg-blue-500 pointer-events-none" : "bg-blue-600 hover:bg-blue-400/30");

    return btn;
  }

  const homeBtn = createNavButton("Home", "/", isHome);
  nav.appendChild(homeBtn);

  if (!sessionStorage.getItem("token")) {
    const accountBtn = createNavButton("Account", "/auth/index.html", isAuth);
    nav.appendChild(accountBtn);
  } else {
    const profileBtn = createNavButton("My Profile", "/profile/listing/index.html", isProfile);
    nav.appendChild(profileBtn);

    const logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.textContent = "Logout";
    logoutBtn.className =
      "bg-blue-600 cursor-pointer text-xl text-white text-center w-36 border-1 border-blue-700 rounded-md hover:bg-blue-400/30 transition-colors duration-500";
    logoutBtn.addEventListener("click", logoutEvent);

    nav.appendChild(logoutBtn);
  }

  return nav;
}

function logoutEvent() {
  localStorage.setItem("logged-out", true);
  sessionStorage.clear();
  window.location.href = "/";
}
