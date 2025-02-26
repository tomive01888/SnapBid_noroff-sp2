/**
 * Populates the profile section with user details.
 *
 * Retrieves user information and credits from `sessionStorage`
 * and updates the profile page elements accordingly.
 *
 * @throws {Error} If required user data is missing or invalid.
 */

export function populateProfileIndex() {
  const user = JSON.parse(sessionStorage.getItem("SnapBid-User"));

  const userCredits = JSON.parse(sessionStorage.getItem("SnapBid-Credits"));

  document.getElementById("userProfileImage").src = user.avatar.url;
  document.getElementById("userProfileName").textContent = user.name;
  document.getElementById("userProfileCurrency").textContent = `${userCredits}$`;
  document.getElementById("head-profile").innerHTML = `${user.name} | SnapBid`;
}
