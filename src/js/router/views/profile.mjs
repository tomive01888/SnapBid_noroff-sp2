import { logoutListener } from "../../ui/globals/logoutHandling.mjs";
import { fetchAndDisplayOwnListings } from "../../ui/utility/profile-utils/fetch&DisplayUserListings.mjs";
import { setupAuctionView } from "../../ui/utility/profile-utils/profileContentHandler.mjs";
import { compareUserAccess } from "../../ui/utility/compareUserAccess.mjs";
import { hamburgerToggle } from "../../ui/globals/hamburgerToggler.mjs";
import { populateProfileIndex } from "../../ui/utility/profile-utils/populateProfileIndex.mjs";
import { updateProfileAvatar } from "../../ui/utility/profile-utils/updateAvatar.mjs";
import { showToastMessage } from "../../ui/toastMessages/showToastMessage.mjs";
import { authGuard } from "../../ui/utility/profile-utils/authGuard.mjs";

authGuard();
window.logoutListener = logoutListener;
hamburgerToggle();
compareUserAccess();
fetchAndDisplayOwnListings();
populateProfileIndex();
setupAuctionView();

const userName = JSON.parse(sessionStorage.getItem("SnapBid-User"));

document.getElementById("editProfile").addEventListener("click", () => {
  const avatarFormContainer = document.getElementById("avatar-form-container");
  avatarFormContainer.classList.toggle("hidden");
});

const form = document.forms.updateProfile;
form.addEventListener("submit", async (event) => {
  await updateProfileAvatar(event, userName.name);
});

const hasUpdated = sessionStorage.getItem("avatar-update");
if (hasUpdated === "success") {
  setTimeout(() => {
    showToastMessage("Avatar updated successfully!", "success");
  }, 800);
  sessionStorage.removeItem("avatar-update");
}
