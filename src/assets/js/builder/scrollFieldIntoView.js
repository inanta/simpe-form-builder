export default function (fields, name) {
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];

    if (
      typeof field.properties.name !== "undefined" &&
      name === field.properties.name
    ) {
      field.$el.scrollIntoView({ behavior: "smooth", block: "center" });

      break;
    }
  }
}
