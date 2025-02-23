import { createBidHistory } from "../../component/createBidHistoryList.mjs";

/**
 * Displays the bid history for a given auction listing and toggles visibility on button click.
 *
 * @param {Object} listing - The auction listing object.
 * @param {Array} listing.bids - An array of bid objects associated with the listing.
 *
 * @returns {Promise<void>} - No return value. Updates the DOM to show or hide bid history.
 */

export async function showBidHistory(listing) {
  const bidHistoryButton = document.getElementById("display-bid-list");

  bidHistoryButton.addEventListener("click", () => {
    const bidHistorySection = document.getElementById("bid-history");
    bidHistorySection.classList.toggle("hidden");
    bidHistorySection.classList.toggle("flex");

    const bidHistoryIcon = document.getElementById("icon-bid-history");
    bidHistoryIcon.classList.toggle("rotate-180");
  });

  createBidHistory(listing.bids);
}
