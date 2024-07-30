export default function (obj, key, default_value = undefined) {
  let value = key.split(".").reduce(function (o, x) {
    return typeof o === "undefined" || o === null ? undefined : o[x];
  }, obj);

  if (value === undefined && default_value !== undefined) {
    value = default_value;
  }

  return value;
}
