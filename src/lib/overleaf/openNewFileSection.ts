export default function openNewFileSection(onClose: () => void) {
  const body = document.querySelector(".modal-new-file--body")
  body.classList.add("hidden")

  const newBody = document.createElement("td")
  newBody.classList.add("modal-new-file--body")
  newBody.innerHTML = `<div class="better-bibtex-new-file"></div>`
  body.parentElement.appendChild(newBody)

  const listButtons = document.querySelectorAll(".modal-new-file--list button")
  const revert = () => {
    // If we modify the body directly, Overleaf will crash
    // when trying to go back to another page
    newBody.remove()
    body.classList.remove("hidden")

    onClose()

    listButtons.forEach((button) => {
      button.removeEventListener("click", revert)
    })
  }

  listButtons.forEach((button) => {
    button.addEventListener("click", revert)
  })

  document
    .querySelector(".modal-new-file--list .active")
    .classList.remove("active")
}
