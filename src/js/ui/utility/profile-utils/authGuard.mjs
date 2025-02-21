/**
 * Restricts access to authenticated users only.
 * If no authentication token is found in session storage, an alert is displayed,
 * and the user is redirected to the login page.
 */
export function authGuard() {
  if (!sessionStorage.token) {
    alert(
      "Access restricted: You must be logged in to view this page. Registration is required if you don't already have an account."
    );
    window.location.href = "/auth/index.html";
  }
}
