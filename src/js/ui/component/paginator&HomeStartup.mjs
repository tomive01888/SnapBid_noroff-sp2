import { showToastMessage } from "../toastMessages/showToastMessage.mjs";
import { generateAuctionCards } from "./listingCardCreator.mjs";
import { fetchSearchResults } from "../utility/homeUtils/searchHandler.mjs";
import { fetchFilteredListingsCaseInsensitive } from "../utility/homeUtils/categoryAndActiveHandler.mjs";
import { fetchAllListings } from "../utility/homeUtils/fetchAllListings.mjs";

document.getElementById("search-listing").addEventListener("input", async () => {
  document.getElementById("enable-inactive-listings").checked = false;
  currentPage = 1;
  const meta = await initializeHome();
  if (meta) updatePaginationControls(meta);
  updateUrlWithPage(currentPage);
});

document.getElementById("category-select").addEventListener("change", async () => {
  document.getElementById("enable-inactive-listings").checked = false;
  document.getElementById("search-listing").value = "";
  currentPage = 1;
  const meta = await initializeHome();
  if (meta) updatePaginationControls(meta);
  updateUrlWithPage(currentPage);
});

document.getElementById("enable-inactive-listings").addEventListener("change", async () => {
  currentPage = 1;
  const showInactive = document.getElementById("enable-inactive-listings").checked;
  const meta = await initializeHome(showInactive);
  if (meta) updatePaginationControls(meta);
  updateUrlWithPage(currentPage);
});

function updateUrlWithPage(page) {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set("page", page);
  window.history.pushState({}, "", newUrl);
}

let currentPage = new URLSearchParams(window.location.search).get("page")
  ? parseInt(new URLSearchParams(window.location.search).get("page"), 10)
  : 1;

if (isNaN(currentPage) || currentPage < 1) {
  currentPage = 1;
}

const meta = await initializeHome();
if (meta) {
  updatePaginationControls(meta);
}

const container = document.getElementById("listings-container");

export async function initializeHome(showInactive, page = 1) {
  currentPage = page;
  const searchQuery = document.getElementById("search-listing").value.trim();
  const selectedCategory = document.getElementById("category-select").value;

  let response;

  try {
    if (searchQuery) {
      response = await fetchSearchResults(searchQuery, currentPage);
    } else if (selectedCategory) {
      response = await fetchFilteredListingsCaseInsensitive(selectedCategory, currentPage, showInactive);
    } else {
      response = await fetchAllListings(currentPage, showInactive);
    }

    const { data, meta } = response;

    if (!data || data.length === 0) {
      container.innerHTML = `<p>Sorry, there are no results with these search criteria.</p>`;
      return meta;
    }

    console.log("home", data, meta);

    const paginatedData = data.slice(0, 12);
    generateAuctionCards(paginatedData, "listings-container");
    return meta;
  } catch (error) {
    console.error("Something went wrong:", error);
    return null;
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
  const showInactive = document.getElementById("enable-inactive-listings").checked;
  if (currentPage > 1) {
    currentPage -= 1;
    const meta = await initializeHome(showInactive, currentPage);
    if (meta) {
      updatePaginationControls(meta);
      updateUrlWithPage(currentPage);
    }
  }
  document.getElementById("search-listing").scrollIntoView({ behavior: "smooth" });
}

export async function nextPage() {
  const showInactive = document.getElementById("enable-inactive-listings").checked;
  currentPage += 1;
  const meta = await initializeHome(showInactive, currentPage);
  if (meta) {
    updatePaginationControls(meta);
    updateUrlWithPage(currentPage);
  }
  document.getElementById("search-listing").scrollIntoView({ behavior: "smooth" });
}

export async function goToPage(pageInput) {
  const showInactive = document.getElementById("enable-inactive-listings").checked;
  if (pageInput >= 1) {
    currentPage = pageInput;
    const meta = await initializeHome(showInactive, currentPage);
    if (meta) {
      updatePaginationControls(meta);
      updateUrlWithPage(currentPage);
    }
    document.getElementById("search-listing").scrollIntoView({ behavior: "smooth" });
  } else {
    showToastMessage(`Please enter a page number between 1 and ${meta.pageCount}`, "error");
  }
}
