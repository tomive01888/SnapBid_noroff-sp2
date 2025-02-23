import { fetchAndDisplayOwnListings } from "../../ui/utility/profileUtils/fetch&DisplayUserListings.mjs";
import { compareUserAccess } from "../../ui/utility/compareUserAccess.mjs";
import { hamburgerToggle } from "../../ui/globals/hamburgerToggler.mjs";
import { populateProfileIndex } from "../../ui/utility/profileUtils/populateProfileIndex.mjs";
import { updateProfileAvatar } from "../../ui/utility/profileUtils/updateAvatar.mjs";
import { showToastMessage } from "../../ui/toastMessages/showToastMessage.mjs";
import { authGuard } from "../../ui/utility/authGuard.mjs";
import { generateNavbar } from "../../ui/globals/navbarAccess.mjs";

generateNavbar();
authGuard();
hamburgerToggle();
compareUserAccess();
fetchAndDisplayOwnListings();
populateProfileIndex();

const userName = JSON.parse(sessionStorage.getItem("SnapBid-User"));

document.getElementById("editProfile").addEventListener("click", () => {
  const avatarFormContainer = document.getElementById("avatar-form-container");
  avatarFormContainer.classList.toggle("hidden");
});

const form = document.forms.updateProfile;
form.addEventListener("submit", async (event) => {
  await updateProfileAvatar(event, userName.name);
});

if (sessionStorage.getItem("avatar-update") === "success") {
  setTimeout(() => {
    showToastMessage("Avatar updated successfully!", "success");
  }, 800);
  sessionStorage.removeItem("avatar-update");
}
