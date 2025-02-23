import { hamburgerToggle } from "../../ui/globals/hamburgerToggler.mjs";
import { compareUserAccess } from "../../ui/utility/compareUserAccess.mjs";
import { authGuard } from "../../ui/utility/authGuard.mjs";
import { postNewListing } from "../../ui/utility/profileUtils/createNewListing.mjs";
import { generateNavbar } from "../../ui/globals/navbarAccess.mjs";

generateNavbar();
authGuard();
hamburgerToggle();
compareUserAccess();

const form = document.forms.createNewListing;
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const loader = document.getElementById("loader");
  const submitBtn = document.getElementById("submit-btn");
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

if (!sessionStorage.getItem("fresh-listing") === true) {
  console.log("LOOOL");
}

let mediaCount = 1;
const maxMediaCount = 8;

const addMediaBtn = document.getElementById("add-media-btn");
const mediaContainer = document.getElementById("media-inputs-container");

addMediaBtn.addEventListener("click", () => {
  if (mediaCount < maxMediaCount) {
    mediaCount++;
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "flex items-center gap-2";

    const input = document.createElement("input");
    input.type = "text";
    input.name = "media[]";
    input.placeholder = "Add media url";
    input.className = "border p-2 rounded flex-grow";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className =
      "cursor-pointer w-6 h-6 border-3 border-red-400 rounded-full ml-2 grid place-items-center relative";
    removeBtn.addEventListener("click", () => {
      mediaDiv.remove();
      mediaCount--;

      if (mediaCount < maxMediaCount) {
        addMediaBtn.disabled = false;
      }
    });

    const minusBar = document.createElement("span");
    minusBar.className = "absolute w-3 h-1 bg-red-400 rounded";
    removeBtn.appendChild(minusBar);

    mediaDiv.appendChild(input);
    mediaDiv.appendChild(removeBtn);
    mediaContainer.appendChild(mediaDiv);
  }

  if (mediaCount === maxMediaCount) {
    addMediaBtn.disabled = true;
  }
});
