import { hamburgerToggle } from "../../ui/globals/hamburgerToggler.mjs";
import { fetchAuctionProfileInfo } from "../../ui/utility/profile-utils/fetchAuctionProfile.mjs";
import { goToPage, initializeHome, nextPage, prevPage } from "../../ui/component/paginator&HomeStartup.mjs";
import { compareUserAccess } from "../../ui/utility/compareUserAccess.mjs";
import { logoutListener, updateUIForLogout } from "../../ui/globals/logoutHandling.mjs";
import { showToastMessage } from "../../ui/toastMessages/showToastMessage.mjs";

hamburgerToggle();
initializeHome();
window.logoutListener = logoutListener;

document.getElementById("next-posts").addEventListener("click", nextPage);
document.getElementById("prev-posts").addEventListener("click", prevPage);

const goToInput = document.getElementById("go-to");
if (goToInput) {
  goToInput.addEventListener("change", () => {
    const pageInput = parseInt(goToInput.value, 10);
    goToPage(pageInput);
  });
}

export async function checkAuthAndFetchProfile(forceRefresh = false) {
  const token = sessionStorage.getItem("token");
  const userName = sessionStorage.getItem("SnapBid-User");

  if (!token || !userName) {
    updateUIForLogout();
    return;
  }

  if (!sessionStorage.getItem("auctionProfileFetched") || forceRefresh) {
    fetchAuctionProfileInfo();
    sessionStorage.setItem("auctionProfileFetched", "true");
  }
  setTimeout(() => {
    compareUserAccess();
  }, 400);
}

checkAuthAndFetchProfile();

const message = sessionStorage.getItem("logging-in");
if (message) {
  showToastMessage(message, "success");
  sessionStorage.removeItem("logging-in");
}

if (sessionStorage.getItem("delete-listing") === "true") {
  showToastMessage("Listing has successfully been deleted", "success");
  sessionStorage.removeItem("delete-listing");
}

if (localStorage.getItem("logged-out") === "true") {
  showToastMessage("You have logged out. See you again", "success");
  localStorage.removeItem("logged-out");
}
