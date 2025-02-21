/**
 * Toggles the visibility of the hamburger menu and automatically closes the menu
 * when resizing from mobile to desktop view (screen width >= 768px).
 *
 * @async
 * @function hamburgerToggle
 * @returns {Promise<void>} A promise that resolves once the menu functionality is initialized.
 *
 * @example
 * // Initialize the hamburger menu toggling behavior
 * hamburgerToggle();
 */
export async function hamburgerToggle() {
  const hamburgerIcon = document.getElementById("ham-btn");
  const hamburgerContainer = document.getElementById("burger-menu");

  hamburgerIcon.addEventListener("click", () => {
    hamburgerContainer.classList.toggle("hidden");
  });

  function resetMenuOnResize() {
    if (window.innerWidth >= 768) {
      hamburgerContainer.classList.add("hidden");
    }
  }

  window.addEventListener("resize", resetMenuOnResize);

  resetMenuOnResize();
}
