/**
 * Handles an API request with the provided URL and options.
 *
 * This function sends an HTTP request using the Fetch API and handles different response scenarios.
 * If the request is successful, it returns the response data and metadata. If the request fails,
 * it throws an error with the error details.
 * If the method is DELETE, it returns `null`.
 *
 * @param {string} url - The URL of the API endpoint to send the request to.
 * @param {object} options - The options for the fetch request, including method, headers, body, etc.
 * @param {string} options.method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {object} [options.body] - The body data to be sent with the request, if applicable (e.g., for POST/PUT).
 * @param {object} [options.headers] - The headers to include in the request.
 * @returns {Promise<{data: object, meta: object}> | null} The response data and metadata if successful, or `null` for DELETE requests.
 * @throws {Error} Throws an error if the request fails or if the response is not OK.
 */
export async function handleApiRequest(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.statusCode}: ${errorData.status}. ${errorData.errors[0].message}`);
    }

    if (options.method === "DELETE") {
      return null;
    }

    const { data, meta } = await response.json();

    return { data: data, meta: meta };
  } catch (error) {
    throw error;
  }
}
