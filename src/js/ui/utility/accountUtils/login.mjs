import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionRegisterAndLogin } from "../../../api/apiRequestOptions.mjs";
import { LOGIN_ENDPOINT } from "../../../api/constants.mjs";
import { showToastMessage } from "../../toastMessages/showToastMessage.mjs";
import { fetchAuctionProfileCredits } from "../profileUtils/fetchAuctionProfile.mjs";

/**
 * Handles user login by validating input, sending a login request to the API, and storing the returned token and user data.
 *
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} Resolves when the login process is complete.
 *
 * Process:
 * - Collects email and password input from the form.
 * - Sends a login request to the API using the provided credentials.
 * - If successful:
 *   - Stores the access token in `sessionStorage`.
 *   - Stores the user data (excluding the token) in `sessionStorage`.
 *   - Stores the username and welcome message for later use. Using toast message from homepage.
 *   - Redirects the user to the homepage.
 * - If the login fails:
 *   - Displays an error message in the UI.
 *   - Logs the error to the console.
 */
export async function onLogin(event) {
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;

  const bodyRequest = {
    email: email,
    password: password,
  };

  try {
    const data = await handleApiRequest(LOGIN_ENDPOINT, optionRegisterAndLogin(bodyRequest));

    const { accessToken, ...userData } = data.data;
    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("SnapBid-User", JSON.stringify(userData));
    sessionStorage.setItem("logging-in", `Welcome ${userData.name} to SnapBid!`);

    await fetchAuctionProfileCredits(data.data.name, data.data.accessToken);

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  } catch (error) {
    showToastMessage(error.message, "error");
    setTimeout(() => {
      sessionStorage.removeItem("logging-in");
    }, 4000);
  }
}
