import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionPost } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../../api/constants.mjs";
import { showToastMessage } from "../../toastMessages/showToastMessage.mjs";

/**
 * Creates a new auction listing by posting the form data to the API.
 *
 * @async
 * @returns {void}
 *
 * This function retrieves values from the form fields, constructs a listing object with title, description, category,
 * media, and the auction duration. The auction's end date is calculated based on the selected duration.
 * The data is then sent to the API to create a new listing.
 *
 * If successful, a success message is shown, otherwise, an error message is displayed.
 */
export async function postNewListing() {
  const token = sessionStorage.getItem("token");

  const form = document.getElementById("auctionForm");
  const title = form.querySelector('input[name="title"]').value;
  const description = form.querySelector('textarea[name="description"]').value;
  const category = form.querySelector('select[name="category"]').value;
  const duration = form.querySelector('select[name="duration"]').value;

  const mediaInputs = form.querySelectorAll('input[name="media[]"]');
  const media = [];
  mediaInputs.forEach((input) => {
    const url = input.value;
    if (url) {
      media.push({ url, alt: "" });
    }
  });

  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + parseInt(duration));

  const listingsData = {
    title,
    description: description || "",
    tags: [category],
    media,
    endsAt: endsAt.toISOString(),
  };

  try {
    const req = await handleApiRequest(AUCTION_LISTING_ENDPOINT, optionPost(listingsData, token));

    if (req) {
      const goToListing = document.getElementById("go-to-listing");
      goToListing.disabled = false;
      goToListing.addEventListener(
        "click",
        () => (window.location.href = `/post/index.html?listing_id=${req.data.id}`)
      );

      showToastMessage("Your auction listing has been created!", "success");
    }
  } catch (error) {
    console.error("Error creating auction listing:", error);
    showToastMessage(error.message, "error");
  }
}
