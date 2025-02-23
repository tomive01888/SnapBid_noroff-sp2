import { getHighestBidValue } from "../utility/getHighestBidHandler.mjs";
import { getListingData } from "../utility/singleListingutils/fetchListingData.mjs";
import { getTimeRemaining } from "../utility/timeRemaining.mjs";
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

  document.querySelectorAll(".content-container").forEach((div) => {
    div.innerHTML = "";
  });

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
    if (appendContainer !== "biddings") {
      cardInner.classList.add("hover:bg-gray-100", "cursor-pointer");
    }

    const listingTitle = document.createElement("h2");
    listingTitle.className = "text-2xl p-2 font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-full";
    if (appendContainer === "biddings") {
      listingTitle.textContent = listing.title;
    } else {
      listingTitle.textContent = title;
    }

    const cardBody = document.createElement("div");
    cardBody.className = "flex gap-1 w-full flex-col ";

    const imgWrapper = document.createElement("div");
    imgWrapper.className = " w-full max-w-58 aspect-[9/10] grid overflow-hidden rounded-md m-auto";

    const img = document.createElement("img");
    if (appendContainer === "biddings") {
      img.className = listing.media[0] ? "object-cover object-center w-auto h-full" : "opacity-40 place-self-center";
      img.src = listing.media[0] ? listing.media[0].url : "/snapbid_logo.png";
      img.alt = listing.title || "";
    } else {
      img.className = media[0] ? "object-cover object-center w-auto h-full" : "opacity-40 place-self-center";
      img.src = media[0] ? media[0].url : "/snapbid_logo.png";
      img.alt = title || "";
    }

    imgWrapper.appendChild(img);

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "flex flex-col justify-between";

    const priceBidsTop = document.createElement("div");
    priceBidsTop.className = "flex justify-between";
    if (appendContainer === "biddings") {
      const amILeading = document.createElement("p");

      amILeading.textContent = "Am I leading?";
      amILeading.className = "text-lg font-body text-gray-400 underline cursor-pointer hover:text-gray-500";
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
    }
    const bidCount = document.createElement("p");
    bidCount.className = "text-gray-600 text-xl";
    if (appendContainer === "biddings") {
      bidCount.classList.add("h-6");
    } else {
      bidCount.textContent = `${_count.bids} bids`;
    }
    const price = document.createElement("span");
    price.className = "text-2xl price-large font-bold";
    price.role = "presentation";
    priceBidsTop.appendChild(bidCount);

    if (appendContainer !== "biddings") {
      const { highestBid } = getHighestBidValue(item);
      price.ariaLabel = `Current highest bid for item at ${highestBid}$`;
      price.textContent = `${highestBid}$`;
      priceBidsTop.appendChild(price);
    } else {
      price.textContent = `You bid ${amount}$`;
      priceBidsTop.append(price);
    }

    const shipping = document.createElement("p");
    shipping.className = "text-gray-500 place-self-end";
    shipping.textContent = "Free shipping!";

    const sellerName = document.createElement("p");
    sellerName.className = "text-blue-500 font-semibold text-xl";
    if (appendContainer === "biddings") {
      sellerName.classList.add("h-4");
    } else {
      sellerName.textContent = `@${seller.name}`;
    }

    const endedLabel = document.createElement("div");
    endedLabel.className =
      "absolute font-body bottom-2 right-2 bg-red-400 text-white text-xl font-bold px-2 py-1 rounded";
    endedLabel.textContent = "Auction Ended";

    if (appendContainer !== "biddings") {
      const timeLeft = getTimeRemaining(endsAt);
      const isEnded = timeLeft === "Ended";

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
    }
    const timeRemaining = document.createElement("p");
    timeRemaining.className = "text-md";
    if (appendContainer === "biddings") {
      const timeLeft = getTimeRemaining(listing.endsAt);
      timeRemaining.innerHTML = `Time remaining: <span class="text-red-500">${timeLeft}</span>`;
    } else {
      const timeLeft = getTimeRemaining(endsAt);
      timeRemaining.innerHTML = `Time remaining: <span class="text-red-500">${timeLeft}</span>`;
    }

    const category = document.createElement("p");
    category.className = "font-semibold";
    if (appendContainer === "biddings") {
      category.innerHTML = `Category: <span class="font-semibold text-black">${
        listing.tags[0] || "No category"
      }</span>`;
    } else {
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
