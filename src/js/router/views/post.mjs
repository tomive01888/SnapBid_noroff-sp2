import { populateListingDetails } from "../../ui/utility/singleListingUtils/populateListingDetails.mjs";
import { createImageGallery } from "../../ui/component/imageGallery.mjs";
import { openBidModal } from "../../ui/component/openModalBid.mjs";
import { openDeleteModal } from "../../ui/component/openModalDelete.mjs";
import { openModalUpdateListing } from "../../ui/component/openModalUpdateListing.mjs";
import { hamburgerToggle } from "../../ui/globals/hamburgerToggler.mjs";
import { compareUserAccess } from "../../ui/utility/compareUserAccess.mjs";
import { getHighestBidValue } from "../../ui/utility/getHighestBidHandler.mjs";
import { showToastMessage } from "../../ui/toastMessages/showToastMessage.mjs";
import { showMoreListingsFromSeller } from "../../ui/utility/singleListingUtils/showMoreListings.mjs";
import { showBidHistory } from "../../ui/utility/singleListingUtils/showBidHistory.mjs";
import { generateNavbar } from "../../ui/globals/navbarAccess.mjs";
import { getListingData } from "../../ui/utility/singleListingUtils/fetchListingData.mjs";

compareUserAccess();
generateNavbar();
hamburgerToggle();

const urlSearch = new URLSearchParams(window.location.search);
const listId = urlSearch.get("listing_id");
const listingData = await getListingData(listId);
const bidNowButton = document.getElementById("bid-now");
document.getElementById("head-title").textContent = `${listingData.title} | SnapBid`;

showMoreListingsFromSeller(listingData, listId);
showBidHistory(listingData);

if (!sessionStorage.token) {
  bidNowButton.disabled = true;
  document.getElementById("more-from-seller").classList.add("hidden");
  document.getElementById("view-bid-history").classList.add("hidden");
} else {
  document.getElementById("more-from-seller").classList.remove("hidden");
  document.getElementById("view-bid-history").classList.remove("hidden");
}

async function activateSingleListing() {
  populateListingDetails(listingData);
  createImageGallery("image-container", listingData.media);
}
activateSingleListing();

const { highestBidName } = getHighestBidValue(listingData);
const user = JSON.parse(sessionStorage.getItem("SnapBid-User")) || {};
if (highestBidName === user.name) {
  bidNowButton.disabled = true;
} else {
  bidNowButton.addEventListener("click", () => {
    if (listingData) {
      openBidModal(listingData, listId);
    } else {
      console.error("Listing data not available yet.");
    }
  });
}

document.getElementById("delete").addEventListener("click", () => {
  openDeleteModal(listId);
});

document.getElementById("edit").addEventListener("click", () => {
  openModalUpdateListing(listId, listingData);
});

if (!sessionStorage.bidSuccess === false) {
  showToastMessage("Bid successfully placed", "success");
  sessionStorage.removeItem("bidSuccess");
}

async function handleEditorConsole() {
  const userName = JSON.parse(sessionStorage.getItem("SnapBid-User"));
  const editorConsole = document.getElementById("editor-console");

  if (!userName) return;

  if (userName.name !== listingData.seller.name) {
    editorConsole.classList.add("hidden");
  } else {
    editorConsole.classList.remove("hidden");
    editorConsole.classList.add("flex");
  }
}
handleEditorConsole();
