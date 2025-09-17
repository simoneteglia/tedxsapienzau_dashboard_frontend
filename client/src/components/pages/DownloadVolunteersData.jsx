import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import * as XLSX from "xlsx"; // Excel export
import global from "../../global.json";

export default function DownloadVolunteersData() {
  // define sections and their fields
  const sections = {
    "Informazioni Personali": [
      "nome",
      "cognome",
      "genere",
      "telefono",
      "email_personale",
      "data_di_nascita",
      "luogo_di_nascita",
      "codice_fiscale",
      "luogo_di_residenza",
      "indirizzo_di_domicilio",
    ],
    "Informazioni Accademiche": [
      "iscritto_in_sapienza",
      "matricola",
      "email_istituzionale",
      "status_accademico",
      "facolta_di_appartenenza",
      "dipartimento",
      "tipologia",
      "corso_di_laurea",
      "anno_di_iscrizione",
      "erasmus_o_estero",
    ],
    Associazioni: [
      "associazione_esterna",
      "nome_associazione",
      "data_ingresso_associazione",
    ],
    "Preferenze ed Extra": [
      "esigenze_alimentari",
      "taglia_tshirt",
      "tshirt_presa",
    ],
    Documenti: [
      "documenti_socio",
      "tipo_di_documento",
      "numero_del_documento",
      "scadenza_documento",
    ],
    Note: ["note", "ex_socio", "data_dimissione"],
  };

  const [volunteers, setVolunteers] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [expandedSections, setExpandedSections] = useState(
    Object.keys(sections).reduce((acc, section) => {
      acc[section] = false; // start collapsed
      return acc;
    }, {})
  );
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [fileName, setFileName] = useState("volunteers");
  const [fileType, setFileType] = useState("csv"); // CSV, JSON, TXT, XLSX

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

  useEffect(() => {
    const fetchVolunteers = async () => {
      const response = await fetch(`${global.CONNECTION.ENDPOINT}/volunteers`);
      const data = await response.json();
      try {
        if (data.volunteers && data.volunteers.length > 0) {
          setVolunteers(data.volunteers);
        } else {
          console.log("No volunteers found");
        }
      } catch (error) {
        console.error("Error fetching volunteers", error);
      }
    };

    fetchVolunteers();
  }, []);

  // toggle section expand/collapse
  const toggleExpand = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // toggle all fields in a section
  const toggleSectionFields = (section) => {
    const fields = sections[section];
    const allSelected = fields.every((f) => selectedFields.includes(f));
    if (allSelected) {
      setSelectedFields((prev) => prev.filter((f) => !fields.includes(f)));
    } else {
      setSelectedFields((prev) => [...new Set([...prev, ...fields])]);
    }
  };

  const selectAllSections = () =>
    setSelectedFields(Object.values(sections).flat());
  const deselectAllSections = () => setSelectedFields([]);

  const handleDownload = () => {
    if (!volunteers || volunteers.length === 0) {
      alert("No volunteers to download.");
      return;
    }

    const filtered =
      selectedTeam === "all"
        ? volunteers
        : volunteers.filter((v) => v.team === selectedTeam);

    const data = filtered.map((v) => {
      const obj = {};
      selectedFields.forEach((field) => {
        obj[field] = v[field] || "";
      });
      return obj;
    });

    let content, mimeType, blob;

    if (fileType === "csv") {
      content = Papa.unparse(data);
      mimeType = "text/csv;charset=utf-8;";
      blob = new Blob([content], { type: mimeType });
    } else if (fileType === "json") {
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json;charset=utf-8;";
      blob = new Blob([content], { type: mimeType });
    } else if (fileType === "txt") {
      content = data
        .map((row) =>
          selectedFields.map((field) => `${field}: ${row[field]}`).join("\n")
        )
        .join("\n\n");
      mimeType = "text/plain;charset=utf-8;";
      blob = new Blob([content], { type: mimeType });
    } else if (fileType === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Volunteers");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    }

    const extension = fileType.startsWith(".") ? fileType : `.${fileType}`;
    saveAs(
      blob,
      fileName.endsWith(extension) ? fileName : `${fileName}${extension}`
    );
  };

  return (
    <div
      className="landing-main-container"
      style={{ padding: "20px", color: "#333" }}
    >
      <h1 className="volunteers-title">Download Dati Volontari</h1>

      {/* team filter */}
      <div style={{ margin: "30px 0" }}>
        <label>
          <strong>Team:</strong>{" "}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            style={{ padding: "5px", marginLeft: "8px" }}
          >
            <option value="all">All Teams</option>
            {teamNames.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* sections with collapsible fields */}
      <div style={{ marginTop: "20px" }}>
        {Object.keys(sections).map((section) => {
          const fields = sections[section];
          const allSelected = fields.every((f) => selectedFields.includes(f));

          return (
            <div
              key={section}
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => toggleSectionFields(section)}
                    style={{ marginRight: "8px" }}
                  />
                  <strong>{section}</strong>
                </label>
                <button
                  onClick={() => toggleExpand(section)}
                  style={{
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {expandedSections[section] ? "−" : "+"}
                </button>
              </div>
              {expandedSections[section] && (
                <div
                  style={{
                    marginTop: "10px",
                    paddingLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {fields.map((field) => (
                    <label key={field}>
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field)}
                        onChange={() =>
                          setSelectedFields((prev) =>
                            prev.includes(field)
                              ? prev.filter((f) => f !== field)
                              : [...prev, field]
                          )
                        }
                        style={{ marginRight: "6px" }}
                      />
                      {field}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* select/deselect all */}
      <div style={{ margin: "10px 0 20px 0", display: "flex", gap: "10px" }}>
        <button
          onClick={selectAllSections}
          style={{
            padding: "6px 12px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Select All
        </button>
        <button
          onClick={deselectAllSections}
          style={{
            padding: "6px 12px",
            backgroundColor: "#999",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Deselect All
        </button>
      </div>

      {/* file name + type */}
      <div style={{ margin: "10px 0 40px 0" }}>
        <label>
          File Name:{" "}
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{ padding: "5px", width: "200px", marginRight: "10px" }}
            placeholder="volunteers"
          />
        </label>
        <label>
          File Type:{" "}
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            style={{ padding: "5px", marginLeft: "8px" }}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="txt">TXT</option>
            <option value="xlsx">Excel (XLSX)</option>
          </select>
        </label>
      </div>

      {/* download button */}
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <button
          onClick={handleDownload}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
}
