import React, { useState, useEffect } from "react";
const token = localStorage.getItem("access_token");

import global from "../../global.json";

function AddVolunteers() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    team: "",
    membership_card_paid: "SI",
    status: "",
    subleader: "",
    gender: "",
    phone_number: "",
    personal_email: "",
    date_of_birth: "",
    place_of_birth: "",
    fiscal_code: "",
    place_of_residence: "",
    address_of_domicile: "",
    is_enrolled_in_sapienza: "",
    student_id: "",
    institutional_email: "",
    academic_status: "",
    faculty_name: "",
    dipartimento: "",
    course_type: "",
    degree_name: "",
    enrollment_year: "",
    erasmus_status: "",
    is_in_external_association: "",
    external_association_name: "",
    joining_year: 2025,
    dietary_requirements: "",
    tshirt_size: "",
    has_taken_tshirt: "",
    id_document_link: "",
    id_document_type: "",
    id_document_number: "",
    id_document_expiry_date: "",
    notes: "",
  });

  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   const fetchLastId = async () => {
  //     try {
  //       const token = localStorage.getItem("access_token");
  //       const response = await fetch(
  //         `${global.CONNECTION.ENDPOINT}/volunteers/by_year?year=all`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const newToken = response.headers.get("X-New-Token");
  //       const result = await response.json();

  //       if (response.status === 401) {
  //         console.warn("Session expired. Logging out...");
  //         localStorage.removeItem("access_token");
  //         localStorage.removeItem("refresh_token");
  //         window.location.href = "/login";
  //         return;
  //       }
  //       if (response.ok) {
  //         const volunteers = result.all_volunteers;
  //         const lastId =
  //           volunteers.length > 0
  //             ? Math.max(...volunteers.map((v) => v.id))
  //             : 0;

  //         console.log("Last volunteer ID fetched:", lastId);
  //         setFormData((prevFormData) => ({
  //           ...prevFormData,
  //           id: lastId + 1,
  //         }));
  //       } else {
  //         setMessage("Failed to fetch volunteers. Using default id.");
  //         setFormData((prevFormData) => ({
  //           ...prevFormData,
  //           id: 1,
  //         }));
  //       }

  //       if (newToken) {
  //         localStorage.setItem("access_token", newToken);
  //       } else if (data.new_access_token) {
  //         localStorage.setItem("access_token", data.new_access_token);
  //       }
  //     } catch (error) {
  //       setMessage("Error fetching last id. Using default id.");
  //       setFormData((prevFormData) => ({
  //         ...prevFormData,
  //         id: 1,
  //       }));
  //     }
  //   };

  //   fetchLastId();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "student_id" ? Number(value) : value,
    });
  };

  const validateForm = () => {
    // Verifica che i campi obbligatori siano compilati
    const requiredFields = [
      "team",
      "status",
      "subleader",
      "surname",
      "name",
      "gender",
      "phone_number",
      "personal_email",
      "date_of_birth",
      "place_of_birth",
      "fiscal_code",
      "place_of_residence",
      "address_of_domicile",
      "is_enrolled_in_sapienza",
      "student_id",
      "institutional_email",
      "academic_status",
      "faculty_name",
      "dipartimento",
      "course_type",
      "degree_name",
      "enrollment_year",
      "erasmus_status",
      "is_in_external_association",
      "joining_year",
      "dietary_requirements",
      "tshirt_size",
      "has_taken_tshirt",
      "id_document_link",
      "id_document_type",
      "id_document_number",
      "id_document_expiry_date",
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
      alert(errorMessage); // Mostra il messaggio di errore
      return;
    }

    const payload = {
      ...formData,
      student_id: Number(formData.student_id),
      membership_card_paid: "SI",
    };

    console.log("Submitting form data:", payload);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${global.CONNECTION.ENDPOINT}/volunteer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const newToken = response.headers.get("X-New-Token");
      const result = await response.json();

      // if (newToken) {
      //   localStorage.setItem("access_token", newToken);
      // } else if (data.new_access_token) {
      //   localStorage.setItem("access_token", data.new_access_token);
      // }

      if (response.status === 401) {
        console.warn("Session expired. Logging out...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return;
      }
      if (response.ok) {
        setMessage("Inserimento avvenuto con successo!");
        alert("Inserimento avvenuto con successo!"); // Dialog di successo
        window.location.href = "/volunteers"; // Reindirizza alla pagina dei volontari
      } else {
        setMessage(result.message || "Failed to add volunteer.");
        alert(result.message || "Failed to add volunteer."); // Messaggio di errore
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Error submitting the form. Please try again.");
      alert("Errore nell'invio del form. Riprova."); // Messaggio di errore
    }
  };

  const labels = {
    team: "Team di appartenenza *",
    status: "Status *",
    subleader: "Subleader *",
    surname: "Cognome *",
    name: "Nome *",
    membership_card_paid: "Tessera Socio Pagata",
    gender: "Genere *",
    is_ex_member: "Ex socio *",
    resignation_date: "Data di dimissione",
    notes: "Note",
    phone_number: "Telefono *",
    personal_email: "Email personale *",
    date_of_birth: "Data di nascita *",
    place_of_birth: "Luogo di nascita *",
    fiscal_code: "Codice fiscale *",
    place_of_residence: "Luogo di residenza *",
    address_of_domicile: "Indirizzo di domicilio *",
    is_enrolled_in_sapienza: "Sei iscritto in Sapienza? *",
    student_id: "Matricola *",
    institutional_email: "Email istituzionale *",
    academic_status: "Status accademico *",
    faculty_name: "Facoltà di appartenenza * ",
    dipartimento: "Dipartimento *",
    course_type: "Tipologia corso *",
    degree_name: "Nome del corso *",
    enrollment_year: "Anno di iscrizione in Sapienza (es: 2022) *",
    erasmus_status: "Erasmus o periodo all'estero * ",
    is_in_external_association: "Associazione esterna *",
    external_association_name: "Nome associazione",
    joining_year: "Anno di ingresso in associazione (es: 2025) *",
    dietary_requirements: "Esigenze alimentari *",
    tshirt_size: "Taglia T-Shirt *",
    has_taken_tshirt: "T-Shirt presa? *",
    id_document_link: "Link Documenti Socio *",
    id_document_type: "Tipo di documento *",
    id_document_number: "Numero del documento *",
    id_document_expiry_date: "Scadenza documento *",
  };

  const dropdownOptions = {
    team: ["BOARD", "PEM", "IT", "SEC", "ERS", "CEM", "LA", "HRA", "DEX"],
    status: ["Socio", "Supporter"],
    subleader: ["Si", "No"],
    gender: ["F", "M", "Non Binario", "Preferisco non specificare"],
    is_ex_member: ["Si", "No"],
    is_enrolled_in_sapienza: ["SI", "NO", "Altro"],
    academic_status: ["Studente", "Laureato", "Dottorando", "Altro"],
    faculty_name: global.FACULTIES,
    course_type: [
      "Laurea Triennale",
      "Laurea Magistrale",
      "Laurea Ciclo Unico",
      "Dottorato",
      "Altro",
    ],
    erasmus_status: ["Lo farò", "Non lo farò", "L'ho già fatto"],
    is_in_external_association: ["Si", "No"],
    tshirt_size: ["XS", "S", "M", "L", "XL", "XXL"],
    has_taken_tshirt: ["Si", "No"],
    id_document_type: ["Carta d'identità", "Patente", "Passaporto", "Altro"],
    dietary_requirements: [
      "Nessuna",
      "Vegano",
      "Vegetariano",
      "Senza glutine",
      "No Lattosio",
      "No Frutta Secca",
      "No Arachidi",
      "Allergia al Pesce",
      "Altro",
    ],
  };

  return (
    <div
      className="landing-main-container"
      style={{ padding: "20px", color: "#333" }}
    >
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
              <label
                htmlFor={key}
                style={{ display: "block", fontWeight: "bold" }}
              >
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
              <label
                htmlFor={key}
                style={{ display: "block", fontWeight: "bold" }}
              >
                {labels[key]}
              </label>
              <input
                type={
                  key === "date_of_birth" || key === "id_document_expiry_date"
                    ? "date"
                    : key === "student_id"
                    ? "number"
                    : "text"
                }
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
