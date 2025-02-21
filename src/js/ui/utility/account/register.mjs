import { handleApiRequest } from "../../../api/apiRequestHandler.mjs";
import { optionRegisterAndLogin } from "../../../api/apiRequestOptions.mjs";
import { REGISTER_ENDPOINT } from "../../../api/constants.mjs";
import { showModalRegisterSuccess } from "../../component/openModalRegisterSuccess.mjs";
import { showToastMessage } from "../../toastMessages/showToastMessage.mjs";

/**
 * Handles user registration by validating input fields, displaying error messages if necessary,
 * and sending the registration request to the API.
 *
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} Resolves when the registration process is complete.
 *
 * Validates:
 * - Name: Required, only letters, numbers, and underscores allowed.
 * - Email: Required, must be a valid `noroff.no` or `stud.noroff.no` email.
 * - Password: Required, minimum length of 8 characters.
 *
 * On success:
 * - Prompts the user to continue to login.
 * - Reloads the page if the user confirms.
 *
 * On failure:
 * - Displays appropriate error messages.
 * - Logs the error to the console.
 */
export async function onRegister(event) {
  event.preventDefault();

  document.querySelectorAll(".error-message").forEach((errorElement) => {
    errorElement.classList.add("hidden");
  });

  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";

  const name = event.target.name.value.trim();
  const email = event.target.email.value.trim();
  const password = event.target.password.value.trim();

  let valid = true;

  const nameError = document.getElementById("nameError");
  if (!name) {
    nameError.textContent = "Name is required!";
    nameError.classList.remove("hidden");
    valid = false;
  } else if (!/^[\w]+$/.test(name)) {
    nameError.textContent = "Invalid username. Only letters, numbers and the underscore (_) are permitted.";
    nameError.classList.remove("hidden");
    valid = false;
  }

  const emailError = document.getElementById("emailError");
  if (!email) {
    emailError.textContent = "Email is required!";
    emailError.classList.remove("hidden");
    valid = false;
  } else if (!/^[\w\-.]+@(stud\.)?noroff\.no$/.test(email)) {
    emailError.textContent = "Please enter a valid email address (noroff.no or stud.noroff.no).";
    emailError.classList.remove("hidden");
    valid = false;
  }

  const passwordError = document.getElementById("passwordError");
  if (!password) {
    passwordError.textContent = "Password  is required!";
    passwordError.classList.remove("hidden");
    valid = false;
  } else if (password.length < 8) {
    passwordError.classList.remove("hidden");

    passwordError.textContent = "Password must be at least 8 characters long.";
    valid = false;
  }

  if (!valid) {
    return;
  }

  const requestBody = {
    name: name,
    email: email,
    password: password,
  };

  try {
    const data = await handleApiRequest(REGISTER_ENDPOINT, optionRegisterAndLogin(requestBody));

    if (!data) {
      throw new Error("Sorry for the inconvenience, couldn't registering new user.");
    }

    showModalRegisterSuccess(data.data.name);
  } catch (error) {
    console.error("Registration failed:", error);

    showToastMessage(error.message, "error");
    setTimeout(() => {
      sessionStorage.removeItem("toastMessage");
    }, 4000);
  }
}
