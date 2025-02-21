import { createAuctionForm } from "../../component/createListingForm.mjs";
import { fetchAndDisplayOwnBids } from "./fetch&DisplayUserBids.mjs";
import { fetchAndDisplayOwnListings } from "./fetch&DisplayUserListings.mjs";
import { fetchAndDisplayOwnWins } from "./fetch&DisplayUserWins.mjs";

/**
 * Sets up the auction view by handling radio button selections and updating the content container accordingly.
 *
 * @param {HTMLElement} contentContainer - The container where the selected auction view will be displayed.
 *
 * Functionality:
 * - Listens for changes in radio button selection.
 * - Clears the content container before updating it with the selected view.
 * - Provides four views:
 *   - "create": Displays the auction listing form.
 *   - "myListings": Displays the user's created listings.
 *   - "myBids": Displays the user's bids.
 *   - "myWins": Displays the user's won auctions.
 * - Defaults to "myListings" on initial load.
 */
export function setupAuctionView() {
  const radios = document.querySelectorAll('input[name="auctionView"]');

  const functionsMap = {
    create: () => {
      createAuctionForm();
    },
    myListings: () => {
      fetchAndDisplayOwnListings();
    },
    myBids: () => {
      fetchAndDisplayOwnBids();
    },
    myWins: () => {
      fetchAndDisplayOwnWins();
    },
  };

  function handleRadioChange(event) {
    const selectedValue = event.target.value;
    functionsMap[selectedValue]();
  }

  radios.forEach((radio) => {
    radio.addEventListener("change", handleRadioChange);
  });

  const defaultRadio = document.querySelector('input[value="myListings"]');
  if (defaultRadio) {
    defaultRadio.checked = true;
    functionsMap["myListings"]();
  }
}
