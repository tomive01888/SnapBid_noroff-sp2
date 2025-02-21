/**
 * Populates the auction profile UI elements based on the user's session data.
 *
 * This function checks if the user is logged in by verifying the presence of a valid token
 * and the user data in sessionStorage. It then updates the profile UI:
 * - If the user is not logged in, hides profile-related UI elements.
 * - If the user is logged in, shows profile-related UI elements and displays the user's name and credits.
 *
 * @function compareUserAccess
 * @returns {void}
 */
export function compareUserAccess() {
  const token = sessionStorage.getItem("token");
  const loggedUser = JSON.parse(sessionStorage.getItem("SnapBid-User"));
  const userCredit = sessionStorage.getItem("SnapBid-Credits");

  if (!token || !loggedUser) {
    document.getElementById("profile-link").classList.add("hidden");
    document.getElementById("account-button").classList.remove("hidden");
    document.getElementById("profile-wrapper").classList.add("hidden");
    document.getElementById("wallet-wrapper").classList.add("hidden");
    document.getElementById("logout").classList.add("hidden");
  } else {
    document.getElementById("account-button").classList.add("hidden");
    document.getElementById("profile-wrapper").classList.remove("hidden");
    document.getElementById("profile-wrapper").classList.add("flex");
    document.getElementById("wallet-wrapper").classList.remove("hidden");
    document.getElementById("profile-link").classList.remove("hidden");
    document.getElementById("logout").classList.remove("hidden");
    document.getElementById("username").textContent = loggedUser.name;
    document.getElementById("credits").textContent = userCredit;
  }
}
