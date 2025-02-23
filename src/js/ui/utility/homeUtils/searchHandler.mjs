import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGet } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../../api/constants.mjs";

/**
 * Fetches auction listings based on a search query with pagination support.
 *
 * @param {string} searchQuery - The user-inputted search term to filter auction listings.
 * @param {number} currentPage - The current page number for pagination.
 *
 * @returns {Promise<Object>} - A promise resolving to search results containing auction listings.
 */
export async function fetchSearchResults(searchQuery, currentPage) {
  const params = new URLSearchParams({
    q: searchQuery,
    limit: 12,
    page: currentPage,
    _seller: true,
    _bids: true,
  });

  const endpoint = `${AUCTION_LISTING_ENDPOINT}/search`;
  const url = `${endpoint}?${params.toString()}`;

  console.log("search url", url);

  return await handleApiRequest(url, optionGet);
}
