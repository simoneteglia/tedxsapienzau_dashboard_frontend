import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/images/Logo_colorato.svg";
import home from "../../assets/images/home.svg";
import users from "../../assets/images/users.svg";
import plusCircle from "../../assets/images/plus-circle.svg";
import downloadArrow from "../../assets/images/down_arrow.svg";
import work from "../../assets/images/work.svg";
import "../../assets/styles/sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  useEffect(() => {
    const currentUrl = location.pathname;
    const buttons = document.querySelectorAll(".sidebar-button");
    console.log(location);

    buttons.forEach((button) => {
      console.log(button.id, "|", currentUrl.split("/")[1]);
      if (button.id === currentUrl.split("/")[1]) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });
  }, [location]);

  return (
    <nav className="sidebar">
      <img
        style={{
          marginTop: "30px",
          width: "70%",
          marginBottom: "20px",
          justifyContent: "center",
        }}
        src={logo}
      />
      <Link className="sidebar-button selected" to="/" id="home">
        <img src={home} style={{ color: "black" }} alt="Home" />
        Home
      </Link>
      <Link className="sidebar-button" to="/volunteers" id="volunteers">
        <img src={users} style={{ color: "black" }} alt="Volunteers" />
        Volontari
      </Link>
      <Link className="sidebar-button" to="/tirocini" id="tirocini">
        <img
          src={work}
          style={{ color: "black", width: "24px" }}
          alt="Download Dati"
        />
        Tirocini
      </Link>
      <Link className="sidebar-button" to="/add-volunteer" id="add-volunteer">
        <img src={plusCircle} style={{ color: "black" }} alt="Add Volunteer" />
        Aggiungi Volontario
      </Link>
      <Link
        className="sidebar-button"
        to="/download-volunteers-data"
        id="download-volunteers-data"
      >
        <img
          src={downloadArrow}
          style={{ color: "black" }}
          alt="Download Dati"
        />
        Download Dati
      </Link>
    </nav>
  );
}
