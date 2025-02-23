import { showToastMessage } from "../toastMessages/showToastMessage.mjs";

/**
 * Restricts access to authenticated users only.
 * If no authentication token is found in session storage, an alert is displayed,
 * and the user is redirected to the login page.
 */
export function authGuard() {
  if (!sessionStorage.token) {
    showToastMessage("Access restricted, only registered user can access this page", "error");

    window.location.href = "/auth/index.html";
  }
}
