import { getHighestBidValue } from "../utility/getHighestBidHandler.mjs";
import { getTimeRemaining } from "../utility/timeRemaining.mjs";

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

  if (data.length === 0) {
    container.textContent = "You have not made any listings go to create listing to start auctioning items.";
    container.classList.add("min-h-svh");
    return;
  }

  if (!container) {
    console.error(`Container with ID "${appendContainer}" not found.`);
    return;
  }
  container.innerHTML = "";

  data.forEach((item) => {
    const { id, title, media, seller, _count, tags, endsAt, leading, amount } = item;

    const timeLeft = getTimeRemaining(endsAt);
    const isEnded = timeLeft === "Ended";

    const card = document.createElement("div");
    card.className = "m-auto cursor-pointer opacity-0 transition-opacity duration-500 relative w-full relative";

    const cardInner = document.createElement("div");
    cardInner.className = "w-full border rounded-lg shadow-md bg-white hover:bg-gray-100 p-2 ";

    if (appendContainer === "biddings" && leading) {
      const winningBanner = document.createElement("div");
      winningBanner.className = "absolute top-15 right-0 left-0 text-xl p-2 bg-green-300 text-center font-body ";
      winningBanner.textContent = "✨ You are leading";
      card.append(winningBanner);
    } else if (appendContainer === "biddings") {
      const loosingBanner = document.createElement("div");
      loosingBanner.className = " flex justify-center absolute top-15 right-0 left-0  bg-red-300  p-2";

      const loosingIcon = document.createElement("span");
      loosingIcon.className = "text-xl";
      loosingIcon.textContent = "❌";

      const loosingText = document.createElement("span");
      loosingText.className = "text-pretty font-body text-xl";
      loosingText.textContent = "You have been outbid";

      loosingBanner.appendChild(loosingIcon);
      loosingBanner.appendChild(loosingText);
      card.appendChild(loosingBanner);
    }

    if (appendContainer === "biddings") {
      const bidAmount = document.createElement("p");
      bidAmount.className = "absolute bottom-3 right-3 text-xl font-body text-blue-500 font-semibold";
      bidAmount.textContent = `You bid ${amount}$`;
      card.append(bidAmount);
    }

    const listingTitle = document.createElement("h2");
    listingTitle.className = "text-2xl p-2 font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-full";
    listingTitle.textContent = title;

    const cardBody = document.createElement("div");
    cardBody.className = "flex gap-1 w-full flex-col ";

    const imgWrapper = document.createElement("div");
    imgWrapper.className = " w-full max-w-58 aspect-[9/10] grid overflow-hidden rounded-md m-auto";

    const img = document.createElement("img");
    img.src = media[0] ? media[0].url : "/snapbid_logo.png";
    img.alt = title || "";
    img.className = media[0] ? "object-cover object-center w-auto h-full" : "opacity-40 place-self-center";
    imgWrapper.appendChild(img);

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "flex flex-col justify-between";

    const priceBidsTop = document.createElement("div");
    priceBidsTop.className = "flex justify-between";

    const { highestBid } = getHighestBidValue(item);
    const price = document.createElement("span");
    price.role = "presentation";
    price.className = "text-3xl price-large font-bold";
    price.ariaLabel = `Current highest bid for item at ${highestBid}$`;
    price.textContent = `${highestBid}$`;

    const bidCount = document.createElement("p");
    bidCount.className = "text-gray-600 text-xl";
    bidCount.textContent = `${_count.bids} bids`;

    priceBidsTop.appendChild(bidCount);
    priceBidsTop.appendChild(price);

    const shipping = document.createElement("p");
    shipping.className = "text-gray-500 place-self-end";
    shipping.textContent = "Free shipping!";

    const sellerName = document.createElement("p");
    sellerName.className = "text-blue-500 font-semibold text-xl";
    sellerName.textContent = `@${seller.name}`;

    const timeRemaining = document.createElement("p");
    timeRemaining.className = "text-md";
    timeRemaining.innerHTML = `Time remaining: <span class="text-red-500">${timeLeft}</span>`;

    const category = document.createElement("p");
    category.className = "font-semibold";
    category.innerHTML = `Category: <span class="font-semibold text-black">${tags[0] || "No category"}</span>`;

    const endedLabel = document.createElement("div");
    endedLabel.className =
      "absolute font-body bottom-2 right-2 bg-red-400 text-white text-xl font-bold px-2 py-1 rounded";
    endedLabel.textContent = "Auction Ended";

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

    card.addEventListener("click", () => (window.location.href = `/post/index.html?listing_id=${id}`));

    container.appendChild(card);

    requestAnimationFrame(() => {
      card.classList.remove("opacity-0");
    });
  });
}
