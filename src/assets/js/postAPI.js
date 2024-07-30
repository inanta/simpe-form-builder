export default function (path, data) {
  const url = import.meta.env.VITE_FETCH_BASE_URL + "/" + path;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    return response.json();
  });
}
