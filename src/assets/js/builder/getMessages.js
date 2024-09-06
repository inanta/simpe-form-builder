import getPropertyValue from "@/assets/js/getPropertyValue.js";

export default function (messages, settings) {
  const filtered_messages = {};

  for (const key in messages) {
    if (Object.prototype.hasOwnProperty.call(messages, key)) {
      filtered_messages[key] = getPropertyValue(
        settings,
        "ui.page.messages." + key,
        messages[key]
      );
    }
  }

  return filtered_messages;
}
