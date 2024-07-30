export default function (app_object, values, name, value) {
  const app = JSON.parse(JSON.stringify(app_object));

  values[name] = value;

  app.target = Object.freeze({
    name: name,
    value: value
  });

  app.values = values;

  return Object.freeze(app);
}
