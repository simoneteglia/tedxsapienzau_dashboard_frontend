// src/auth.js
export async function getAccessToken() {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (accessToken) {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    const exp = payload.exp * 1000;
    if (Date.now() > exp) {
      if (!refreshToken) return null;
      const newToken = await refreshAccessToken(refreshToken);
      if (newToken) {
        localStorage.setItem("access_token", newToken);
        return newToken;
      } else {
        return null;
      }
    }
    return accessToken;
  }
  return null;
}

export async function refreshAccessToken(refreshToken) {
  try {
    const res = await fetch(`${global.CONNECTION.ENDPOINT}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error("Refresh error:", err);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}
