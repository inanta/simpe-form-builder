export default function (app, feature) {
  if (typeof app.features !== "undefined") {
    return app.features.includes(feature);
  }

  return false;
}
