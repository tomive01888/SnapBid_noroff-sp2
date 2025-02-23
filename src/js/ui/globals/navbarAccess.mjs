export function generateNavbar() {
  const nav = document.getElementById("navbar");
  nav.innerHTML = "";

  const homeBtn = document.createElement("button");
  homeBtn.className = "bg-blue-500 text-xl text-white text-center w-36 border-1 border-blue-700 rounded-md";
  homeBtn.textContent = "Home";
  nav.appendChild(homeBtn);

  if (!sessionStorage.getItem("token")) {
    const accountBtn = document.createElement("a");
    accountBtn.href = "/auth/index.html";
    accountBtn.className =
      "bg-blue-600 cursor-pointer text-xl text-white text-center w-36 border-1 border-blue-700 rounded-md hover:bg-blue-400/30 transition-colors duration-500";
    accountBtn.textContent = "Account";
    nav.appendChild(accountBtn);
  } else {
    const profileLink = document.createElement("a");
    profileLink.href = "/profile/listing/index.html";
    profileLink.className =
      "bg-blue-600 cursor-pointer text-xl text-white text-center w-36 border-1 border-blue-700 rounded-md hover:bg-blue-400/30 transition-colors duration-500";
    profileLink.textContent = "My Profile";
    nav.appendChild(profileLink);

    const logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className =
      "bg-blue-600 cursor-pointer text-xl text-white text-center w-36 border-1 border-blue-700 rounded-md hover:bg-blue-400/30 transition-colors duration-500";
    logoutBtn.textContent = "Logout";
    logoutBtn.addEventListener("click", () => {
      sessionStorage.clear();
      location.reload();
    });
    nav.appendChild(logoutBtn);
  }

  return nav;
}
