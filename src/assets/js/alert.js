export default function (title, message, icon) {
  document.dispatchEvent(
    new CustomEvent("app:alert", {
      detail: {
        title: title,
        icon: icon,
        message: message
      }
    })
  );
}
