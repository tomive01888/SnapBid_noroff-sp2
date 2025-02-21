/**
 * Populates the bid history section with a sorted list of bids.
 *
 * @param {Array} bids - An array of bid objects, each containing:
 *   @param {number} bids[].amount - The bid amount.
 *   @param {Object} bids[].bidder - The bidder information.
 *   @param {string} bids[].bidder.name - The name of the bidder.
 *   @param {Object} [bids[].bidder.avatar] - The bidder's avatar object (optional).
 *   @param {string} [bids[].bidder.avatar.url] - The URL of the bidder's avatar.
 *   @param {string} [bids[].bidder.avatar.alt] - The alternative text for the avatar.
 *
 * @description
 * - Sorts bids in descending order based on the amount.
 * - Clears the existing bid history before populating new entries.
 * - Displays a message if there are no bids.
 * - Dynamically creates bid history elements with avatars, usernames, and amounts.
 * - Ensures avatars and alt texts are handled properly to avoid missing images.
 */

export function createBidHistory(bids) {
  const bidHistorySection = document.getElementById("bid-history");
  if (!bidHistorySection) return;

  const sortList = bids.sort((a, b) => b.amount - a.amount);

  bidHistorySection.innerHTML = "";

  if (bids.length === 0) {
    const noBidsMessage = document.createElement("p");
    noBidsMessage.textContent = "This listing has no bid history.";
    bidHistorySection.appendChild(noBidsMessage);
    return;
  }

  sortList.forEach((bid) => {
    const bidDiv = document.createElement("div");
    bidDiv.className = "flex justify-between border-b-1 p-1";

    const avatarAndName = document.createElement("div");
    avatarAndName.className = "flex gap-2 items-center";

    const avatar = document.createElement("img");
    avatar.src = bid.bidder.avatar?.url || "";
    avatar.alt = bid.bidder.avatar?.alt || "User Avatar";
    avatar.className = "w-8 h-8 rounded-full object-cover";

    const userName = document.createElement("p");
    userName.textContent = bid.bidder.name;
    userName.className = "font-semibold";

    avatarAndName.appendChild(avatar);
    avatarAndName.appendChild(userName);

    const amount = document.createElement("p");
    amount.textContent = `${bid.amount}$`;
    amount.className = "font-semibold ";

    bidDiv.appendChild(avatarAndName);
    bidDiv.appendChild(amount);

    bidHistorySection.appendChild(bidDiv);
  });
}
