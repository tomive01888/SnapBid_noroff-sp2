import { handleApiRequest } from "../../api/apiRequestHandler.mjs";
import { optionEditListing } from "../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT } from "../../api/constants.mjs";
import { showToastMessage } from "../toastMessages/showToastMessage.mjs";

/**
 * Opens a modal for updating an auction listing. This modal allows users to edit the listing's title,
 * description, category, and media URLs. It also provides a button to submit the updates and
 * a button to close the modal.
 *
 * @param {string} id - The ID of the listing to be updated.
 * @param {Object} data - The current data of the listing.
 * @param {string} data.title - The current title of the listing.
 * @param {string} data.description - The current description of the listing.
 * @param {Array} data.tags - The current category tags of the listing.
 * @param {Array} data.media - The current media URLs associated with the listing.
 *
 * @example
 * openModalUpdateListing('12345', {
 *   title: 'Vintage Watch',
 *   description: 'A rare vintage watch from the 1950s.',
 *   tags: ['watches'],
 *   media: [{ url: 'image1.jpg' }, { url: 'image2.jpg' }]
 * });
 */
export async function openModalUpdateListing(id, data) {
  const token = sessionStorage.getItem("token");
  const modal = document.createElement("div");
  modal.id = "updateListingModal";
  modal.className = "fixed mt-16 inset-0 bg-black/80 flex justify-center items-start overflow-y-auto pt-20";

  document.body.appendChild(modal);

  const modalContent = document.createElement("div");
  modalContent.className = "bg-white px-4 py-12 rounded-md w-full max-w-[32rem] shadow-lg relative max-h-fit";

  const closeButton = document.createElement("button");
  closeButton.textContent = "✖";
  closeButton.type = "button";
  closeButton.className = "absolute text-3xl top-2 right-2 text-gray-600 hover:text-black";
  closeButton.onclick = () => modal.remove();

  const updateTitle = document.createElement("h2");
  updateTitle.className = "text-3xl font-semibold w-full my-2";
  updateTitle.textContent = "Update listing";

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title:";
  titleLabel.htmlFor = "title-input";
  const titleInput = document.createElement("input");
  titleInput.id = "title-input";
  titleInput.type = "text";
  titleInput.value = data.title || "";
  titleInput.className = "w-full p-2 border rounded mb-2 ";

  const descLabel = document.createElement("label");
  descLabel.textContent = "Description:";
  descLabel.htmlFor = "desc-input";
  const descInput = document.createElement("textarea");
  descInput.id = "desc-input";
  descInput.value = data.description || "";
  descInput.maxLength = 280;
  descInput.className = "w-full p-2 border rounded mb-2 md:resize-vertical h-52 ";

  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Category:";
  categoryLabel.htmlFor = "category-select";
  const categorySelect = document.createElement("select");
  categorySelect.id = "category-select";
  categorySelect.className = "w-full p-2 border rounded mb-2";

  const categories = [
    "...",
    "Vacation",
    "Art",
    "Watches",
    "Jewelry",
    "Vintage",
    "Fashion",
    "Cars",
    "Interiors",
    "Decor",
    "Games",
    "Books",
    "Toys",
    "Sports",
    "Collectibles",
  ];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;

    if (data.tags[0] === option.value) {
      option.selected = true;
    }

    categorySelect.appendChild(option);
  });

  const mediaContainer = document.createElement("div");
  mediaContainer.className = "mb-2";

  const mediaUrls = data.media || [];

  let mediaCount = mediaUrls.length;
  const maxMediaCount = 8;

  if (mediaUrls.length === 0) {
    const placeholderImage = document.createElement("img");
    placeholderImage.src = "/public/placeholder.jpg";
    placeholderImage.alt = "Placeholder image";
    placeholderImage.className = "w-full h-auto border rounded mb-2";

    mediaContainer.appendChild(placeholderImage);
  } else if (mediaUrls.length === 1) {
    const staticMediaLabel = document.createElement("label");
    staticMediaLabel.htmlFor = "static-label";
    staticMediaLabel.textContent = "Media:";
    const staticMediaInput = document.createElement("input");
    staticMediaInput.id = "static-label";
    staticMediaInput.type = "url";
    staticMediaInput.value = mediaUrls[0].url;
    staticMediaInput.className = "w-full p-2 border rounded mb-2";
    mediaContainer.prepend(staticMediaLabel, staticMediaInput);
  } else {
    const staticMediaLabel = document.createElement("label");
    staticMediaLabel.htmlFor = "static-label";
    staticMediaLabel.textContent = "Media:";
    const staticMediaInput = document.createElement("input");
    staticMediaInput.id = "static-label";
    staticMediaInput.type = "url";
    staticMediaInput.value = mediaUrls[0].url;
    staticMediaInput.className = "w-full p-2 border rounded mb-2";
    mediaContainer.prepend(staticMediaLabel, staticMediaInput);

    for (let i = 1; i < mediaUrls.length && i < 7; i++) {
      const dynamicMediaInput = createDynamicMediaInput(mediaUrls[i].url);
      mediaContainer.appendChild(dynamicMediaInput);
    }
  }

  const addMediaBtn = createAddMediaButton();
  if (mediaUrls.length >= maxMediaCount) {
    addMediaBtn.disabled = true;
    addMediaBtn.classList.add("opacity-50", "cursor-not-allowed");
  }

  mediaContainer.appendChild(addMediaBtn);

  const updateButton = document.createElement("button");
  updateButton.textContent = "Update Listing";
  updateButton.className = "w-full bg-green-500 text-white py-2 rounded mt-4";
  updateButton.onclick = async () => {
    updateButton.disabled = true;
    updateButton.textContent = "Updating...";

    const updatedData = {
      title: titleInput.value,
      description: descInput.value,
      tags: [categorySelect.value],
      media: Array.from(mediaContainer.querySelectorAll("input"))
        .map((input) => input.value.trim())
        .filter((url) => url)
        .map((url) => ({ url, alt: "" })),
    };

    try {
      const response = await handleApiRequest(
        `${AUCTION_LISTING_ENDPOINT}/${id}`,
        optionEditListing(updatedData, token)
      );

      if (!response || response.error) {
        throw new Error(response?.error || "Failed to update the listing");
      }

      showToastMessage("Listing updated successfully!", "success");
      modal.remove();
      location.reload();
    } catch (error) {
      showToastMessage(`${error.message}`, "error");
    } finally {
      updateButton.disabled = false;
      updateButton.textContent = "Update Listing";
    }
  };

  modalContent.append(
    closeButton,
    updateTitle,
    titleLabel,
    titleInput,
    descLabel,
    descInput,
    categoryLabel,
    categorySelect,
    mediaContainer,
    updateButton
  );
  modal.appendChild(modalContent);

  function createAddMediaButton() {
    const addMediaBtn = document.createElement("button");
    addMediaBtn.type = "button";
    addMediaBtn.className = "flex cursor-pointer gap-2 disabled:opacity-50 mt-1";
    addMediaBtn.addEventListener("click", addMediaInput);

    const plusIcon = document.createElement("div");
    plusIcon.className =
      "w-6 h-6 border-3 border-blue-400 rounded-full relative flex items-center justify-center disabled:border-gray-400";

    const horizontalBar = document.createElement("span");
    horizontalBar.className = "absolute w-3 h-1 bg-blue-400 rounded disabled:border-gray-400";

    const verticalBar = document.createElement("span");
    verticalBar.className = "absolute h-3 w-1 bg-blue-400 rounded disabled:border-gray-400";

    plusIcon.appendChild(horizontalBar);
    plusIcon.appendChild(verticalBar);

    const addGuidanceText = document.createElement("p");
    addGuidanceText.textContent = "Add more media";
    addGuidanceText.className = "text-blue-400";

    addMediaBtn.appendChild(plusIcon);
    addMediaBtn.appendChild(addGuidanceText);

    return addMediaBtn;
  }

  function createDynamicMediaInput(url) {
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "flex items-center gap-2 mb-2";

    const input = document.createElement("input");
    input.type = "text";
    input.ariaLabel = "add extra media input";
    input.value = url;
    input.placeholder = "Add media url";
    input.className = "border p-2 rounded flex-grow";

    const removeBtn = document.createElement("button");
    removeBtn.ariaLabel = "remove media input";
    removeBtn.type = "button";
    removeBtn.className =
      "cursor-pointer w-6 h-6 border-3 border-red-400 rounded-full ml-2 grid place-items-center relative";

    const minusBar = document.createElement("span");
    minusBar.className = "absolute w-3 h-1 bg-red-400 rounded";

    removeBtn.appendChild(minusBar);

    removeBtn.addEventListener("click", () => {
      mediaDiv.remove();
      mediaCount--;

      if (mediaCount < maxMediaCount) {
        addMediaBtn.disabled = false;
        addMediaBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }
    });

    mediaDiv.append(input, removeBtn);
    return mediaDiv;
  }

  function addMediaInput() {
    if (mediaCount < maxMediaCount) {
      mediaCount++;
      mediaContainer.insertBefore(createDynamicMediaInput(""), addMediaBtn);

      if (mediaCount === maxMediaCount) {
        addMediaBtn.disabled = true;
        addMediaBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
    }
  }
}
