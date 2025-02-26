import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGet } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../../api/constants.mjs";

/**
 * Fetches auction listings filtered by tag, case-insensitively, with pagination support.
 *
 * @param {string} tag - The tag used to filter auction listings.
 * @param {number} currentPage - The current page number for pagination.
 * @param {boolean} activeToggle - Determines whether to include inactive listings.
 *
 * @returns {Promise<{data: Object[], meta: Object}>} - A promise resolving to an object containing filtered listings and pagination metadata.
 */
export async function fetchCaseInsensitiveCategories(tag, currentPage, activeToggle) {
  if (!tag) {
    return fetchAllListings(currentPage, activeToggle);
  }

  const originalTag = tag;
  const lowerTag = tag.toLowerCase();

  const urlOriginal = `${AUCTION_LISTING_ENDPOINT}?_seller=true&_bids=true&_active=${
    activeToggle ? "false" : "true"
  }&_tag=${originalTag}`;
  const urlLower = `${AUCTION_LISTING_ENDPOINT}?_seller=true&_bids=true&_active=${
    activeToggle ? "false" : "true"
  }&_tag=${lowerTag}`;

  try {
    const [resOriginal, resLower] = await Promise.all([
      handleApiRequest(urlOriginal, optionGet),
      handleApiRequest(urlLower, optionGet),
    ]);

    const mergedData = [...resOriginal.data, ...resLower.data].filter(
      (item, index, self) => index === self.findIndex((i) => i.id === item.id)
    );

    const totalMergedResults = mergedData.length;
    const totalPages = Math.ceil(totalMergedResults / 12);
    const validPage = Math.min(currentPage, totalPages);
    const paginatedMergedData = mergedData.slice((validPage - 1) * 12, validPage * 12);

    const isFirstPage = validPage === 1;
    const isLastPage = validPage === totalPages;
    const nextPage = isLastPage ? null : validPage + 1;
    const previousPage = isFirstPage ? null : validPage - 1;

    const updatedMeta = {
      currentPage: validPage,
      isFirstPage,
      isLastPage,
      nextPage,
      previousPage,
      totalCount: totalMergedResults,
      totalPages,
      pageCount: totalPages,
    };

    return { data: paginatedMergedData, meta: updatedMeta };
  } catch (error) {
    console.error("Error fetching filtered listings:", error);
    throw error;
  }
}
