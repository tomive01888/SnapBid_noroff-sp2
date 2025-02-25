import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGetAuctionInformation } from "../../../api/apiRequestOptions.mjs";
import { getAuctionEndpoints } from "../../../api/constants.mjs";
import { generateAuctionCards } from "../../component/listingCardCreator.mjs";

const singleEndpoint = getAuctionEndpoints();
const token = sessionStorage.getItem("token");

/**
 * Fetches and displays the user's auction listings, sorted by expiration date.
 *
 * This function retrieves the user's auction listings from the backend, sorts them based on their expiration
 * date (with expired listings shown last), and passes them to the `generateAuctionCards` function to render
 * them in the DOM.
 *
 * @async
 * @function fetchAndDisplayOwnListings
 * @returns {Promise<void>} This function does not return a value but updates the UI with auction cards.
 *
 * @throws {Error} If there is an issue with fetching or displaying the listings, an error is logged to the console.
 */
export async function fetchAndDisplayOwnOldListings() {
  try {
    const req = await handleApiRequest(singleEndpoint.AUCTION_SINGLE_LISTINGS, optionGetAuctionInformation(token));

    if (!req) {
      throw new Error("Something went wrong. Fetch fail.");
    }

    const now = new Date();

    // Filter: Expired listings (endsAt < now) with zero bids (bids.length === 0)
    const filteredListings = req.data.filter(listing => {
      const dateEnds = new Date(listing.endsAt);
      return dateEnds < now && listing.bids.length === 0;
    });

    // Sort by expiration date (earliest expired first)
    const sortedListings = filteredListings.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));

    generateAuctionCards(sortedListings, "listing");
  } catch (error) {
    console.error("Error fetching and displaying own listings:", error);
  }
}
