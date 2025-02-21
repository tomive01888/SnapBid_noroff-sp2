import { fetchMoreFromSeller } from "./sellersMoreListings.mjs";
/**
 * Displays additional listings from the same seller and toggles visibility on button click.
 *
 * @param {Object} data - The listing data object.
 * @param {Object} data.seller - The seller object containing seller details.
 * @param {string} data.seller.name - The seller's name.
 * @param {string} id - The ID of the current listing to exclude from the additional listings.
 *
 * @returns {Promise<void>} - No return value. Updates the DOM to show or hide more listings.
 */
export async function showMoreListingsFromSeller(data, id) {
  const displayMore = document.getElementById("display-more-content");

  displayMore.addEventListener("click", () => {
    const seeMoreSection = document.getElementById("see-more");
    seeMoreSection.classList.toggle("hidden");
    seeMoreSection.classList.toggle("flex");

    const seeMoreIcon = document.getElementById("icon-show-listings");
    seeMoreIcon.classList.toggle("rotate-180");

    const sellerName = data.seller.name;
    const currentListingId = id;
    fetchMoreFromSeller(sellerName, currentListingId);
  });
}
