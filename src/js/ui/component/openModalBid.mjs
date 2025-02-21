import { handleApiRequest } from "../../api/apiRequestHandler.mjs";
import { optionPost } from "../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../api/constants.mjs";
import { showToastMessage } from "../toastMessages/showToastMessage.mjs";
import { getHighestBidValue } from "../utility/getHighestBidHandler.mjs";

/**
 * Opens a modal to allow the user to place a bid on an auction item.
 * Displays the current highest bid and provides an input field to enter a new bid.
 * Upon clicking "Place Bid", a confirmation modal is shown to verify the bid amount.
 *
 * @param {Array<Object>} data - An array of auction data objects containing item listings and bid information.
 * @param {string} listId - The ID of the auction listing being bid on.
 *
 */
export function openBidModal(data, listId) {
  const { highestBid } = getHighestBidValue(data);

  const modal = document.createElement("div");
  modal.id = "bidModal";
  modal.className = "fixed inset-0 bg-black/30 flex justify-center items-center";

  const modalContent = document.createElement("div");
  modalContent.className =
    "bg-white p-6 rounded-md w-full max-w-96 h-80 shadow-lg relative flex  flex-col justify-center items-center";

  const closeButton = document.createElement("button");
  closeButton.textContent = "✖";
  closeButton.className = "absolute top-2 right-2 text-gray-600 hover:text-black";
  closeButton.onclick = closeBidModal;

  const priceDisplay = document.createElement("p");
  priceDisplay.textContent = `Current highest bid: ${highestBid}$`;
  priceDisplay.className = "text-xl font-semibold mb-4";

  const bidLabel = document.createElement("label");
  bidLabel.textContent = "Enter bid value";
  const bidInput = document.createElement("input");
  bidInput.type = "number";
  bidInput.className = "w-full p-2 text-center border border-gray-300 rounded";

  const controls = document.createElement("div");
  controls.className = "flex flex-col justify-around gap-2 items-center mt-4";

  controls.append(bidLabel, bidInput);

  const confirmBid = document.createElement("button");
  confirmBid.textContent = "Place Bid";
  confirmBid.className = "w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600 cursor-pointer";

  confirmBid.onclick = () => {
    const finalBid = parseInt(bidInput.value, 10);
    showConfirmationModal(finalBid, listId);
  };

  modalContent.append(closeButton, priceDisplay, controls, confirmBid);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.onclick = (e) => {
    if (e.target === modal) closeBidModal();
  };
}

/**
 * Displays a confirmation modal for the user to verify their bid amount.
 * If confirmed, the bid is placed and the user's balance is updated.
 *
 * @param {number} bidAmount - The amount the user wishes to bid.
 * @param {string} listId - The ID of the auction listing for which the bid is being placed.
 *
 * @example
 * showConfirmationModal(100, 'listing-123');
 */
function showConfirmationModal(bidAmount, listId) {
  const confirmModal = document.createElement("div");
  confirmModal.className = "fixed inset-0 bg-transparent flex justify-center items-center";

  const confirmContent = document.createElement("div");
  confirmContent.className =
    "bg-white p-6 rounded-md w-96 h-80  shadow-lg text-center flex flex-col items-center justify-center";
  confirmContent.innerHTML = `<p>Confirm your bid of $${bidAmount}?</p>`;

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex gap-8 justify-around mt-4";

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.className = "cursor-pointer bg-gray-500 text-white px-4 py-2 rounded";
  cancelButton.onclick = () => confirmModal.remove();

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.className = "cursor-pointer bg-blue-500 text-white px-4 py-2 rounded";
  confirmButton.onclick = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const newUrl = `${AUCTION_LISTING_ENDPOINT}/${listId}/bids`;
      const bidData = { amount: bidAmount };

      let currentBalance = parseFloat(sessionStorage.getItem("SnapBid-Credits")) || 0;

      await handleApiRequest(newUrl, optionPost(bidData, token));

      currentBalance -= bidAmount;
      sessionStorage.setItem("SnapBid-Credits", currentBalance);
      sessionStorage.setItem("bidSuccess", "true");

      confirmModal.remove();
      closeBidModal();
      window.location.reload();
    } catch (error) {
      const errorMessage = error.message || "Something went wrong. Please try again later.";
      showToastMessage(errorMessage, "error");
    }
  };

  buttonContainer.append(cancelButton, confirmButton);
  confirmContent.appendChild(buttonContainer);
  confirmModal.appendChild(confirmContent);
  document.body.appendChild(confirmModal);
}

/**
 * Closes the bid modal when called.
 * This function is used to close the bid modal after placing a bid or canceling the action.
 */
export function closeBidModal() {
  const modal = document.getElementById("bidModal");
  if (modal) modal.remove();
}
