import React, { useState } from "react";
import global from "../../global";
import "../../assets/styles/login.css";
import Logo from "../../assets/images/Logo_colorato.svg";
import ClipLoader from "react-spinners/ClipLoader"; // spinner

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${global.CONNECTION.ENDPOINT}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("is_admin", data.is_admin ? "true" : "false");

        window.location.href = "/";
      } else {
        console.log("Login failed:", data.message);
        alert(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-placeholder">
          <img src={Logo} alt="Logo" style={{ width: "250px" }} />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ backgroundColor: "white", color: "black" }}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ backgroundColor: "white", color: "black" }}
            disabled={loading}
          />

          {loading ? (
            <button
              type="button"
              disabled
              style={{
                background: "#f0f0f0",
                border: "1px solid #ccc",
                cursor: "not-allowed",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333", // keep default button text color
              }}
            >
              <ClipLoader size={18} color="#333" />
              <span className="loading-text">Caricamento...</span>
            </button>
          ) : (
            <button type="submit">Login</button>
          )}

          <p style={{ marginTop: "10px", fontSize: "14px", color: "#cc0000" }}>
            {loading
              ? "Stiamo svegliando il server, dacci un attimo"
              : "⚠️ Attenzione: il login potrebbe richiedere fino a 1 minuto."}
          </p>
        </form>
      </div>
    </div>
  );
}
