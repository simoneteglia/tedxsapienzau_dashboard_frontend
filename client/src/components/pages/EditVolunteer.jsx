import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/styles/landing.css";
import global from "../../global.json";

export default function VolunteerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState({});
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchVolunteer = async () => {
      console.log("Fetching volunteer with id:", id);
      try {
        const response = await fetch(
          `${global.CONNECTION.ENDPOINT}/volunteer?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.volunteer) {
          setVolunteer(data.volunteer);
        } else {
          console.error("Volunteer not found");
        }
      } catch (error) {
        console.error("Error fetching volunteer data", error);
      }
    };

    fetchVolunteer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVolunteer({ ...volunteer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    delete volunteer._id;
    console.log(volunteer);
    try {
      const response = await fetch(
        `${global.CONNECTION.ENDPOINT}/volunteer?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(volunteer),
        }
      );
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        alert("Volontario aggiornato con successo!");
        navigate(`/volunteer/${id}`);
      } else {
        console.error(result.error);
        alert("Errore durante l'aggiornamento.");
      }
    } catch (error) {
      console.error("Error updating volunteer", error);
      alert("Errore durante la richiesta.");
    }
  };

  return (
    <div
      className="landing-main-container"
      style={{ padding: "20px", color: "#333" }}
    >
      <h1 className="volunteers-title">Modifica Volontario</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* Campi principali */}
        <label>
          Nome:
          <input
            type="text"
            name="nome"
            value={volunteer.name || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Cognome:
          <input
            type="text"
            name="cognome"
            value={volunteer.surname || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Genere:
          <select
            name="gender"
            value={volunteer.gender || ""}
            onChange={handleChange}
          >
            <option value="">Seleziona</option>
            <option value="M">Maschile</option>
            <option value="F">Femminile</option>
            <option value="Altro">Altro</option>
          </select>
        </label>
        <label>
          Team:
          <input
            type="text"
            name="team"
            value={volunteer.team || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Status:
          <input
            type="text"
            name="status"
            value={volunteer.status || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Subleader:
          <select
            name="subleader"
            value={volunteer.subleader || "NO"}
            onChange={handleChange}
          >
            <option value="SI">Sì</option>
            <option value="NO">No</option>
          </select>
        </label>

        {/* Informazioni personali */}
        <label>
          Data di Nascita:
          <input
            type="date"
            name="date_of_birth"
            value={volunteer.date_of_birth || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Luogo di Nascita:
          <input
            type="text"
            name="place_of_birth"
            value={volunteer.place_of_birth || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Codice Fiscale:
          <input
            type="text"
            name="fiscal_code"
            value={volunteer.fiscal_code || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Luogo di Residenza:
          <input
            type="text"
            name="place_of_residence"
            value={volunteer.place_of_residence || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Indirizzo di Domicilio:
          <input
            type="text"
            name="address_of_domicile"
            value={volunteer.address_of_domicile || ""}
            onChange={handleChange}
          />
        </label>

        {/* Informazioni accademiche */}
        <label>
          Iscritto in Sapienza:
          <select
            name="is_enrolled_in_sapienza"
            value={volunteer.is_enrolled_in_sapienza || "NO"}
            onChange={handleChange}
          >
            <option value="SI">Sì</option>
            <option value="NO">No</option>
          </select>
        </label>
        <label>
          Matricola:
          <input
            type="text"
            name="student_id"
            value={volunteer.student_id || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Email Istituzionale:
          <input
            type="email"
            name="institutional_email"
            value={volunteer.institutional_email || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Status Accademico:
          <input
            type="text"
            name="academic_status"
            value={volunteer.academic_status || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Facoltà di Appartenenza:
          <select
            type="text"
            name="faculty_name"
            value={volunteer.faculty_name || ""}
            onChange={handleChange}
          >
            {global.FACULTIES.map((facolta) => (
              <option key={facolta} value={facolta}>
                {facolta}
              </option>
            ))}
          </select>
        </label>
        <label>
          Corso di Laurea:
          <input
            type="text"
            name="degree_name"
            value={volunteer.degree_name || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Tipologia di Corso:
          <input
            type="text"
            name="course_type"
            value={volunteer.course_type || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Anno di Iscrizione:
          <input
            type="number"
            name="enrollment_year"
            value={volunteer.enrollment_year || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Erasmus/Estero:
          <select
            name="erasmus_status"
            value={volunteer.erasmus_status || "NO"}
            onChange={handleChange}
          >
            <option value="SI">Sì</option>
            <option value="NO">No</option>
          </select>
        </label>

        {/* Sezione associazione */}
        <label>
          Associato Esterno:
          <select
            name="is_in_external_association"
            value={volunteer.is_in_external_association || "NO"}
            onChange={handleChange}
          >
            <option value="SI">Sì</option>
            <option value="NO">No</option>
          </select>
        </label>
        <label>
          Nome Associazione:
          <input
            type="text"
            name="external_association_name"
            value={volunteer.external_association_name || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Quando Entrato:
          <input
            type="date"
            name="date_of_joining"
            value={volunteer.date_of_joining || ""}
            onChange={handleChange}
          />
        </label>

        {/* Sezione alimentare e maglia */}
        <label>
          Esigenze Alimentari:
          <input
            type="text"
            name="dietary_requirements"
            value={volunteer.dietary_requirements || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Taglia:
          <input
            type="text"
            name="tshirt_size"
            value={volunteer.tshirt_size || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Maglia Presa:
          <select
            name="has_taken_tshirt"
            value={volunteer.has_taken_tshirt || "NO"}
            onChange={handleChange}
          >
            <option value="SI">Sì</option>
            <option value="NO">No</option>
          </select>
        </label>

        {/* Sezione dimissione */}
        <label>
          Ex Socio:
          <select
            name="is_ex_member"
            value={volunteer.is_ex_member ? "SI" : "NO"}
            onChange={(e) =>
              setVolunteer({
                ...volunteer,
                is_ex_member: e.target.value === "SI",
              })
            }
          >
            <option value="SI">Sì</option>
            <option value="NO">No</option>
          </select>
        </label>
        <label>
          Data Dimissione:
          <input
            type="date"
            name="resignation_date"
            value={volunteer.resignation_date || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Note:
          <textarea
            name="notes"
            value={volunteer.notes || ""}
            onChange={handleChange}
          ></textarea>
        </label>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Salva
        </button>
      </form>
    </div>
  );
}
