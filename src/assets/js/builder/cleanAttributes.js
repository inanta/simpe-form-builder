export default function cleanAttributes(attributes) {
  let cleaned_attributes = {};
  let allowed_attributes = {
    attributes: false,
    container: true,
    column: true,
    element: true,
    name: false,
    row: true
  };

  for (const key in attributes) {
    if (typeof attributes[key] !== "object" && attributes[key] !== "") {
      if (typeof allowed_attributes[key] !== "undefined") {
        if (allowed_attributes[key]) {
          cleaned_attributes["data-" + key] = attributes[key];
        } else {
          cleaned_attributes[key] = attributes[key];
        }
      }
    } else if (typeof attributes[key] === "object" && key === "attributes") {
      if (Array.isArray(attributes[key].value)) {
        for (let index = 0; index < attributes[key].value.length; index++) {
          const attribute = attributes[key].value[index];

          cleaned_attributes[attribute.label] = attribute.value;
        }
      }
    }
  }

  return cleaned_attributes;
}
