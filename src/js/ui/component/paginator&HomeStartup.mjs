import { showToastMessage } from "../toastMessages/showToastMessage.mjs";
import { generateAuctionCards } from "./listingCardCreator.mjs";
import { handleApiRequest } from "../../api/apiRequestHandler.mjs";
import { optionGet } from "../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../api/constants.mjs";
import { fetchCaseInsensitiveCategories } from "../utility/homeUtils/fetchCaseInsensitiveCategory.mjs";

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

document.getElementById("search-listing").addEventListener(
  "input",
  debounce(async () => {
    resetFilters("search");
    await updateListings();
  }, 500)
);

document.getElementById("category-select").addEventListener("change", async () => {
  resetFilters("category");
  await updateListings();
});

document.getElementById("enable-inactive-listings").addEventListener("change", async () => {
  currentPage = 1;
  await updateListings();
});

function resetFilters(context) {
  if (context === "search") {
    document.getElementById("enable-inactive-listings").checked = false;
    document.getElementById("category-select").selectedIndex = 0;
  } else if (context === "category") {
    document.getElementById("enable-inactive-listings").checked = false;
    document.getElementById("search-listing").value = "";
  }
  currentPage = 1;
}

async function fetchData(searchQuery, selectedCategory, showInactive) {
  let data, meta;
  try {
    if (searchQuery) {
      const url = `${AUCTION_LISTING_ENDPOINT}/search?q=${searchQuery}&_seller=true&_bids=true&_active=${!showInactive}`;
      ({ data, meta } = await handleApiRequest(url, optionGet));
    } else if (selectedCategory) {
      ({ data, meta } = await fetchCaseInsensitiveCategories(selectedCategory, currentPage, showInactive));
    } else {
      const url = `${AUCTION_LISTING_ENDPOINT}?_seller=true&_bids=true&_active=${!showInactive}&limit=12&page=${currentPage}`;
      ({ data, meta } = await handleApiRequest(url, optionGet));
    }
  } catch (error) {
    showToastMessage(`${error.message}`, "error");
  }
  return { data, meta };
}
export async function updateListings() {
  const showInactive = document.getElementById("enable-inactive-listings").checked;
  const searchQuery = document.getElementById("search-listing").value.trim();
  const selectedCategory = document.getElementById("category-select").value;

  const { data, meta } = await fetchData(searchQuery, selectedCategory, showInactive);
  const container = document.getElementById("listings-container");
  if (!data || data.length === 0) {
    container.textContent = `Sorry, there are no results with these search criteria`;
  } else {
    generateAuctionCards(data, "listings-container");
  }

  if (meta) {
    updatePaginationControls(meta);
  }
}

function updatePaginationControls(meta) {
  if (!meta || !meta.pageCount) return;

  const prevButton = document.getElementById("prev-posts");
  const nextButton = document.getElementById("next-posts");

  prevButton.disabled = meta.isFirstPage;
  nextButton.disabled = meta.isLastPage || meta.pageCount <= 1;

  document.querySelector(".go-to").value = currentPage;
  document.querySelector(".max-page").textContent = `of ${meta.pageCount || 1}`;
}

export async function prevPage() {
  if (currentPage > 1) {
    currentPage -= 1;
    await updateListings();
  }
  document.getElementById("search-listing").scrollIntoView({ behavior: "smooth" });
}

export async function nextPage() {
  currentPage += 1;
  await updateListings();
  document.getElementById("search-listing").scrollIntoView({ behavior: "smooth" });
}

export async function goToPage(pageInput) {
  const maxPageText = document.querySelector(".max-page").textContent;
  const maxPage = parseInt(maxPageText.replace("of ", ""), 10) || 1;
  if (pageInput >= 1 && pageInput <= maxPage) {
    currentPage = pageInput;
    await updateListings();
    document.getElementById("search-listing").scrollIntoView({ behavior: "smooth" });
  } else {
    showToastMessage(`Please enter a page number between 1 and ${maxPage}`, "error");
    currentPage = 1;
    goToPage(1);
  }
}

let currentPage = 1;
await updateListings();
