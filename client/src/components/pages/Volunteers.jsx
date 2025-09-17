import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  Grid2,
  Typography,
  TextField,
  Chip,
  Box,
  Button,
} from "@mui/material";
import Link from "@mui/material/Link";

import "../../assets/styles/landing.css";
import "../../index.css";
import global from "../../global.json";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showExSocio, setShowExSocio] = useState(false);

  const teamNames = [
    "BOARD",
    "IT",
    "CEM",
    "ERS",
    "LA",
    "HRA",
    "PEM",
    "DEX",
    "SEC",
  ];

  const teamColors = {
    BOARD: "#fff",
    IT: "#f07e2a",
    CEM: "#e9493a",
    ERS: "#f089b7",
    LA: "#21bcef",
    HRA: "#2884c7",
    PEM: "#bb5c9e",
    DEX: "#fab732",
    SEC: "#95c459",
  };

  useEffect(() => {
    const fetchVolunteers = async () => {
      const response = await fetch(`${global.CONNECTION.ENDPOINT}/volunteers`);
      const data = await response.json();
      try {
        if (data.volunteers && data.volunteers.length > 0) {
          data.volunteers.sort((a, b) => {
            if (a.team === "BOARD" && b.team !== "BOARD") return -1;
            if (a.team !== "BOARD" && b.team === "BOARD") return 1;
            return 0;
          });

          setVolunteers(data.volunteers);
          const active = data.volunteers.filter(
            (v) => v.ex_socio !== true && v.ex_socio !== "Si"
          );
          setFilteredVolunteers(active);
        } else {
          console.log("No volunteers found");
        }
      } catch (error) {
        console.error("Error fetching volunteers", error);
      }
    };

    fetchVolunteers();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterVolunteers(value, selectedTeam, showExSocio);
  };

  const handleChipClick = (team) => {
    const newTeam = team === selectedTeam ? "" : team;
    setSelectedTeam(newTeam);
    filterVolunteers(searchTerm, newTeam, showExSocio);
  };

  const handleToggleExSocio = () => {
    const newValue = !showExSocio;
    setShowExSocio(newValue);
    filterVolunteers(searchTerm, selectedTeam, newValue);
  };

  const filterVolunteers = (search, team, includeExSocio) => {
    let filtered = volunteers;

    if (!includeExSocio) {
      filtered = filtered.filter(
        (v) => v.ex_socio !== true && v.ex_socio !== "Si"
      );
    }

    filtered = filtered.filter((volunteer) =>
      `${volunteer.nome} ${volunteer.cognome}`.toLowerCase().includes(search)
    );

    if (team) {
      filtered = filtered.filter((volunteer) => volunteer.team === team);
    }

    setFilteredVolunteers(filtered);
  };

  return (
    <div className="landing-main-container">
      <h1 className="volunteers-title">Volontari</h1>
      <h2 style={{ color: "black" }}>
        Numero totale: {filteredVolunteers.length}
      </h2>

      <Button
        variant="contained"
        onClick={handleToggleExSocio}
        sx={{
          marginBottom: 2,
          backgroundColor: showExSocio ? "green" : "red",
          "&:hover": {
            backgroundColor: showExSocio ? "darkgreen" : "darkred",
          },
        }}
      >
        {showExSocio ? "Mostra solo attivi" : "Mostra anche ex soci"}
      </Button>

      {/* Search Bar */}
      <TextField
        label="Cerca Volontari"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px" }}
      />

      {/* Smart Chips */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {teamNames.map((team) => (
          <Chip
            key={team}
            label={team}
            color={selectedTeam === team ? "primary" : "default"}
            onClick={() => handleChipClick(team)}
            clickable
          />
        ))}
      </Box>

      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {filteredVolunteers.map((volunteer, index) => (
          <Grid2 size={{ xs: 2, sm: 3, md: 3 }} key={index}>
            <div className="card-container">
              <Card
                className="board-card"
                style={{
                  background:
                    volunteer.team === "BOARD"
                      ? "linear-gradient(to right, rgba(255, 255, 255, 0.4) 0 100%), url(/gradient-bg3.jpg)"
                      : `radial-gradient(circle at bottom right, ${
                          teamColors[volunteer.team]
                        }30 0%, transparent 50%), url('/noise.png')`,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  height: "150px",
                  borderRadius: "20px",
                  backgroundSize:
                    volunteer.team === "BOARD" ? "160%" : "initial",
                  backgroundPosition:
                    volunteer.team === "BOARD" ? "0% 25%" : "center",
                }}
              >
                <CardContent>
                  <Link
                    variant="h5"
                    href={`/volunteer/${volunteer.matricola}`}
                    style={{
                      textDecoration: "underline",
                      color: "inherit",
                      fontWeight: "bold",
                    }}
                  >
                    {volunteer.nome} {volunteer.cognome}
                  </Link>
                  <Typography color="textSecondary">
                    Team: {volunteer.team || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
}
