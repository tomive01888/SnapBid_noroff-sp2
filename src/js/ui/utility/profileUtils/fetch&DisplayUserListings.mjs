import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGetAuctionInformation } from "../../../api/apiRequestOptions.mjs";
import { getAuctionEndpoints } from "../../../api/constants.mjs";
import { generateAuctionCards } from "../../component/listingCardCreator.mjs";
import { showToastMessage } from "../../toastMessages/showToastMessage.mjs";

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
export async function fetchAndDisplayOwnListings() {
  try {
    const req = await handleApiRequest(singleEndpoint.AUCTION_SINGLE_LISTINGS, optionGetAuctionInformation(token));

    if (!req) {
      throw new Error("Something went wrong. Fetch fail.");
    }

    const sortedListings = req.data.sort((a, b) => {
      const now = new Date();
      const dateA = new Date(a.endsAt);
      const dateB = new Date(b.endsAt);

      const isExpiredA = dateA < now ? 1 : 0;
      const isExpiredB = dateB < now ? 1 : 0;

      return isExpiredA - isExpiredB || dateA - dateB;
    });

    generateAuctionCards(sortedListings, "listing");
  } catch (error) {
    showToastMessage(`${error.message}`, "error");
  }
}
