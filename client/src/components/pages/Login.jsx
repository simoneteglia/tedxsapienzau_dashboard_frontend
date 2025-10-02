import React, { useState } from "react";

import global from "../../global";
import "../../assets/styles/login.css";
import Logo from "../../assets/images/Logo_colorato.svg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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

        window.location.href = "/";
      } else {
        console.log("Login failed:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed");
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ backgroundColor: "white", color: "black" }}
          />
          <button type="submit">Login</button>
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#cc0000" }}>
          ⚠️ Attenzione: il login potrebbe richiedere fino a 1 minuto.
        </p>
        </form>
      </div>
    </div>
  );
}
