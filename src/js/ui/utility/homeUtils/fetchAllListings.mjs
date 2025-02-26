import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGet } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../../api/constants.mjs";

/**
 * Fetches all auction listings with pagination and optional filtering for active/inactive listings.
 *
 * @param {number} currentPage - The current page number for pagination.
 * @param {boolean} showInactive - Determines whether to include inactive listings.
 * @param {number} [limit=12] - The number of listings to fetch per page (default is 12).
 *
 * @returns {Promise<Object>} - A promise resolving to the fetched listings data.
 */
export async function fetchAllListings(currentPage, showInactive) {
  const params = new URLSearchParams({
    limit: 12,
    page: currentPage,
    _seller: true,
    _bids: true,
  });

  params.append("_active", showInactive ? "false" : "true");

  const url = `${AUCTION_LISTING_ENDPOINT}?${params.toString()}`;

  return await handleApiRequest(url, optionGet);
}
