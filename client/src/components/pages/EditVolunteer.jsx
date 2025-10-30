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
        const token = localStorage.getItem("access_token");
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
        const newToken = response.headers.get("X-New-Token");
        const data = await response.json();

        if (newToken) {
      localStorage.setItem("access_token", newToken);
    } else if (data.new_access_token) {
      localStorage.setItem("access_token", data.new_access_token);
    }
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
      const token = localStorage.getItem("access_token");
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
      const newToken = response.headers.get("X-New-Token");
        const result = await response.json();

        if (newToken) {
      localStorage.setItem("access_token", newToken);
    } else if (data.new_access_token) {
      localStorage.setItem("access_token", data.new_access_token);
    }
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
            name="name"
            value={volunteer.name || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Cognome:
          <input
            type="text"
            name="surname"
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
          <select
            name="team"
            value={volunteer.team || ""}
            onChange={handleChange}
          >
            <option value="">Seleziona</option>
            <option value="BOARD">BOARD</option>
            <option value="PEM">PEM</option>
            <option value="IT">IT</option>
            <option value="SEC">SEC</option>
            <option value="ERS">ERS</option>
            <option value="CEM">CEM</option>
            <option value="LA">LA</option>
            <option value="HRA">HRA</option>
            <option value="DEX">DEX</option>
          </select>
        </label>
        <label>
          Status:
          <select
            name="status"
            value={volunteer.status || ""}
            onChange={handleChange}
          >
            <option value="">Seleziona</option>
            <option value="Supporter">Supporter</option>
            <option value="Socio">Socio Ordinario</option>
          </select>
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
          <select
            name="academic_status"
            value={volunteer.academic_status || ""}
            onChange={handleChange}
          >
            <option value="">Seleziona</option>
            <option value="Studente">Student*</option>
            <option value="Dottorando">Dottorand*</option>
            <option value="Laureato">Laureat*</option>
          </select>
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
          <select
            name="course_type"
            value={volunteer.course_type || ""}
            onChange={handleChange}
          >
            <option value="">Seleziona</option>
            <option value="Laurea Triennale">Triennale</option>
            <option value="Magistrale">Magistrale</option>
            <option value="Laurea Ciclo Unico">Laurea Ciclo Unico</option>
            <option value="Dottorato">Dottorato</option>
            <option value="Altro">Dottorato</option>
          </select>
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
          Genere:
          <select
            name="tshirt_size"
            value={volunteer.tshirt_size || ""}
            onChange={handleChange}
          >
            <option value="">Seleziona</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
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
