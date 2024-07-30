export default function ($route, values) {
  for (const key in $route.query) {
    if (Object.hasOwnProperty.call($route.query, key)) {
      const data = $route.query[key];

      values[key] = data;
    }
  }
}
