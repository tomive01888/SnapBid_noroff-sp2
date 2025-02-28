import { hamburgerToggle } from "../../ui/globals/hamburgerToggler.mjs";
import { compareUserAccess } from "../../ui/utility/compareUserAccess.mjs";
import { showToastMessage } from "../../ui/toastMessages/showToastMessage.mjs";
import { generateNavbar } from "../../ui/globals/navbarAccess.mjs";
import { goToPage, updateListings, nextPage, prevPage } from "../../ui/component/paginator&HomeStartup.mjs";
import { initializeAuctionProfile } from "../../ui/utility/profileUtils/fetchAuctionProfile.mjs";

generateNavbar();
hamburgerToggle();
updateListings();
compareUserAccess();
initializeAuctionProfile();

document.getElementById("next-posts").addEventListener("click", nextPage);
document.getElementById("prev-posts").addEventListener("click", prevPage);

const goToInput = document.getElementById("go-to");
if (goToInput) {
  goToInput.addEventListener("change", () => {
    const pageInput = parseInt(goToInput.value, 10);
    goToPage(pageInput);
  });
}

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
