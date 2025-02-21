import { API_KEY } from "./constants.mjs";

/**
 * Configuration options for GET requests.
 * @type {object}
 */
export const optionGet = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

/**
 * Configuration options for user registration/login (POST).
 * @param {object} data - User registration/login data.
 * @returns {object} POST request options.
 */
export const optionRegisterAndLogin = (data) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

/**
 * Configuration options for fetching auction information (GET) with authentication.
 * @param {string} token - User's authentication token.
 * @returns {object} GET request options with headers for authentication.
 */
export const optionGetAuctionInformation = (token) => ({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  },
});

/**
 * Configuration options for posting data (POST) with authentication.
 * @param {object} data - Data to be sent in the request body.
 * @param {string} token - User's authentication token.
 * @returns {object} POST request options with headers for authentication.
 */
export const optionPost = (data, token) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  },
  body: JSON.stringify(data),
});

/**
 * Configuration options for editing an auction listing (PUT).
 * @param {object} data - Data to update the auction listing.
 * @param {string} token - User's authentication token.
 * @returns {object} PUT request options with headers for authentication.
 */
export const optionEditListing = (data, token) => ({
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  },
  body: JSON.stringify(data),
});

/**
 * Configuration options for deleting an auction listing (DELETE).
 * @param {string} token - User's authentication token.
 * @returns {object} DELETE request options with headers for authentication.
 */
export const optionDeleteListing = (token) => ({
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  },
});

/**
 * Configuration options for editing an auction listing (PUT).
 * @param {object} data - Data containing media URL to update the profile avatar.
 * @param {string} token - User's authentication token.
 * @returns {object} PUT request options with headers for authentication.
 */
export const optionProfileAvatar = (data, token) => ({
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  },
  body: JSON.stringify(data),
});
