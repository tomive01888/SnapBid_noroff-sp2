import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGet } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../../api/constants.mjs";
import { showToastMessage } from "../../toastMessages/showToastMessage.mjs";

/**
 * Fetches listing data for a given auction ID, including seller and bid details.
 *
 * @param {string} id - The unique identifier of the auction listing.
 * @returns {Promise<Object|null>} - Returns the listing data object if successful, otherwise `null`.
 */
export async function getListingData(id) {
  if (!id) {
    showToastMessage("getListingData: Missing or invalid ID");
    return null;
  }

  const newUrl = `${AUCTION_LISTING_ENDPOINT}/${id}?_seller=true&_bids=true`;

  try {
    const req = await handleApiRequest(newUrl, optionGet);
    return req?.data || null;
  } catch (error) {
    showToastMessage(`${error.message}`, "error");

    return null;
  }
}
