import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGetAuctionInformation } from "../../../api/apiRequestOptions.mjs";
import { getAuctionEndpoints } from "../../../api/constants.mjs";
import { generateAuctionCards } from "../../component/listingCardCreator.mjs";

const singleEndpoint = getAuctionEndpoints();
const token = sessionStorage.getItem("token");

/**
 * Fetches and displays the user's auction wins. If no wins are found, a message is shown.
 *
 * This function sends a GET request to retrieve the user's auction wins and updates the DOM with the results.
 * If no wins are found, a message is displayed indicating the user has no current wins.
 *
 * @async
 * @function fetchAndDisplayOwnWins
 * @returns {void}
 * @throws {Error} If the API request fails, an error is logged to the console.
 */
export async function fetchAndDisplayOwnWins() {
  try {
    const req = await handleApiRequest(singleEndpoint.AUCTION_SINGLE_WINS, optionGetAuctionInformation(token));

    generateAuctionCards(req.data, "winnings", "winner");

    // generateWonAuctionCards(req.data, "winnings");
  } catch (error) {
    console.error("Error fetching and displaying own listings:", error);
  }
}
