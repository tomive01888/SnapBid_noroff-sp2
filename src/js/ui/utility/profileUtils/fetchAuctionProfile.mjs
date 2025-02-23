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
 * @function fetchAuctionProfileInfo
 * @returns {Object | undefined} The auction profile information if the request is successful, otherwise `undefined`.
 * @throws {Error} If the API request fails, an error is logged to the console.
 */
export async function fetchAuctionProfileInfo(name, token) {
  try {
    const auctionUser = await handleApiRequest(
      `${AUCTION_PROFILES_ENDPOINT}/${name}`,
      optionGetAuctionInformation(token)
    );

    if (auctionUser?.data) {
      const { credits, ...user } = auctionUser.data;

      sessionStorage.setItem("SnapBid-Credits", credits);
      sessionStorage.setItem("SnapBid-User", JSON.stringify(user));
    }

    return auctionUser;
  } catch (error) {
    console.error("Failed to fetch auction profile:", error);
  }
}
