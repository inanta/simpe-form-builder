const identifiers = {};

export default function (identifier, fn, delay = 500) {
  if (typeof identifiers[identifier] !== "undefined") {
    clearTimeout(identifiers[identifier]);
  }

  identifiers[identifier] = setTimeout(fn, delay);
}
