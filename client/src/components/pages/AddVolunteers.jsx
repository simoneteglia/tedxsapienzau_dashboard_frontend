import React, { useState, useEffect } from "react";

function AddVolunteers() {
  const [formData, setFormData] = useState({
    id: "",
    team: "",
    status: "",
    subleader: "",
    cognome: "",
    nome: "",
    genere: "",
    ex_socio: "",
    data_dimissione: "",
    note: "",
    telefono: "",
    email_personale: "",
    data_di_nascita: "",
    luogo_di_nascita: "",
    codice_fiscale: "",
    luogo_di_residenza: "",
    indirizzo_di_domicilio: "",
    iscritto_in_sapienza: "",
    matricola: "",
    email_istituzionale: "",
    status_accademico: "",
    facolta_di_appartenenza: "",
    dipartimento: "",
    tipologia: "",
    corso_di_laurea: "",
    anno_di_iscrizione: "",
    erasmus_o_estero: "",
    associazione_esterna: "",
    nome_associazione: "",
    data_ingresso_associazione: "",
    esigenze_alimentari: "",
    taglia_tshirt: "",
    tshirt_presa: "",
    documenti_socio: "",
    tipo_di_documento: "",
    numero_del_documento: "",
    scadenza_documento: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const response = await fetch("http://localhost:5500/volunteers");
        const result = await response.json();
        if (response.ok) {
          const volunteers = result.volunteers;
          const lastId =
            volunteers.length > 0
              ? Math.max(...volunteers.map((v) => v.id))
              : 0;
          setFormData((prevFormData) => ({
            ...prevFormData,
            id: lastId + 1,
          }));
        } else {
          setMessage("Failed to fetch volunteers. Using default id.");
          setFormData((prevFormData) => ({
            ...prevFormData,
            id: 1,
          }));
        }
      } catch (error) {
        setMessage("Error fetching last id. Using default id.");
        setFormData((prevFormData) => ({
          ...prevFormData,
          id: 1,
        }));
      }
    };

    fetchLastId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    // Verifica che i campi obbligatori siano compilati
    const requiredFields = [
      "team",
      "status",
      "subleader",
      "cognome",
      "nome",
      "genere",
      "ex_socio",
      "telefono",
      "email_personale",
      "data_di_nascita",
      "luogo_di_nascita",
      "codice_fiscale",
      "luogo_di_residenza",
      "indirizzo_di_domicilio",
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
      "associazione_esterna",
      "data_ingresso_associazione",
      "esigenze_alimentari",
      "taglia_tshirt",
      "tshirt_presa",
      "documenti_socio",
      "tipo_di_documento",
      "numero_del_documento",
      "scadenza_documento",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        return `Il campo "${labels[field]}" è obbligatorio!`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);  // Mostra il messaggio di errore
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Inserimento avvenuto con successo!");
        setFormData((prevFormData) => ({
          ...Object.keys(prevFormData).reduce((acc, key) => {
            acc[key] = key === "id" ? prevFormData.id + 1 : "";
            return acc;
          }, {}),
        }));
        alert("Inserimento avvenuto con successo!");  // Dialog di successo
      } else {
        setMessage(result.message || "Failed to add volunteer.");
        alert(result.message || "Failed to add volunteer.");  // Messaggio di errore
      }
    } catch (error) {
      setMessage("Error submitting the form. Please try again.");
      alert("Errore nell'invio del form. Riprova.");  // Messaggio di errore
    }
  };

  const labels = {
    id: "ID",
    team: "Team di appartenenza *",
    status: "Status *",
    subleader: "Subleader *",
    cognome: "Cognome *",
    nome: "Nome *",
    genere: "Genere *",
    ex_socio: "Ex socio *",
    data_dimissione: "Data di dimissione",
    note: "Note",
    telefono: "Telefono *",
    email_personale: "Email personale *",
    data_di_nascita: "Data di nascita *",
    luogo_di_nascita: "Luogo di nascita *",
    codice_fiscale: "Codice fiscale *",
    luogo_di_residenza: "Luogo di residenza *",
    indirizzo_di_domicilio: "Indirizzo di domicilio *",
    iscritto_in_sapienza: "Sei iscritto in Sapienza? *",
    matricola: "Matricola *",
    email_istituzionale: "Email istituzionale *",
    status_accademico: "Status accademico *",
    facolta_di_appartenenza: "Facoltà di appartenenza * ",
    dipartimento: "Dipartimento *",
    tipologia: "Tipologia *",
    corso_di_laurea: "Corso *",
    anno_di_iscrizione: "Anno di iscrizione *",
    erasmus_o_estero: "Erasmus o periodo all'estero * ",
    associazione_esterna: "Associazione esterna *",
    nome_associazione: "Nome associazione",
    data_ingresso_associazione: "Data di ingresso in associazione *",
    esigenze_alimentari: "Esigenze alimentari *",
    taglia_tshirt: "Taglia T-Shirt *",
    tshirt_presa: "T-Shirt presa? *",
    documenti_socio: "Documenti socio *",
    tipo_di_documento: "Tipo di documento *",
    numero_del_documento: "Numero del documento *",
    scadenza_documento: "Scadenza documento *",
  };

  const dropdownOptions = {
    team: ["Board", "PEM", "IT", "SEC", "ERS", "CEM", "LA", "HRA", "DEX"],
    status: ["Socio", "Supporter"],
    subleader: ["Si", "No"],
    genere: ["F", "M", "Altro", "Preferisco non specificare"],
    ex_socio: ["Si", "No"],
    iscritto_in_sapienza: ["Si", "No", "Altro"],
    status_accademico: ["Studente", "Laureato", "Dottorando", "Altro"],
    facolta_di_appartenenza: [
      "Architettura",
      "Economia",
      "Farmacia e medicina",
      "Giurisprudenza",
      "Ingegneria civile e industriale",
      "Ingegneria dell'informazione, informatica e statistica",
      "Lettere e filosofia",
      "Medicina e odontoiatria",
      "Medicina e psicologia",
      "Scienze matematiche, fisiche e naturali",
      "Scienze politiche sociologia comunicazione",
      "Scuola di Ingegneria aerospaziale",
    ],
    tipologia: [
      "Laurea Triennale",
      "Laurea agistrale",
      "Laurea Ciclo Unico",
      "Dottorato",
      "Altro",
    ],
    erasmus_o_estero: ["Lo farò", "Non lo farò"],
    associazione_esterna: ["Si", "No"],
    taglia_tshirt: ["XS", "S", "M", "L", "XL", "XXL"],
    tshirt_presa: ["Si", "No"],
    tipo_di_documento: ["Carta d'identità", "Patente", "Passaporto", "Altro"],
  };

  return (
    <div className="landing-main-container" style={{ padding: "20px", color: "#333" }}>
      <h1 className="volunteers-title">Aggiungi Volontario</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2rem",
          backgroundColor: "white",
          color: "black",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {Object.keys(formData).map((key) =>
          dropdownOptions[key] ? (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <label htmlFor={key} style={{ display: "block", fontWeight: "bold" }}>
                {labels[key]}
              </label>
              <select
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <option value="">Seleziona...</option>
                {dropdownOptions[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <label htmlFor={key} style={{ display: "block", fontWeight: "bold" }}>
                {labels[key]}
              </label>
              <input
                type={key === "data_di_nascita" || key === "data_dimissione" || key === "scadenza_documento" ? "date" : "text"}
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  color: "black",
                }}
                disabled={key === "id"}
              />
            </div>
          )
        )}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "limegreen",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddVolunteers;
