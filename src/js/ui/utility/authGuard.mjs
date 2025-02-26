/**
 * Restricts access to authenticated users only.
 * If no authentication token is found in session storage, an alert is displayed,
 * and the user is redirected to the login page.
 */
export function authGuard() {
  if (!sessionStorage.token) {
    sessionStorage.setItem("restricted", "true");

    window.location.href = "/auth/index.html";
  }
}
