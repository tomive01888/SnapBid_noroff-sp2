import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionProfileAvatar } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_PROFILES_ENDPOINT } from "../../../api/constants.mjs";
import { showToastMessage } from "../../toastMessages/showToastMessage.mjs";

/**
 * Updates the user's profile avatar.
 *
 * The function:
 * - Prevents the default form submission.
 * - Retrieves the new avatar URL from the input field.
 * - Constructs the avatar update payload.
 * - Sends a request to update the user's avatar.
 * - Updates session storage with the new user data if successful.
 * - Reloads the page upon success.
 * - Displays an error message if the update fails.
 *
 * @param {Event} event - The form submission event.
 * @param {string} user - The username of the user whose avatar is being updated.
 * @returns {Promise<void>} Resolves when the avatar update is processed.
 */
export async function updateProfileAvatar(event, user) {
  event.preventDefault();

  const avatarUrl = document.getElementById("avatar-url").value.trim();
  const token = sessionStorage.getItem("token");

  if (!avatarUrl) {
    showToastMessage("Please enter an image url", "error");
    return;
  }

  const dataToSend = {
    avatar: {
      url: avatarUrl || "",
      alt: `${user}'s profile avatar`,
    },
  };

  try {
    const response = await handleApiRequest(
      `${AUCTION_PROFILES_ENDPOINT}/${user}`,
      optionProfileAvatar(dataToSend, token)
    );

    if (!response || response.error) {
      throw new Error(response?.error || "Failed to update the avatar.");
    }

    const { accessToken, ...userData } = response.data;
    sessionStorage.setItem("SnapBid-User", JSON.stringify(userData));
    sessionStorage.setItem("avatar-update", "success");

    location.reload();
  } catch (error) {
    console.error("Error updating avatar:", error);
    showToastMessage(error.message, "error");
  }
}
