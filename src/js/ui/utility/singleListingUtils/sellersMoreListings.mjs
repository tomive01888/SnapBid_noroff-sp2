import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGetAuctionInformation } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_PROFILES_ENDPOINT } from "../../../api/constants.mjs";
import { generateAuctionCards } from "../../component/listingCardCreator.mjs";
import { showToastMessage } from "../../toastMessages/showToastMessage.mjs";

/**
 * Fetches and displays additional listings from the same seller, excluding the current listing.
 *
 * @param {string} sellerName - The username of the seller.
 * @param {string} currentListingId - The ID of the listing currently being viewed.
 *
 * The function:
 * - Retrieves the seller's listings from the API.
 * - Filters out the current listing.
 * - Displays up to 5 random listings from the seller.
 * - Handles API errors and displays a message if no other listings are available.
 */
export async function fetchMoreFromSeller(sellerName, currentListingId) {
  const seeMoreContainer = document.getElementById("see-more");
  if (!sessionStorage.token) {
    seeMoreContainer.textContent = "Sorry, you must be logged in to view this section.";
    seeMoreContainer.classList.add("font-semibold");
    return;
  }
  const token = sessionStorage.getItem("token");
  const newUrl = `${AUCTION_PROFILES_ENDPOINT}/${sellerName}/listings?_seller=true&_bids=true&_active=true`;

  try {
    const response = await handleApiRequest(newUrl, optionGetAuctionInformation(token));
    const sellerListings = response.data || [];

    const filteredListings = sellerListings.filter((listing) => listing.id !== currentListingId);

    if (filteredListings.length === 0) {
      seeMoreContainer.textContent = "No more listings from this seller";
      return;
    }

    const randomListings = filteredListings.sort(() => Math.random() - 0.5).slice(0, 5);

    generateAuctionCards(randomListings, "see-more");
  } catch (error) {
    showToastMessage(`${error.message}`, "error");
  }
}
