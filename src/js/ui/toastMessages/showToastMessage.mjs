/**
 * Displays a toast notification on the page.
 *
 * @param {string} message - The message to be displayed in the toast.
 * @param {"success" | "error"} [type="success"] - The type of toast notification (success or error).
 */
export function showToastMessage(message, type = "success") {
  const main = document.querySelector("main");
  if (!main) return;

  if (document.querySelector(".toast-message")) return;

  const duration = 3500;

  const toast = document.createElement("div");
  toast.className =
    "toast-message fixed z-[99999] top-22 right-[-200px] flex items-center w-full max-w-[290px] md:max-w-[350px] p-2 text-gray-500 bg-gray-600 rounded-lg shadow-sm transition-transform duration-500 ease-out";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("tabindex", "-1");

  // Icon wrapper
  const iconWrapper = document.createElement("div");
  iconWrapper.className = "inline-flex items-center justify-center shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg";

  // Apply type-based colors
  if (type === "error") {
    iconWrapper.classList.add("text-orange-500", "bg-orange-100", "dark:bg-orange-700", "dark:text-orange-200");
  } else {
    iconWrapper.classList.add("text-green-500", "bg-green-100", "dark:bg-green-800", "dark:text-green-200");
  }

  // Icon SVG
  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iconSvg.setAttribute("aria-hidden", "true");
  iconSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  iconSvg.setAttribute("fill", "currentColor");
  iconSvg.setAttribute("viewBox", "0 0 20 20");
  iconSvg.classList.add("w-4", "h-4", "md:w-5", "md:h-5");

  const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  iconPath.setAttribute(
    "d",
    type === "error"
      ? "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
      : "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
  );
  iconSvg.appendChild(iconPath);
  iconWrapper.appendChild(iconSvg);

  // Text
  const text = document.createElement("div");
  text.className = "ms-3 w-full max-w-44 md:max-w-58 text-sm md:text-[16px] font-body text-gray-100";

  message.split("\n").forEach((line, idx, arr) => {
    text.appendChild(document.createTextNode(line));
    if (idx < arr.length - 1) {
      text.appendChild(document.createElement("br"));
    }
  });

  // Close button
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className =
    "absolute right-4 -mx-1.5 -my-1.5 bg-white/20 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-200/40 inline-flex items-center justify-center h-8 w-8";
  closeButton.setAttribute("aria-label", "Close notification");

  const closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  closeIcon.setAttribute("fill", "none");
  closeIcon.setAttribute("viewBox", "0 0 14 14");
  closeIcon.classList.add("w-3.5", "h-3.5");

  const closePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  closePath.setAttribute("d", "m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6");
  closePath.setAttribute("stroke", "currentColor");
  closePath.setAttribute("stroke-linecap", "round");
  closePath.setAttribute("stroke-linejoin", "round");
  closePath.setAttribute("stroke-width", "2");

  closeIcon.appendChild(closePath);
  closeButton.appendChild(closeIcon);

  const removeToast = () => {
    toast.style.transform = "translateX(120%)";
    setTimeout(() => toast.remove(), 500);
  };

  closeButton.addEventListener("click", removeToast);
  document.addEventListener(
    "keydown",
    function handleKeydown(event) {
      if (event.key === "Escape") {
        removeToast();
        document.removeEventListener("keydown", handleKeydown);
      }
    },
    { once: true }
  );

  toast.appendChild(iconWrapper);
  toast.appendChild(text);
  toast.appendChild(closeButton);
  main.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(-210px)";
    closeButton.focus();
  }, 50);

  setTimeout(removeToast, duration);
}
