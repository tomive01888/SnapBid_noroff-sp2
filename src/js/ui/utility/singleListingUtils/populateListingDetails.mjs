import { getHighestBidValue } from "../getHighestBidHandler.mjs";
import { getTimeRemaining } from "../timeRemaining.mjs";

/**
 * Populates an auction listing's details on the webpage.
 *
 * @param {Object} listing - The auction listing object containing relevant details.
 * Targets objects in DOM, <p> and ended banner to showcase listing has finished.
 *
 */
export function populateListingDetails(listing) {
  const hasEnded = getTimeRemaining(listing.endsAt);
  if (hasEnded === "Ended") {
    document.getElementById("bid-now").disabled = true;
    const listingContainer = document.getElementById("listing-container");

    const endedContainer = document.createElement("div");
    endedContainer.className =
      "w-full h-12 grid place-items-center bg-red-600/50 rounded-md text-2xl font-bold text-white font-body text-center";
    endedContainer.textContent = "Auction has ended";
    listingContainer.prepend(endedContainer);
  }

  document.getElementById("post-title").textContent = listing.title;

  const { highestBid } = getHighestBidValue(listing);
  document.getElementById("price").textContent = `${highestBid}$`;

  const timeRemaining = getTimeRemaining(listing.endsAt);
  document.getElementById("time").textContent = timeRemaining;

  document.getElementById("category-tag").textContent = listing.tags.length ? listing.tags[0] : "No category";

  document.getElementById("bid-amount").textContent = `${listing._count.bids} bids`;

  const descriptionEl = document.getElementById("description");

  if (listing.description) {
    descriptionEl.textContent = "";
    listing.description.split("\n").forEach((line, index, arr) => {
      descriptionEl.appendChild(document.createTextNode(line));
      if (index < arr.length - 1) {
        descriptionEl.appendChild(document.createElement("br"));
      }
    });
  } else {
    descriptionEl.textContent = "This listing has no description";
  }

  document.getElementById("avatar").src = listing.seller.avatar.url;
  document.getElementById("avatar").alt = listing.seller.avatar.alt || "Seller Avatar";

  document.getElementById("seller-name").textContent = listing.seller.name;

  document.getElementById("createdAt").textContent = `Created: ${timeConvertedToLocaleString(listing.created)}`;
  document.getElementById("updatedAt").textContent = `Updated: ${timeConvertedToLocaleString(listing.updated)}`;
}

/**
 * Converts a date string, timestamp, or Date object to a readable locale string.
 *
 * @param {string | number | Date} dateInput - The date to convert.
 * @param {Object} [options] - Optional formatting options.
 * @param {string} [options.locale] - Locale code, e.g., 'en-US'. Defaults to browser locale.
 * @param {Object} [options.dateOptions] - Options for date formatting (passed to toLocaleDateString).
 * @returns {string} Formatted date string or 'Invalid Date' if input is invalid.
 */
function timeConvertedToLocaleString(dateInput, options = {}) {
  const { locale = undefined, dateOptions = { year: "numeric", month: "long", day: "numeric" } } = options;

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString(locale, dateOptions);
}
