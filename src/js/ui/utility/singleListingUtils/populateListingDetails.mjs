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

  document.getElementById("description").innerHTML = listing.description
    ? listing.description.replace(/\n/g, "<br>")
    : "This listing has no description";

  document.getElementById("avatar").src = listing.seller.avatar.url;
  document.getElementById("avatar").alt = listing.seller.avatar.alt || "Seller Avatar";

  document.getElementById("seller-name").textContent = listing.seller.name;

  document.getElementById("createdAt").textContent = `Created: ${timeConvertedToLocaleString(listing.created)}`;
  document.getElementById("updatedAt").textContent = `Updated: ${timeConvertedToLocaleString(listing.updated)}`;
}

function timeConvertedToLocaleString(data) {
  const createdData = data;
  if (createdData) {
    const dateConvert = new Date(createdData);
    const createdAt = `${dateConvert.toLocaleDateString()}`;
    return createdAt;
  }
}
