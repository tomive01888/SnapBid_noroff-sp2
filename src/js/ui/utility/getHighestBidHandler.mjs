/**
 * Determines the highest bid value and bidder's name from a given auction listing.
 *
 * @function getHighestBidValue
 * @param {Object} data - The auction listing data containing bid information.
 * @param {Array<{ amount: number, bidder: { name: string } }>} data.bids - Array of bid objects.
 * @returns {{ highestBid: number, highestBidName: string|null }} - An object containing:
 *   - `highestBid`: The highest bid amount (defaults to 0 if no bids).
 *   - `highestBidName`: The name of the highest bidder (null if no bids).
 *
 * @description
 * - If there are no bids, returns a default object with `highestBid: 0` and `highestBidName: null`.
 * - Uses `reduce` to find the highest bid by comparing bid amounts.
 * - Returns the highest bid amount and the name of the highest bidder.
 */
export function getHighestBidValue(data) {
  if (!data.bids || data.bids.length === 0) {
    return { highestBid: 0, highestBidName: null };
  }

  const highestBid = data.bids.reduce(
    (maxBid, bid) => {
      return bid.amount > maxBid.amount ? bid : maxBid;
    },
    { amount: 0, bidder: { name: null } }
  );

  return { highestBid: highestBid.amount, highestBidName: highestBid.bidder.name };
}
