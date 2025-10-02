/**
 * Handles an API request with the provided URL and options.
 *
 * Sends an HTTP request using the Fetch API and handles different response scenarios.
 * Returns the response data and metadata if successful, or `null` for DELETE requests.
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {object} options - Fetch options, including method, headers, body, etc.
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE).
 * @param {object} [options.body] - Body data to send, if applicable.
 * @param {object} [options.headers] - Headers to include in the request.
 * @returns {Promise<{data: object, meta: object}> | null} Response data and metadata, or null for DELETE.
 * @throws {Error} Throws an error if the request fails or response is not OK.
 */
export async function handleApiRequest(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.statusCode}: ${errorData.status}. ${errorData.errors[0].message}`);
  }

  if (options.method === "DELETE") {
    return null;
  }

  const { data, meta } = await response.json();
  return { data, meta };
}
