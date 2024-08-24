export default function (isValuesValid) {
  for (const key in isValuesValid) {
    if (Object.hasOwnProperty.call(isValuesValid, key)) {
      const value = isValuesValid[key];

      if (value === false) {
        return { status: false, name: key };
      }
    }
  }

  return { status: true };
}
