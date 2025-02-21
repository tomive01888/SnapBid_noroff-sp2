alert("You went to far");

/*
export function clearMainAndDisplayError() {
  const mainElement = document.querySelector("main");

  mainElement.innerHTML = "";

  const notFoundContainer = document.createElement("div");
  notFoundContainer.id = "not-found-container";
  notFoundContainer.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-screen",
    "bg-red-100",
    "text-red-700",
    "font-sans",
    "text-center"
  );

  const title = document.createElement("h1");
  title.textContent = "Oops... something went wrong! (404)";
  title.classList.add("text-2xl", "font-bold");
  notFoundContainer.appendChild(title);

  const paragraph = document.createElement("p");
  paragraph.textContent =
    "You entered an incorrect URL or tried to access an invalid page. Check the URL and try again, or click below to go home.";
  paragraph.classList.add("text-lg", "my-5");
  notFoundContainer.appendChild(paragraph);

  const homeButton = document.createElement("button");
  homeButton.textContent = "Take me home";
  homeButton.classList.add(
    "bg-green-500",
    "text-white",
    "py-2",
    "px-5",
    "text-lg",
    "rounded",
    "cursor-pointer",
    "transition-colors",
    "hover:bg-green-600"
  );
  homeButton.addEventListener("click", () => {
    window.location.href = "/";
  });
  notFoundContainer.appendChild(homeButton);

  const errorImage = document.createElement("img");
  errorImage.src = "/path/to/your/image.jpg";
  errorImage.alt = "Error Image";
  errorImage.classList.add("w-80", "mt-10");
  notFoundContainer.appendChild(errorImage);

  mainElement.appendChild(notFoundContainer);
}
*/
