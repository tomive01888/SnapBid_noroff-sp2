import { postNewListing } from "../utility/profile-utils/createNewListing.mjs";

export async function createAuctionForm() {
  document.querySelectorAll(".content-container").forEach((div) => {
    div.innerHTML = "";
  });

  const container = document.getElementById("creating");
  container.innerHTML = "";

  const form = document.createElement("form");
  form.id = "auctionForm";
  form.className = "w-full flex flex-col p-4 border rounded-lg bg-white";

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title:";
  titleLabel.htmlFor = "title-input";
  const titleInput = document.createElement("input");
  titleInput.id = "title-input";
  titleInput.type = "text";
  titleInput.name = "title";
  titleInput.maxLength = 100;
  titleInput.required = true;
  titleInput.className = "border p-2 rounded";

  const descLabel = document.createElement("label");
  descLabel.textContent = "Description:";
  descLabel.className = "mt-4";
  descLabel.htmlFor = "description-input";
  const descInput = document.createElement("textarea");
  descInput.id = "description-input";
  descInput.name = "description";
  descInput.maxLength = 280;
  descInput.rows = 4;
  descInput.className = "border p-2 rounded min-h-36 max-h-72";

  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Category:";
  categoryLabel.className = "mt-4";
  categoryLabel.htmlFor = "category-input";
  const categorySelect = document.createElement("select");
  categorySelect.id = "category-input";
  categorySelect.name = "category";
  categorySelect.className = "border p-2 rounded";

  const categories = [
    "",
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
    categorySelect.appendChild(option);
  });

  const durationLabel = document.createElement("label");
  durationLabel.textContent = "Duration:";
  durationLabel.className = "mt-4";
  durationLabel.htmlFor = "duration-input";
  const durationSelect = document.createElement("select");
  durationSelect.id = "duration-input";
  durationSelect.name = "duration";
  durationSelect.className = "border p-2 rounded";

  const durations = [3, 7, 30, 60];
  durations.forEach((days) => {
    const option = document.createElement("option");
    option.value = days;
    option.textContent = `${days} days`;
    durationSelect.appendChild(option);
  });

  const mediaLabel = document.createElement("p");
  mediaLabel.textContent = "Media:";
  mediaLabel.htmlFor = "media-inputs-container";
  const mediaContainer = document.createElement("div");
  mediaContainer.id = "media-inputs-container";
  mediaContainer.className = "flex flex-col gap-1 mt-4";

  let mediaCount = 1;
  const maxMediaCount = 8;

  function createMediaInput() {
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "flex items-center gap-2";

    const input = document.createElement("input");
    input.type = "text";
    input.name = "media[]";
    input.placeholder = "Add media url";
    input.className = "border p-2 rounded flex-grow";

    if (mediaCount > 1) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.ariaLabel = "Remove media input";
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
    } else {
      mediaDiv.append(input);
    }

    return mediaDiv;
  }

  mediaContainer.prepend(mediaLabel);
  mediaContainer.appendChild(createMediaInput());

  const addMediaBtn = document.createElement("button");
  addMediaBtn.type = "button";
  addMediaBtn.className = "flex cursor-pointer gap-2 disabled:opacity-50 mt-4";
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

  function addMediaInput() {
    if (mediaCount < maxMediaCount) {
      mediaCount++;
      mediaContainer.appendChild(createMediaInput());

      if (mediaCount === maxMediaCount) {
        addMediaBtn.disabled = true;
        addMediaBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
    }
  }

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.type = "submit";
  submitBtn.className = "bg-green-500 text-white p-2 rounded mt-4";

  const loader = document.createElement("div");
  loader.className = "hidden w-6 h-6 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin m-auto";
  submitBtn.appendChild(loader);

  form.append(
    titleLabel,
    titleInput,
    descLabel,
    descInput,
    categoryLabel,
    categorySelect,
    durationLabel,
    durationSelect,
    mediaContainer,
    addMediaBtn,
    submitBtn
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = "";
    loader.classList.remove("hidden");
    submitBtn.appendChild(loader);

    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      postNewListing();
      form.reset();
    } catch (error) {
    } finally {
      submitBtn.disabled = false;
      loader.classList.add("hidden");
      submitBtn.textContent = "Submit";
    }
  });

  container.appendChild(form);
}
