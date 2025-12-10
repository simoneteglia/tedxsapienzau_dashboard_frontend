import React, { useState, useEffect } from "react";

import { Autocomplete, TextField } from "@mui/material";
import { Box, Button, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { it } from "date-fns/locale";
import { useOutletContext } from "react-router-dom";

import plusCircle from "../../assets/images/plus-circle.svg";
import trashbin from "../../assets/images/trashbin.svg";
import check from "../../assets/images/check_icon.svg";
import global from "../../global.json";

import "../../assets/styles/landing.css";
import "../../assets/styles/tirocini.css";
import "../../index.css";

export default function Tirocini() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [withTirocinio, setWithTirocinio] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [names, setNames] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const token = localStorage.getItem("access_token");
  const { isAdmin } = useOutletContext() || { isAdmin: false };

  useEffect(() => {
    const fetchVolunteers = async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${global.CONNECTION.ENDPOINT}/volunteers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const newToken = response.headers.get("X-New-Token");
      const data = await response.json();

      if (newToken) {
        localStorage.setItem("access_token", newToken);
      } else if (data.new_access_token) {
        localStorage.setItem("access_token", data.new_access_token);
      }

      if (response.status === 401) {
        console.warn("Session expired. Logging out...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return;
      }
      try {
        if (data.volunteers && data.volunteers.length > 0) {
          const namesList = data.volunteers
            .filter(
              (v) =>
                (v.traineeship_status == undefined ||
                  v.traineeship_status == "") &&
                v.is_ex_member !== true
            )
            .map((v) => ({
              id: v.student_id,
              name: v.name,
              surname: v.surname,
              team: v.team,
            }));
          setNames(namesList);

          const selected = data.volunteers.filter(
            (v) =>
              v.traineeship_status === "ongoing" ||
              v.traineeship_status === "completed"
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

  const ElementList = ({
    name,
    surname,
    status,
    student_id,
    start_date,
    completed_date,
  }) => {
    return (
      <li
        key={student_id}
        className="element-list-item-tirocini"
        style={{
          backgroundColor: status === "ongoing" ? "#96c4597b" : "#e9493a7d",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2>
            {name} {surname}
          </h2>
          <p style={{ fontSize: "20px", marginTop: "-20px" }}>
            Data Inizio: {start_date}
          </p>
          {completed_date && (
            <p style={{ fontSize: "20px", marginTop: "-20px" }}>
              Data Fine: {completed_date}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {status === "ongoing" && (
            <img
              src={check}
              style={{
                color: "black",
                maxWidth: "32px",
                cursor: "pointer",
              }}
              alt="Concludi tirocinio"
              onClick={async () => {
                console.log(student_id);

                const volunteer = await fetch(
                  `${global.CONNECTION.ENDPOINT}/volunteer?id=${student_id}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const n = await volunteer.json();
                const vol = n.volunteer;
                delete vol._id;

                vol.traineeship_status = "completed";

                // Solution A: pure date (YYYY-MM-DD) for today's completion date
                const now = new Date();
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, "0");
                const d = String(now.getDate()).padStart(2, "0");
                vol.traineeship_completed_date = `${d}-${m}-${y}`;

                const response = await fetch(
                  `${global.CONNECTION.ENDPOINT}/volunteer?id=${student_id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(vol),
                  }
                );
                if (response.ok) {
                  alert("Tirocinio aggiornato con successo!");
                  window.location.reload();
                } else {
                  alert("Errore nell'aggiornamento del tirocinio.");
                  console.log(response);
                }
              }}
            />
          )}
          <img
            src={trashbin}
            style={{
              color: "black",
              maxWidth: "32px",
              cursor: "pointer",
            }}
            alt="Cancella Tirocinio"
            onClick={async () => {
              console.log(student_id);
              const volunteer = await fetch(
                `${global.CONNECTION.ENDPOINT}/volunteer?id=${student_id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const n = await volunteer.json();
              const vol = n.volunteer;

              delete vol._id;
              vol.traineeship_status = "";
              vol.traineeship_start_date = "";

              const response = await fetch(
                `${global.CONNECTION.ENDPOINT}/volunteer?id=${student_id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(vol),
                }
              );
              if (response.ok) {
                alert("Tirocinio rimosso con successo!");
                window.location.reload();
              } else {
                alert("Errore nella rimozione del tirocinio.");
                console.log(response);
              }
            }}
          />
        </div>
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
          {isAdmin && (
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
          )}
        </div>
        <div className="volunteers-list">
          {withTirocinio.length === 0 && (
            <p>Nessun tirocinio in corso o completato</p>
          )}
          <h2 style={{ color: "black", marginBottom: "10px" }}>In corso</h2>
          {withTirocinio.map((volunteer) => {
            if (volunteer.traineeship_status === "ongoing") {
              return (
                <ElementList
                  key={volunteer.student_id}
                  status={volunteer.traineeship_status}
                  name={volunteer.name}
                  surname={volunteer.surname}
                  student_id={volunteer.student_id}
                  start_date={volunteer.traineeship_start_date}
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
            if (volunteer.traineeship_status === "completed") {
              return (
                <ElementList
                  key={volunteer.student_id}
                  status={volunteer.traineeship_status}
                  name={volunteer.name}
                  surname={volunteer.surname}
                  student_id={volunteer.student_id}
                  start_date={volunteer.traineeship_start_date}
                  completed_date={volunteer.traineeship_completed_date}
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
          options={names}
          value={names.find((n) => n.id === selectedVolunteer) ?? null}
          onChange={(_, option) =>
            setSelectedVolunteer(option ? option.id : "")
          }
          getOptionLabel={(option) => `${option.name} ${option.surname}`}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          loading={names.length === 0}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleziona volontario"
              placeholder="Cerca per nome o cognome"
              fullWidth
            />
          )}
          sx={{ mt: 2, mr: 2 }}
        />

        {selectedVolunteer && (
          <div style={{ marginTop: "20px" }}>
            <h3>Dettagli Volontario</h3>
            <p>
              <strong>Matricola:</strong> {selectedVolunteer}
            </p>
            <p>
              <strong>Nome:</strong>{" "}
              {names.find((n) => n.id === selectedVolunteer)?.name}
            </p>
            <p>
              <strong>Cognome:</strong>{" "}
              {names.find((n) => n.id === selectedVolunteer)?.surname}
            </p>
            <p>
              <strong>Team:</strong>{" "}
              {names.find((n) => n.id === selectedVolunteer)?.team}
            </p>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={it}
            >
              <Box sx={{ my: 2, maxWidth: 320 }}>
                <DatePicker
                  label="Data inizio tirocinio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: "Verrà salvata come GG-MM-AAAA",
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>

            <br />
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={async () => {
                const volunteer = await fetch(
                  `${global.CONNECTION.ENDPOINT}/volunteer?id=${selectedVolunteer}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const n = await volunteer.json();
                const vol = n.volunteer;
                vol.traineeship_status = "ongoing";

                if (startDate instanceof Date && !isNaN(startDate)) {
                  const y = startDate.getFullYear();
                  const m = String(startDate.getMonth() + 1).padStart(2, "0");
                  const d = String(startDate.getDate()).padStart(2, "0");
                  vol.traineeship_start_date = `${d}-${m}-${y}`;
                }

                delete vol._id;
                console.log(vol);
                console.log(vol.student_id);

                const response = await fetch(
                  `${global.CONNECTION.ENDPOINT}/volunteer?id=${vol.student_id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(vol),
                  }
                );
                if (response.ok) {
                  alert("Tirocinio aggiunto con successo!");
                  window.location.reload();
                } else {
                  alert("Errore nell'aggiunta del tirocinio.");
                  console.log(response);
                }
              }}
            >
              Conferma Tirocinio
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
