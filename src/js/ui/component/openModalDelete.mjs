import { handleApiRequest } from "../../api/apiRequestHandler.mjs";
import { optionDeleteListing } from "../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../api/constants.mjs";
import { showToastMessage } from "../toastMessages/showToastMessage.mjs";

/**
 * Opens a modal to confirm the deletion of a listing. If confirmed, the listing is deleted from the database.
 *
 * @param {string} listingId - The ID of the listing to be deleted.
 *
 * @example
 * openDeleteModal('listing-123');
 */
export async function openDeleteModal(listingId) {
  const modalBackground = document.createElement("div");
  modalBackground.className = "fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center z-50";
  modalBackground.onclick = (e) => {
    if (e.target === modalBackground) modalBackground.remove();
  };

  const modal = document.createElement("div");
  modal.className = "bg-white p-6 rounded-lg shadow-lg max-w-sm text-center";

  const message = document.createElement("p");
  message.textContent = "You are about to delete this listing. Are you sure you want to proceed?";
  message.className = "text-xl";

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "mt-4 flex justify-around";

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.className = "px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer";
  cancelButton.onclick = () => modalBackground.remove();

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.className = "px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600 cursor-pointer";
  confirmButton.onclick = async () => {
    showLoaderOverlay();

    const token = sessionStorage.getItem("token");
    const newUrl = `${AUCTION_LISTING_ENDPOINT}/${listingId}`;

    try {
      await handleApiRequest(newUrl, optionDeleteListing(token));

      sessionStorage.setItem("delete-listing", true);
      setTimeout(() => {
        removeLoaderOverlay();
        window.location.href = "/";
      }, 1750);
    } catch (error) {
      showToastMessage(`${error.message}`, "error");
      removeLoaderOverlay();
    } finally {
      modalBackground.remove();
    }
  };

  buttonContainer.append(cancelButton, confirmButton);
  modal.append(message, buttonContainer);
  modalBackground.append(modal);
  document.body.appendChild(modalBackground);
}

/**
 * Displays a loading overlay with animated dots while the listing deletion is in progress.
 * The overlay also contains a message indicating that the deletion is being processed.
 */
function showLoaderOverlay() {
  const loaderOverlay = document.createElement("div");
  loaderOverlay.id = "loaderOverlay";
  loaderOverlay.className =
    "fixed inset-0 flex flex-col justify-center items-center bg-black/80 bg-opacity-70 z-50 text-white text-lg";

  const loaderContainer = document.createElement("div");
  loaderContainer.className = "flex flex-row gap-2";

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = `w-4 h-4 rounded-full bg-blue-500 animate-bounce`;
    if (i === 1) dot.classList.add("[animation-delay:-.3s]");
    if (i === 2) dot.classList.add("[animation-delay:-.5s]");
    loaderContainer.appendChild(dot);
  }

  const loaderText = document.createElement("p");
  loaderText.textContent = "Deletion of listing in progress...";
  loaderText.className = "mt-4 text-2xl font-bold";

  loaderOverlay.append(loaderContainer, loaderText);
  document.body.appendChild(loaderOverlay);
}

/**
 * Removes the loading overlay from the page once the deletion process is complete.
 */
function removeLoaderOverlay() {
  const loaderOverlay = document.getElementById("loaderOverlay");
  if (loaderOverlay) loaderOverlay.remove();
}
