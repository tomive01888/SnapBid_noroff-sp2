/**
 * Redirects the user to the home page (`"/"`) and sets a session storage flag
 * indicating a failure state.
 *
 * Side Effects:
 * - Sets `sessionStorage["pageFailure"]` to `"true"`.
 * - Redirects the browser to the root path (`"/"`).
 *
 * @function returnHome
 * @returns {void} Nothing is returned; the function performs side effects.
 */
function returnHome() {
  sessionStorage.setItem("pageFailure", "true");
  window.location.href = "/";
}
