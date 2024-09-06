export default function (attributes, additional_attributes = []) {
  let cleaned_attributes = {};
  let allowed_attributes = {
    attrs: false,
    class: false,
    container: true,
    column: true,
    element: true,
    name: false,
    row: true,
    style: false
  };

  for (let index = 0; index < additional_attributes.length; index++) {
    allowed_attributes[additional_attributes[index]] = false;
  }

  function setAttribute(name, value) {
    if (typeof cleaned_attributes[name] !== "undefined" && name === "class") {
      cleaned_attributes[name] += " " + value;
    } else {
      cleaned_attributes[name] = value;
    }
  }

  for (const key in attributes) {
    if (typeof attributes[key] !== "object" && attributes[key] !== "") {
      if (typeof allowed_attributes[key] !== "undefined") {
        if (allowed_attributes[key]) {
          cleaned_attributes["data-" + key] = attributes[key];
        } else {
          setAttribute(key, attributes[key]);
        }
      }
    } else if (typeof attributes[key] === "object" && key === "attrs") {
      if (Array.isArray(attributes[key].value)) {
        for (let index = 0; index < attributes[key].value.length; index++) {
          setAttribute(
            attributes[key].value[index].label,
            attributes[key].value[index].value
          );
        }
      }
    } else if (typeof attributes[key] === "object" && key === "style") {
      cleaned_attributes[key] = attributes[key];
    }
  }

  return cleaned_attributes;
}
