/**
 * Creates an interactive image gallery for displaying auction item images.
 *
 * @param {string} containerId - The ID of the container element where the gallery will be rendered.
 * @param {Array} mediaArray - An array of media objects, each containing:
 *   @param {string} mediaArray[].url - The URL of the image.
 *   @param {string} mediaArray[].alt - The alternative text for the image.
 *
 * @description
 * - Displays a main image with navigation arrows.
 * - Shows a scrollable thumbnail gallery.
 * - Clicking a thumbnail updates the main image.
 * - Supports left/right navigation with buttons.
 * - Handles cases where no media is provided by displaying a placeholder image.
 * - Centers the active thumbnail in the viewport on selection.
 */
export function createImageGallery(containerId, mediaArray) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  let currentIndex = 0;

  const mainDisplay = document.createElement("div");
  mainDisplay.className = "w-full aspect-square flex justify-center mb-4 m-auto relative";

  const activeImg = document.createElement("img");
  activeImg.id = "activeImg";
  activeImg.className = "w-full object-cover rounded-md shadow-lg outline-1 outline-gray-200";

  const leftButton = document.createElement("button");
  leftButton.innerHTML = "&#10094;";
  leftButton.className = "p-2 rounded-full bg-blue-500 text-white shadow hidden md:flex disabled:opacity-30";
  leftButton.addEventListener("click", () => {
    currentIndex = currentIndex === 0 ? mediaArray.length - 1 : currentIndex - 1;
    updateActiveImage();
    centerActiveImage();
  });

  const rightButton = document.createElement("button");
  rightButton.innerHTML = "&#10095;";
  rightButton.className = "p-2 rounded-full bg-blue-500 text-white shadow hidden md:flex disabled:opacity-30";
  rightButton.addEventListener("click", () => {
    currentIndex = currentIndex === mediaArray.length - 1 ? 0 : currentIndex + 1;
    updateActiveImage();
    centerActiveImage();
  });

  const updateActiveImage = () => {
    activeImg.src = mediaArray[currentIndex]?.url || "/snapbid_logo.png";
    activeImg.alt = mediaArray[currentIndex]?.alt || "Auction item image";
  };

  if (mediaArray.length > 0) {
    updateActiveImage();
  } else {
    activeImg.src = "/snapbid_logo.png";
    activeImg.alt = "Auction item image";
    activeImg.className += " opacity-30 object-contain";
    activeImg.classList.remove("object-cover");
  }

  mainDisplay.appendChild(activeImg);

  const imageGalleryWrapper = document.createElement("div");
  imageGalleryWrapper.className = "flex items-center justify-between gap-2 w-full overflow-hidden overflow-x-hidden";

  const imageGalleryViewport = document.createElement("div");
  imageGalleryViewport.className = "md:overflow-hidden md:w-[240px] md:w-[300px] relative";
  imageGalleryViewport.id = "imageGalleryViewport";

  const imageGallery = document.createElement("div");
  imageGallery.className = "flex gap-4 w-max p-0.5 transition-transform duration-300 ease-in-out md:mx-[120px] ";
  imageGallery.id = "imageGallery";

  if (mediaArray.length === 0) {
    console.log("zero");

    const img = document.createElement("img");
    img.src = "/snapbid_logo.png";
    img.alt = "snapbid_logo";
    img.className =
      "w-24 md:w-30 aspect-[5/4.5]  object-contain opacity-30 shadow-md outline-1 outline-gray-400 cursor-pointer rounded-md border-3 border-transparent hover:border-blue-400 snap-center transition-all duration-300 ease-in-out";
    imageGallery.appendChild(img);
  }

  mediaArray.forEach((media, index) => {
    const img = document.createElement("img");
    img.src = media.url;
    img.alt = media.alt;
    img.className =
      "w-24 md:w-30 aspect-[5/4.5] shadow-md outline-1 outline-gray-200 object-cover cursor-pointer rounded-md border-3 border-transparent hover:border-blue-400 snap-center transition-all duration-300 ease-in-out";

    img.addEventListener("click", () => {
      currentIndex = index;
      updateActiveImage();
      centerActiveImage();
    });

    imageGallery.appendChild(img);
  });

  const centerActiveImage = () => {
    const activeThumbnail = imageGallery.children[currentIndex];
    if (activeThumbnail) {
      const viewport = document.getElementById("imageGalleryViewport");
      const viewportWidth = viewport.offsetWidth;
      const thumbnailWidth = activeThumbnail.offsetWidth;
      const thumbnailLeft = activeThumbnail.offsetLeft;

      const scrollLeft = thumbnailLeft - viewportWidth / 2 + thumbnailWidth / 2;

      viewport.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  imageGalleryViewport.appendChild(imageGallery);
  imageGalleryWrapper.appendChild(leftButton);
  imageGalleryWrapper.appendChild(imageGalleryViewport);
  imageGalleryWrapper.appendChild(rightButton);

  container.appendChild(mainDisplay);
  container.appendChild(imageGalleryWrapper);

  centerActiveImage();
}
