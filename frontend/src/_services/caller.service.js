export async function apiFetch(url, options = {}) {
  const user = localStorage.getItem('user');
  console.log(user);
  if (!user) {
    return console.error("No token");
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "request failed");
  }

  // const data = await response.json();
  return response.json();
}