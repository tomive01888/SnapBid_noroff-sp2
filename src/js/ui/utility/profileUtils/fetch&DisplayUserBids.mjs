import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGetAuctionInformation } from "../../../api/apiRequestOptions.mjs";
import { getAuctionEndpoints } from "../../../api/constants.mjs";
import { generateAuctionCards } from "../../component/listingCardCreator.mjs";
import { showToastMessage } from "../../toastMessages/showToastMessage.mjs";

/**
 * Fetches and displays the user's highest bids on active auction listings.
 *
 * - Retrieves the user's token from sessionStorage.
 * - Fetches the user's bid data from the auction API.
 * - Filters the active listings where the auction hasn't ended.
 * - Finds the highest bid for each active listing the user has bid on.
 * - Calls `generateAuctionCards` to display the highest bids on the page.
 *
 * @async
 * @function fetchAndDisplayOwnBids
 * @returns {Promise<void>} - The function doesn't return any value.
 */
export async function fetchAndDisplayOwnBids() {
  const token = sessionStorage.getItem("token");
  const singleEndpoint = getAuctionEndpoints();

  try {
    const req = await handleApiRequest(singleEndpoint.AUCTION_SINGLE_BIDS, optionGetAuctionInformation(token));

    const now = new Date();
    const activeListings = req.data.filter((listing) => new Date(listing.listing.endsAt) > now);

    const userHighestBids = new Map();

    activeListings.forEach((bid) => {
      const listingId = bid.listing.id;
      const bidAmount = bid.amount;

      if (!userHighestBids.has(listingId) || userHighestBids.get(listingId).amount < bidAmount) {
        userHighestBids.set(listingId, bid);
      }
    });

    const filteredListings = Array.from(userHighestBids.values());

    generateAuctionCards(filteredListings, "biddings");
  } catch (error) {
    showToastMessage(`${error.message}`, "error");
  }
}
