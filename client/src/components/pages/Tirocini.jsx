import React, { useState, useEffect } from "react";

import { Autocomplete, TextField } from "@mui/material";

import plusCircle from "../../assets/images/plus-circle.svg";
import "../../assets/styles/landing.css";
import "../../assets/styles/tirocini.css";
import "../../index.css";
import global from "../../global.json";

export default function Tirocini() {
  const [withTirocinio, setWithTirocinio] = useState([]);
  const [isAdding, setIsAdding] = useState(true);
  const [names, setNames] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");

  useEffect(() => {
    console.log(selectedVolunteer);
  }, [selectedVolunteer]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      const response = await fetch(`${global.CONNECTION.ENDPOINT}/volunteers`);
      const data = await response.json();
      try {
        if (data.volunteers && data.volunteers.length > 0) {
          const namesList = data.volunteers.map((v) => ({
            id: v.matricola,
            name: v.nome,
            surname: v.cognome,
          }));
          setNames(namesList);

          const selected = data.volunteers.filter(
            (v) =>
              v.tirocinio_status === "In corso" ||
              v.tirocinio_status === "Completato"
          );
          setWithTirocinio(selected);
        } else {
          console.log("No volunteers found");
        }
      } catch (error) {
        console.error("Error fetching volunteers", error);
      }
    };

    fetchVolunteers();
  }, []);

  const ElementList = ({ name, surname, status, id }) => {
    console.log(name, status);
    return (
      <li
        key={id}
        className="element-list-item-tirocini"
        style={{
          backgroundColor: status === "In corso" ? "#96c4597b" : "#e9493a7d",
        }}
      >
        <p>
          {name} {surname}
        </p>
      </li>
    );
  };

  return (
    <div className="landing-main-container" style={{ display: "flex" }}>
      <section
        style={{
          width: isAdding ? "60%" : "100%",
          borderRight: isAdding ? "1px solid #ccc" : "none",
          paddingRight: "20px",
          height: "100%",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ position: "relative" }}>
          <h1 className="volunteers-title">Tirocini</h1>
          <p
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: "10px",
            }}
            onClick={() => setIsAdding(!isAdding)}
          >
            <img
              src={plusCircle}
              style={{ color: "black" }}
              alt="Add Volunteer"
            />
            Aggiungi Tirocinio
          </p>
        </div>
        <div className="volunteers-list">
          {withTirocinio.length === 0 && (
            <p>Nessun tirocinio in corso o completato</p>
          )}
          <h2 style={{ color: "black", marginBottom: "10px" }}>In corso</h2>
          {withTirocinio.map((volunteer) => {
            if (volunteer.tirocinio_status === "In corso") {
              return (
                <ElementList
                  key={volunteer.id}
                  status={volunteer.tirocinio_status}
                  name={volunteer.nome}
                  surname={volunteer.cognome}
                  id={volunteer.id}
                />
              );
            }
          })}
          <h2
            style={{ color: "black", marginBottom: "10px", marginTop: "20px" }}
          >
            Completati
          </h2>
          {withTirocinio.map((volunteer) => {
            if (volunteer.tirocinio_status === "Completato") {
              return (
                <ElementList
                  key={volunteer.id}
                  status={volunteer.tirocinio_status}
                  name={volunteer.nome}
                  surname={volunteer.cognome}
                  id={volunteer.id}
                />
              );
            }
          })}
        </div>
      </section>
      <section
        id="add-volunteer-section"
        style={{
          width: isAdding ? "40%" : "0%",
          paddingLeft: "20px",
          height: "95%",
          margin: "auto",
          marginLeft: isAdding ? "20px" : "0px",
          borderRadius: "20px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          backgroundColor: "#f0efefff",
          opacity: isAdding ? 1 : 0,
        }}
      >
        <h2 style={{ color: "black", marginBottom: "10px" }}>
          Aggiungi Tirocinante
        </h2>
        <Autocomplete
          freeSolo
          options={names.map((n) => `${n.name} ${n.surname}`)}
          value={selectedVolunteer}
          onChange={(event, newValue) => setSelectedVolunteer(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleziona o scrivi un volontario"
              variant="outlined"
              fullWidth
              onChange={(e) => setSelectedVolunteer(e.target.value)}
            />
          )}
          style={{ marginTop: "10px", width: "90%" }}
        />
      </section>
    </div>
  );
}
