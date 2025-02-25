import { getHighestBidValue } from "../utility/getHighestBidHandler.mjs";
import { getTimeRemaining } from "../utility/timeRemaining.mjs";
import { getListingData } from "../utility/singleListingUtils/fetchListingData.mjs";

let debounceTimeout;
/**
 * Generates and displays auction item cards.
 *
 * The function:
 * - Clears previous content in the target container.
 * - Displays a message if no auction listings exist.
 * - Iterates through auction data to create structured cards.
 * - Displays auction details, including title, price, bid count, seller, category, and time remaining.
 * - Marks ended auctions visually.
 * - Adds a click event to navigate to the auction details page.
 *
 * @param {Array} data - The auction listings data array.
 * @param {string} appendContainer - The ID of the container to append the auction cards.
 */

export function generateAuctionCards(data, appendContainer, winner) {
  const container = document.getElementById(appendContainer);

  if (data.length === 0 && appendContainer === "listing") {
    container.classList.remove("grid");
    container.textContent = "You have not made any listings go to create listing to start auctioning items.";
    container.classList.add("min-h-svh", "text-center", "text-xl");
    return;
  }

  if (data.length === 0 && appendContainer === "winnings") {
    container.classList.remove("grid");
    container.textContent = "You have not won any listings, start bidding now and bring home the W.";
    container.classList.add("min-h-svh", "text-center", "text-xl");
    return;
  }

  if (data.length === 0 && appendContainer === "biddings") {
    container.classList.remove("grid");
    container.textContent = "You have not made a bid on any listing. Browse now and find items that interest you!";
    container.classList.add("min-h-svh", "text-center", "text-xl");
    return;
  }

  if (!container) {
    console.error(`Container with ID "${appendContainer}" not found.`);
    return;
  }

  container.innerHTML = "";

  data.forEach((item) => {
    const { id, title, media, seller, _count, tags, endsAt, amount, listing } = item;

    const card = document.createElement("div");
    card.className =
      "m-auto opacity-0 transition-opacity duration-500 relative w-full min-w-[300px] max-w-[330px] relative";

    const cardInner = document.createElement("div");
    cardInner.className = "w-full border rounded-lg shadow-md bg-white p-2 ";

    const listingTitle = document.createElement("h2");
    listingTitle.className = "text-2xl p-2 font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-full";

    const cardBody = document.createElement("div");
    cardBody.className = "flex gap-1 w-full flex-col ";

    const imgWrapper = document.createElement("div");
    imgWrapper.className = " w-full max-w-58 aspect-[9/10] grid overflow-hidden rounded-md m-auto";

    const img = document.createElement("img");

    imgWrapper.appendChild(img);

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "flex flex-col justify-between";

    const priceBidsTop = document.createElement("div");
    priceBidsTop.className = "w-full flex justify-between items-between";

    const bidCount = document.createElement("p");
    bidCount.className = "text-gray-600 text-xl";

    const price = document.createElement("span");
    price.className = "text-2xl price-large font-bold";
    price.role = "presentation";
    priceBidsTop.appendChild(bidCount);

    const shipping = document.createElement("p");
    shipping.className = "text-gray-500 place-self-end";
    shipping.textContent = "Free shipping!";

    const sellerName = document.createElement("p");
    sellerName.className = "text-blue-500 font-semibold text-xl";

    const endedLabel = document.createElement("div");
    endedLabel.className =
      "absolute font-body bottom-2 right-2 bg-red-400 text-white text-xl font-bold px-2 py-1 rounded";
    endedLabel.textContent = "Auction Ended";

    const timeRemaining = document.createElement("p");
    timeRemaining.className = "text-md";

    const category = document.createElement("p");
    category.className = "font-semibold";

    if (appendContainer === "biddings") {
      listingTitle.textContent = listing.title;

      img.className = listing.media[0] ? "w-full h-full object-cover object-center" : "opacity-40 place-self-center";
      img.src = listing.media[0] ? listing.media[0].url : "/snapbid_logo.png";
      img.alt = listing.title || "";

      const amILeading = document.createElement("p");

      amILeading.textContent = "Am I leading?";
      amILeading.className =
        "p-1 border-1 bg-gray-100 rounded-full font-body text-gray-500 hover:text-gray-700 cursor-pointer hover:text-gray-500";
      amILeading.addEventListener("click", () => {
        if (debounceTimeout) return;
        debounceTimeout = setTimeout(() => {
          debounceTimeout = null;
        }, 1000);

        checkLeadingStatus(listing.id, amount, card);
      });
      priceBidsTop.append(amILeading);

      const goToListing = document.createElement("button");
      goToListing.className =
        "absolute bottom-2 right-3 text-lg font-body text-blue-400  underline cursor-pointer hover:text-blue-500";
      goToListing.textContent = "Go to listing";
      goToListing.addEventListener("click", () => (window.location.href = `/post/index.html?listing_id=${listing.id}`));
      card.append(goToListing);

      bidCount.classList.add("hidden");

      price.textContent = `You bid ${amount}$`;
      priceBidsTop.append(price);

      sellerName.classList.add("h-4");

      const timeLeft = getTimeRemaining(listing.endsAt);
      timeRemaining.innerHTML = `Time remaining: <span class="text-red-500">${timeLeft}</span>`;

      category.innerHTML = `Category: <span class="font-semibold text-black">${
        listing.tags[0] || "No category"
      }</span>`;
    } else {
      listingTitle.textContent = title;
      cardInner.classList.add("hover:bg-gray-100", "cursor-pointer");

      img.className = media[0] ? "w-full h-full  object-cover object-center" : "opacity-40 place-self-center";
      img.src = media[0] ? media[0].url : "/snapbid_logo.png";
      img.alt = title || "";

      bidCount.textContent = `${_count.bids} bids`;

      const { highestBid } = getHighestBidValue(item);
      price.ariaLabel = `Current highest bid for item at ${highestBid}$`;
      price.textContent = `${highestBid}$`;
      priceBidsTop.appendChild(price);

      sellerName.textContent = `@${seller.name}`;

      const timeLeft = getTimeRemaining(endsAt);
      const isEnded = timeLeft === "Ended";
      timeRemaining.innerHTML = `Time remaining: <span class="text-red-500">${timeLeft}</span>`;

      const now = new Date();
      const ends = new Date(endsAt);
      if (now > ends) {
        card.append(endedLabel);
        card.classList.add("opacity-60");
      }

      if (isEnded) {
        if (winner) {
          const winnerBanner = document.createElement("div");
          winnerBanner.className = "absolute font-body  top-15 right-0 left-0 text-xl p-2 bg-green-300 text-center";
          winnerBanner.textContent = "🏆 You won this bid!";

          card.appendChild(endedLabel);

          card.append(winnerBanner);

          card.classList.add("opacity-100");
        } else {
          card.appendChild(endedLabel);
          card.classList.add("opacity-60");
        }
      }

      category.innerHTML = `Category: <span class="font-semibold text-black">${tags[0] || "No category"}</span>`;
    }

    infoWrapper.appendChild(priceBidsTop);
    infoWrapper.appendChild(shipping);
    infoWrapper.appendChild(sellerName);
    infoWrapper.appendChild(timeRemaining);
    infoWrapper.appendChild(category);

    cardBody.appendChild(imgWrapper);
    cardBody.appendChild(infoWrapper);

    cardInner.appendChild(listingTitle);
    cardInner.appendChild(cardBody);

    card.appendChild(cardInner);

    if (appendContainer !== "biddings") {
      card.addEventListener("click", () => (window.location.href = `/post/index.html?listing_id=${id}`));
    }

    container.appendChild(card);

    requestAnimationFrame(() => {
      card.classList.remove("opacity-0");
    });
  });
}

/**
 * Check if the user is leading the auction and animate accordingly.
 *
 * @param {string} listingId - The ID of the listing.
 * @param {string} myBid - value of my highest bid.
 * @param {HTMLElement} overlay - The price element to show the result.
 */
async function checkLeadingStatus(listingId, myBid, overlay) {
  const singleData = await getListingData(listingId);
  const highestBid = getHighestBidValue(singleData);

  const overlayDiv = document.createElement("div");
  overlayDiv.className =
    "grid place-items-center absolute top-0 left-0 w-full h-full rounded-md opacity-0 transform translate-x-full transition-all duration-500 ease-in-out";

  const overlayP = document.createElement("p");
  overlayP.className = " text-center text-3xl text-semibold";

  if (myBid < highestBid.highestBid) {
    overlayDiv.classList.add("bg-red-500/60");
    overlayP.textContent = "❕ You've been outbid!";
  } else {
    overlayDiv.classList.add("bg-green-500/60");
    overlayP.textContent = "✨ You are leading!";
  }

  overlayDiv.appendChild(overlayP);
  overlay.append(overlayDiv);

  setTimeout(() => {
    overlayDiv.classList.remove("opacity-0", "translate-x-full");
    overlayDiv.classList.add("opacity-100", "translate-x-0");
  }, 10);
  setTimeout(() => {
    overlayDiv.classList.remove("opacity-100", "translate-x-0");
    overlayDiv.classList.add("opacity-0", "translate-x-full");

    setTimeout(() => {
      overlayDiv.remove();
    }, 500);
  }, 3000);
}
