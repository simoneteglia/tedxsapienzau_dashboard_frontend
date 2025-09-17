import React, { useState, useEffect } from "react";
import "../../assets/styles/landing.css";
import { Bar, Doughnut } from "react-chartjs-2";
import global from "../../global.json";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import VolunteersMap from "../components/VolunteersMap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function Landing() {
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [facultyData, setFacultyData] = useState({});
  const [teamData, setTeamData] = useState({});
  const [degreeData, setDegreeData] = useState({});
  const [matriculationData, setMatriculationData] = useState({});
  const [ageData, setAgeData] = useState({});
  const [isIscrittoData, setIsIscrittoData] = useState({});

  const [genderData, setGenderData] = useState({});
  const [selectedYear, setSelectedYear] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExSocio, setShowExSocio] = useState(false);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch(
          `${global.CONNECTION.ENDPOINT}/volunteers`
        );
        const data = await response.json();

        if (data.volunteers && data.volunteers.length > 0) {
          setAllVolunteers(data.volunteers);

          const years = [
            ...new Set(
              data.volunteers.map((v) =>
                v.data_ingresso_associazione
                  ? v.data_ingresso_associazione.split("-")[0]
                  : "N/A"
              )
            ),
          ].sort();

          setAvailableYears(years);
          setSelectedYear("all");
        } else {
          console.log("No volunteers found");
        }
      } catch (error) {
        console.error("Error fetching volunteers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  useEffect(() => {
    let filteredVolunteers = allVolunteers;

    if (!showExSocio) {
      filteredVolunteers = filteredVolunteers.filter(
        (v) => v.ex_socio !== true && v.ex_socio !== "Si"
      );
    }

    filteredVolunteers = filteredVolunteers.filter((volunteer) => {
      if (selectedYear === "all") return true;
      return (
        parseInt(volunteer.data_ingresso_associazione) >= parseInt(selectedYear)
      );
    });

    const facultyCounts = {};
    const teamCounts = {};
    const degreeCounts = {};
    const matriculationCounts = {};
    const genderCounts = {};
    const ageCounts = {};
    const isIscrittoCounts = {};

    filteredVolunteers.forEach((volunteer) => {
      const faculty = volunteer["facoltà_di_appartenenza"] || "Unknown";
      facultyCounts[faculty] = (facultyCounts[faculty] || 0) + 1;

      const team = volunteer["team"] || "Unknown";
      teamCounts[team] = (teamCounts[team] || 0) + 1;

      const degree = volunteer["tipologia_di_corso"] || "Unknown";
      degreeCounts[degree] = (degreeCounts[degree] || 0) + 1;

      const matriculation = volunteer["anno_di_iscrizione"] || "Unknown";
      matriculationCounts[matriculation] =
        (matriculationCounts[matriculation] || 0) + 1;

      const gender = volunteer["genere"] || "N/A";
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;

      const isIscritto = volunteer["sei_iscritto_in_sapienza?"] || "Unknown";
      isIscrittoCounts[isIscritto] = (isIscrittoCounts[isIscritto] || 0) + 1;

      // compute volunteer age
      if (volunteer["data_di_nascita"]) {
        const birthYear = parseInt(
          volunteer["data_di_nascita"].split("/")[2], //data_di_nascita = DD/MM/YYYY
          10
        );
        if (!isNaN(birthYear)) {
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthYear;

          // age ranges
          let range = "";
          if (age < 20) range = "< 20";
          else if (age <= 23) range = "21-23";
          else if (age <= 26) range = "24-26";
          else if (age <= 30) range = "27-30";
          else range = "30+";

          ageCounts[range] = (ageCounts[range] || 0) + 1;
        } else {
          // if birthYear parsing failed
          ageCounts["Unknown"] = (ageCounts["Unknown"] || 0) + 1;
        }
      } else {
        // if no date provided at all
        ageCounts["Unknown"] = (ageCounts["Unknown"] || 0) + 1;
      }
    });

    setFacultyData(facultyCounts);
    setTeamData(teamCounts);
    setDegreeData(degreeCounts);
    setMatriculationData(matriculationCounts);
    setGenderData(genderCounts);
    setAgeData(ageCounts);
    setIsIscrittoData(isIscrittoCounts);
    console.log(isIscrittoCounts);
  }, [selectedYear, allVolunteers, showExSocio]);

  const generateChartData = (data, label, sortByLabel = false) => {
    const labels = Object.keys(data);
    const counts = Object.values(data);

    const combinedData = labels.map((label, index) => ({
      label,
      count: counts[index],
    }));

    if (sortByLabel) {
      combinedData.sort((a, b) => {
        const numA = parseInt(a.label, 10);
        const numB = parseInt(b.label, 10);

        const isNumA = !isNaN(numA);
        const isNumB = !isNaN(numB);

        if (isNumA && isNumB) return numB - numA; //descendent order
        if (isNumA) return -1;
        if (isNumB) return 1;
        return a.label.localeCompare(b.label);
      });
    } else {
      combinedData.sort((a, b) => b.count - a.count);
    }

    return {
      labels: combinedData.map((d) => d.label),
      datasets: [
        {
          label,
          data: combinedData.map((d) => d.count),
          backgroundColor: [
            "rgba(240, 126, 42, 0.5)",
            "rgba(33, 188, 239, 0.5)",
            "rgba(233, 73, 58, 0.5)",
            "rgba(40, 132, 199, 0.5)",
            "rgba(240, 137, 183, 0.5)",
            "rgba(149, 196, 89, 0.5)",
            "rgba(250, 183, 50, 0.5)",
            "rgba(187, 92, 158, 0.5)",
            "rgba(235, 0, 40, 0.5)",
          ],
          borderColor: [
            "rgba(240, 126, 42, 1)",
            "rgba(33, 188, 239, 1)",
            "rgba(233, 73, 58, 1)",
            "rgba(40, 132, 199, 1)",
            "rgba(240, 137, 183, 1)",
            "rgba(149, 196, 89, 1)",
            "rgba(250, 183, 50, 1)",
            "rgba(187, 92, 158, 1)",
            "rgba(235, 0, 40, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const generateGenderChartData = () => {
    const labels = Object.keys(genderData);
    const data = Object.values(genderData);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "rgba(255, 105, 180, 0.7)", // pink for female
            "rgba(65, 105, 225, 0.7)", // blue for male
            "rgba(221, 160, 221, 0.7)", // purple for not specified
            "rgba(69, 47, 69, 0.7)", // other
          ],
          borderColor: [
            "rgba(255, 105, 180, 1)",
            "rgba(65, 105, 225, 1)",
            "rgba(221, 160, 221, 1)",
            "rgba(69, 47, 69, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => context.label,
        },
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => value,
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index, values) {
            const label = this.getLabelForValue(value);
            return label.length > 15 ? `${label.slice(0, 15)}...` : label;
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const genderChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce(
              (acc, curr) => acc + curr,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const total = context.dataset.data.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  };

  return (
    <div className="landing-main-container">
      <h1 className="volunteers-title">Home</h1>

      <div
        className="filter-section"
        style={{
          width: "80%",
          margin: "20px auto",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <label htmlFor="yearFilter" className="font-medium">
          Mostra volontari per anno:{" "}
        </label>
        <select
          id="yearFilter"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border rounded"
          style={{
            minWidth: "120px",
            backgroundColor: "white",
            borderColor: "#ccc",
            color: "black",
          }}
        >
          <option value="all">All Years</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowExSocio((prev) => !prev)}
          style={{
            padding: "8px 12px",
            borderRadius: "5px",
            backgroundColor: showExSocio ? "#4CAF50" : "#f44336",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {showExSocio ? "Mostra solo attivi" : "Mostra anche ex soci"}
        </button>

        <div className="text-sm text-gray-600" style={{ marginLeft: "20px" }}>
          Totale Volontari:{" "}
          <strong>
            {Object.values(facultyData).reduce((a, b) => a + b, 0)}
          </strong>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div style={{ width: "80%", margin: "20px auto" }}>
            <h2>Iscritti in Sapienza</h2>
            <Bar
              data={{
                ...generateChartData(
                  isIscrittoData,
                  "Numero di volontari iscritti in Sapienza"
                ),
                datasets: [
                  {
                    ...generateChartData(
                      isIscrittoData,
                      "Numero di volontari iscritti in Sapienza"
                    ).datasets[0],
                    backgroundColor: [
                      "rgba(76, 175, 80, 0.7)", // green
                      "rgba(244, 67, 54, 0.7)", // red
                      "grey",
                    ],
                    borderColor: [
                      "rgba(76, 175, 80, 1)",
                      "rgba(244, 67, 54, 1)",
                      "grey",
                    ],
                  },
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                },
              }}
            />
          </div>
          <div style={{ width: "80%", margin: "20px auto" }}>
            <h2>Volontari per Facoltà</h2>
            <Bar
              data={generateChartData(
                facultyData,
                "Numero di volontari per Facoltà"
              )}
              options={{
                indexAxis: "y",
                plugins: {
                  datalabels: {
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                    anchor: "end",
                    align: "right",
                  },
                },
              }}
            />
          </div>
          <div style={{ width: "80%", margin: "20px auto" }}>
            <h2>Volontari per Team</h2>
            <Bar
              data={generateChartData(teamData, "Numero di volontari per Team")}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                },
              }}
            />
          </div>
          <div style={{ width: "80%", margin: "20px auto" }}>
            <h2>Tipologia di Lauree</h2>
            <Bar
              data={generateChartData(
                degreeData,
                "Numero di volontari per Tipologia di Laurea"
              )}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                },
              }}
            />
          </div>
          <div style={{ width: "80%", margin: "20px auto" }}>
            <h2>Anno di Immatricolazione</h2>
            <Bar
              data={generateChartData(
                matriculationData,
                "Numero di volontari per Anno di Immatricolazione",
                true
              )}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                },
              }}
            />
          </div>
          <div style={{ width: "80%", margin: "20px auto" }}>
            <h2>Distribuzione dei sessi</h2>
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <Doughnut
                data={generateGenderChartData()}
                options={genderChartOptions}
              />
            </div>
          </div>
          <div style={{ width: "80%", margin: "20px auto" }}>
            <h2>Volontar* per Eta'</h2>
            <Bar
              data={generateChartData(ageData, "Numero di volontar* per eta'")}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                },
              }}
            />
          </div>
          <div style={{ width: "80%", margin: "20px auto" }}>
            <h2>Luogo di nascita dei volontari</h2>
            <VolunteersMap />
          </div>
        </>
      )}
    </div>
  );
}
