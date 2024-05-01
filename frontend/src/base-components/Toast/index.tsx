import Toastify from "toastify-js";
function showToast(messageSelector: string) {
  const messageEl = document.querySelector(messageSelector) as HTMLElement;
  if (messageEl) {
    const clonedEl = messageEl.cloneNode(true) as HTMLElement;
    clonedEl.classList.remove("hidden");
    Toastify({
      node: clonedEl,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();
  }
}

export default showToast;
