export async function apiFetch(url, options = {}) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return console.error("No token");
  }

  const headers = {
    'Authorization': `Bearer ${user.token}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });
  console.log(response);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "request failed");
  }
  return await response.json();;
}