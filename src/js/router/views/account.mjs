import { generateNavbar } from "../../ui/globals/navbarAccess.mjs";
import { onLogin } from "../../ui/utility/accountUtils/login.mjs";
import { onRegister } from "../../ui/utility/accountUtils/register.mjs";
import { hamburgerToggle } from "../../ui/globals/hamburgerToggler.mjs";
import { showToastMessage } from "../../ui/toastMessages/showToastMessage.mjs";

generateNavbar();
hamburgerToggle();

const radioButtons = document.querySelectorAll("input[name='authType']");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const errorContainer = document.getElementById("error-container");

radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "login") {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
      registerForm.classList.remove("flex");
      errorContainer.classList.add("hidden");
    } else {
      registerForm.classList.remove("hidden");
      registerForm.classList.add("flex");
      loginForm.classList.add("hidden");
      errorContainer.classList.add("hidden");
    }
  });
});

const formLoginClick = document.forms.loginForm;
formLoginClick.addEventListener("submit", onLogin);

const formRegisterClick = document.forms.registerForm;
formRegisterClick.addEventListener("submit", (event) => {
  onRegister(event);
});

if (sessionStorage.getItem("restricted") === "true") {
  showToastMessage("Accessible for registered users only!", "error");
  sessionStorage.removeItem("restricted");
}
