import { getHighestBidValue } from "../getHighestBidHandler.mjs";
import { getTimeRemaining } from "../timeRemaining.mjs";

export function populateListingDetails(arr) {
  const hasEnded = getTimeRemaining(arr.endsAt);
  if (hasEnded === "Ended") {
    document.getElementById("bid-now").disabled = true;
    const listingContainer = document.getElementById("listing-container");

    const endedContainer = document.createElement("div");
    endedContainer.className =
      "w-full h-12 grid place-items-center bg-red-600/50 rounded-md text-2xl font-bold text-white font-body text-center";
    endedContainer.textContent = "Auction has ended";
    listingContainer.prepend(endedContainer);
  }

  document.getElementById("post-title").textContent = arr.title;

  const { highestBid } = getHighestBidValue(arr);
  document.getElementById("price").textContent = `${highestBid}$`;

  const timeRemaining = getTimeRemaining(arr.endsAt);
  document.getElementById("time").textContent = timeRemaining;

  document.getElementById("category-tag").textContent = arr.tags.length ? arr.tags[0] : "No category";

  document.getElementById("bid-amount").textContent = `${arr._count.bids} bids`;

  document.getElementById("description").innerHTML = arr.description
    ? arr.description.replace(/\n/g, "<br>")
    : "This listing has no description";

  document.getElementById("avatar").src = arr.seller.avatar.url;
  document.getElementById("avatar").alt = arr.seller.avatar.alt || "Seller Avatar";

  document.getElementById("seller-name").textContent = arr.seller.name;
}
