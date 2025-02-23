import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGetAuctionInformation } from "../../../api/apiRequestOptions.mjs";
import { getAuctionEndpoints } from "../../../api/constants.mjs";
import { generateAuctionCards } from "../../component/listingCardCreator.mjs";

const singleEndpoint = getAuctionEndpoints();
const token = sessionStorage.getItem("token");

/**
 * Fetches and displays the user's auction wins.
 *
 * - Retrieves the user's data and token from sessionStorage.
 * - Fetches the user's winning bids from the auction API.
 * - Calls `generateAuctionCards` to render the winning bids on the page.
 *
 * @async
 * @function fetchAndDisplayOwnWins
 * @returns {Promise<void>} - The function doesn't return any value.
 */
export async function fetchAndDisplayOwnWins() {
  try {
    const req = await handleApiRequest(singleEndpoint.AUCTION_SINGLE_WINS, optionGetAuctionInformation(token));

    generateAuctionCards(req.data, "winnings", "winner");
  } catch (error) {
    console.error("Error fetching and displaying own listings:", error);
  }
}
