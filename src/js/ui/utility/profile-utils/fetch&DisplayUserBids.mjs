import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionGetAuctionInformation } from "../../../api/apiRequestOptions.mjs";
import { AUCTION_LISTING_ENDPOINT, getAuctionEndpoints } from "../../../api/constants.mjs";
import { generateAuctionCards } from "../../component/listingCardCreator.mjs";
import { getHighestBidValue } from "../getHighestBidHandler.mjs";

/**
 * Fetches and displays the user's highest bids from active listings.
 * Filters listings to only include those where the user has placed the highest bid.
 * Retrieves detailed information for each filtered listing and displays auction cards.
 *
 * @returns {Promise<void>} - No return value. Updates the DOM with the user's highest bids.
 */
export async function fetchAndDisplayOwnBids() {
  const userData = JSON.parse(sessionStorage.getItem("SnapBid-User"));
  const token = sessionStorage.getItem("token");
  const singleEndpoint = getAuctionEndpoints();

  try {
    const req = await handleApiRequest(singleEndpoint.AUCTION_SINGLE_BIDS, optionGetAuctionInformation(token));

    const now = new Date();
    const activeListings = req.data.filter((listing) => new Date(listing.listing.endsAt) > now);

    const userHighestBids = new Map();

    activeListings.forEach((bid) => {
      const listingId = bid.listing.id;
      const bidAmount = bid.amount;

      if (!userHighestBids.has(listingId) || userHighestBids.get(listingId).amount < bidAmount) {
        userHighestBids.set(listingId, bid);
      }
    });

    const filteredListings = Array.from(userHighestBids.values());

    const bidsPromises = filteredListings.map((listing) =>
      handleApiRequest(
        `${AUCTION_LISTING_ENDPOINT}/${listing.listing.id}?_bids=true&_seller=true`,
        optionGetAuctionInformation(token)
      )
    );

    const bidsData = await Promise.all(bidsPromises);

    const biddingResults = bidsData.map((listing, index) => {
      const highestBid = getHighestBidValue(listing.data);
      const userIsLeading = highestBid.highestBidName === userData.name;

      return {
        ...filteredListings[index],
        leading: userIsLeading,
        bids: listing.data.bids || [],
        seller: {
          name: listing.data.seller.name || "",
        },
        media: listing.data.media || [],
        tags: listing.data.tags || [],
        _count: listing.data._count,
        endsAt: listing.data.endsAt,
        title: listing.data.title,
      };
    });

    generateAuctionCards(biddingResults, "biddings");
  } catch (error) {
    console.error("Error fetching and displaying own listings:", error);
  }
}
