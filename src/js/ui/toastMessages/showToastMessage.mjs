/**
 * Displays a toast notification on the page.
 *
 * @param {string} message - The message to be displayed in the toast.
 * @param {"success" | "error"} [type="success"] - The type of toast notification (success or error).
 *
 * @description
 * - Creates a temporary toast notification with an icon, message, and close button.
 * - Automatically removes itself after 5 seconds or when closed manually.
 * - Uses `sessionStorage` to determine positioning in the `main` section.
 * - Supports success (green) and error (orange) styles.
 * - Uses smooth transitions for entry and exit animations.
 */
export function showToastMessage(message, type = "success") {
  const main = document.querySelector("main");
  if (!main) return;

  if (document.querySelector(".toast-message")) return;

  const duration = 3500;

  const toast = document.createElement("div");
  toast.className = `toast-message fixed z-[99999] top-22 right-[-200px] flex items-center w-full max-w-[290px] md:max-w-[350px] p-2 text-gray-500 bg-gray-600 rounded-lg shadow-sm transition-transform duration-500 ease-out`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("tabindex", "-1");

  const iconWrapper = document.createElement("div");
  iconWrapper.className =
    "inline-flex items-center justify-center shrink-0 w-6 h-6 md:w-8 md:h-8 text-green-500 bg-green-200 rounded-lg ";

  if (type === "error") {
    iconWrapper.classList.add("text-orange-500", "bg-orange-100", "dark:bg-orange-700", "dark:text-orange-200");
    iconWrapper.innerHTML = `
      <svg class="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
      </svg>`;
  } else {
    iconWrapper.classList.add("text-green-500", "bg-green-100", "dark:bg-green-800", "dark:text-green-200");
    iconWrapper.innerHTML = `
      <svg class="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
      </svg>`;
  }

  const text = document.createElement("div");
  text.className = "ms-3 w-full max-w-44 md:max-w-58 text-sm md:text-[16px] font-body text-gray-100 text-wrap";
  text.innerHTML = message.replace("Bad Request.", "Bad Request.<br>");

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className =
    "absolute right-4 -mx-1.5 -my-1.5 bg-white/20 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-200/40 inline-flex items-center justify-center h-8 w-8";
  closeButton.innerHTML = `
    <span class="sr-only">Close</span>
    <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
    </svg>`;

  closeButton.onclick = () => removeToast();
  closeButton.setAttribute("aria-label", "Close notification");

  function removeToast() {
    toast.style.transform = "translateX(120%)";
    setTimeout(() => toast.remove(), 500);
  }

  document.addEventListener("keydown", function handleKeydown(event) {
    if (event.key === "Escape") {
      removeToast();
      document.removeEventListener("keydown", handleKeydown);
    }
  });

  toast.appendChild(iconWrapper);
  toast.appendChild(text);
  toast.appendChild(closeButton);
  main.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateX(-210px)";
    closeButton.focus();
  }, 50);

  setTimeout(() => {
    removeToast();
  }, duration);
}
