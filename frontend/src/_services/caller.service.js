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

    if (response.status === 401 && errorData.message === "Token expired") {
      alert("Votre session a expiré, veuillez vous reconnecter.");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    throw new Error(errorData.message || "request failedee");
  }
  return await response.json();;
}