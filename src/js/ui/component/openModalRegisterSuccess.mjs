/**
 * Displays a success modal after a user has been successfully registered.
 * The modal informs the user of their successful registration and gives the option to continue to login.
 *
 * @param {string} name - The name of the user who was registered.
 *
 * @example
 * showModalRegisterSuccess('John Doe');
 */
export function showModalRegisterSuccess(name) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50";

  const modalContent = document.createElement("div");
  modalContent.className = "bg-white p-6 rounded-lg w-96 text-center shadow-lg";

  const modalMessage = document.createElement("p");
  modalMessage.className = "text-lg text-gray-700 mb-4";
  modalMessage.textContent = `User, ${name}, was successfully registered. Do you want to continue to login?`;

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "flex justify-around mt-4";

  const cancelButton = document.createElement("button");
  cancelButton.className = "px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  const confirmButton = document.createElement("button");
  confirmButton.className = "px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600";
  confirmButton.textContent = "Confirm";
  confirmButton.addEventListener("click", () => {
    window.location.reload();
  });

  buttonsContainer.appendChild(cancelButton);
  buttonsContainer.appendChild(confirmButton);
  modalContent.appendChild(modalMessage);
  modalContent.appendChild(buttonsContainer);

  modal.appendChild(modalContent);

  document.body.appendChild(modal);
}
