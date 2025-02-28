import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGetAuctionInformation } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_PROFILES_ENDPOINT } from "../../../api/constants.mjs";

const accessToken = sessionStorage.getItem("token");

/**
 * Fetches the user's auction profile information and stores the user's credits in sessionStorage.
 *
 * This function retrieves the user's auction profile data using the `name` from sessionStorage,
 * and stores the `credits` from the profile in sessionStorage under the key `SnapBid-Credits`.
 * If no user is found in sessionStorage, it logs an error.
 *
 * @async
 * @function fetchAuctionProfileCredits
 * @returns {Object | undefined} The auction profile information if the request is successful, otherwise `undefined`.
 * @throws {Error} If the API request fails, an error is logged to the console.
 */
export async function fetchAuctionProfileCredits(name, token) {
  if (!name || !token) return;

  try {
    const auctionUser = await handleApiRequest(
      `${AUCTION_PROFILES_ENDPOINT}/${name}`,
      optionGetAuctionInformation(token)
    );

    const { credits } = auctionUser.data;

    if (credits) {
      sessionStorage.setItem("SnapBid-Credits", credits);
    }
  } catch (error) {
    console.error("Failed to fetch auction profile:", error);
  }
}

export async function initializeAuctionProfile() {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("SnapBid-User"));
  const name = user?.name;

  if (!name || !token) return;

  await fetchAuctionProfileCredits(name, token);
}
