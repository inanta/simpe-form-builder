export default function (path) {
  const url = import.meta.env.VITE_FETCH_BASE_URL + "/" + path;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    return response.json();
  });
}
