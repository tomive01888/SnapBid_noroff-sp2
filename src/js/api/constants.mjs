const API_BASE_URL = "https://v2.api.noroff.dev";

export const API_KEY = import.meta.env.VITE_API_KEY;
export const REGISTER_ENDPOINT = `${API_BASE_URL + "/auth/register"}`;
export const LOGIN_ENDPOINT = `${API_BASE_URL + "/auth/login"}`;
export const AUCTION_LISTING_ENDPOINT = `${API_BASE_URL + "/auction/listings"}`;
export const AUCTION_PROFILES_ENDPOINT = `${API_BASE_URL + "/auction/profiles"}`;

/**
 * Generates dynamic API endpoints based on the logged-in user's name.
 * Returns an object containing the user's auction-related API endpoints, or an empty object if no user is found in sessionStorage.
 * @returns {object} - An object containing the user's auction endpoints, or an empty object if no user is found.
 * @example
 * getAuctionEndpoints();
 * // Returns an object with endpoints like:
 * // {
 * //   AUCTION_SINGLE_PROFILE: "https://v2.api.noroff.dev/auction/profiles/johndoe",
 * //   AUCTION_SINGLE_LISTINGS: "https://v2.api.noroff.dev/auction/profiles/johndoe/listings?_seller=true&_bids=true",
 * //   AUCTION_SINGLE_WINS: "https://v2.api.noroff.dev/auction/profiles/johndoe/wins?_seller=true&_bids=true",
 * //   AUCTION_SINGLE_BIDS: "https://v2.api.noroff.dev/auction/profiles/johndoe/bids?_listings=true"
 * // }
 */
export function getAuctionEndpoints() {
  const userName = JSON.parse(sessionStorage.getItem("SnapBid-User"));

  if (userName) {
    return {
      AUCTION_SINGLE_PROFILE: `${AUCTION_PROFILES_ENDPOINT + "/" + userName.name}`,
      AUCTION_SINGLE_LISTINGS: `${
        AUCTION_PROFILES_ENDPOINT + "/" + userName.name + "/listings?_seller=true&_bids=true"
      }`,
      AUCTION_SINGLE_WINS: `${
        AUCTION_PROFILES_ENDPOINT + "/" + userName.name + "/wins?_seller=true&_bids=true&_listings=true"
      }`,
      AUCTION_SINGLE_BIDS: `${AUCTION_PROFILES_ENDPOINT + "/" + userName.name + "/bids?_listings=true&_bids=true"}`,
    };
  } else {
    console.log("No user data available");
    return {};
  }
}
