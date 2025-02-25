/**
 * Dynamically imports the corresponding view module based on the current pathname.
 *
 * This function is used to load the appropriate page view (module) dynamically based on the
 * URL path. If the path does not match any predefined case, a 404 "notFound" page will be loaded.
 *
 * @param {string} [pathname=window.location.pathname] - The pathname of the current URL. Defaults to `window.location.pathname` if not provided.
 * @returns {Promise<void>} A promise that resolves once the corresponding view module has been imported.
 *
 * @example
 * // Load the homepage view
 * router("/");
 *
 * @example
 * // Load the post page view
 * router("/post/index.html");
 */
export default async function router(pathname = window.location.pathname) {
  switch (true) {
    case pathname === "/":
      await import("./views/home.mjs");
      break;
    case pathname.includes("/auth/"):
      await import("./views/account.mjs");
      break;
    case pathname.includes("/post/create/"):
      await import("./views/postCreate.mjs");
      break;
    case pathname.includes("/post/"):
      await import("./views/post.mjs");
      break;
    case pathname.includes("/profile/listing/"):
      await import("./views/profileListing.mjs");
      break;
    case pathname.includes("/profile/bids/"):
      await import("./views/profileBids.mjs");
      break;
    case pathname.includes("/profile/wins/"):
      await import("./views/profileWins.mjs");
      break;
    default:
      await import("./views/notFound.mjs");
      break;
  }
}
