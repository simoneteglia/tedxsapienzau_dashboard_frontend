import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/styles/landing.css";
import global from "../../global.json";

export default function VolunteerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState({});
  

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const response = await fetch(
          `${global.CONNECTION.ENDPOINT}/volunteer?id=${id}`
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
          headers: { "Content-Type": "application/json" },
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
            value={volunteer.nome || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Cognome:
          <input
            type="text"
            name="cognome"
            value={volunteer.cognome || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Genere:
          <select
            name="genere"
            value={volunteer.genere || ""}
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
            name="data_di_nascita"
            value={volunteer.data_di_nascita || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Luogo di Nascita:
          <input
            type="text"
            name="luogo_di_nascita"
            value={volunteer.luogo_di_nascita || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Codice Fiscale:
          <input
            type="text"
            name="codice_fiscale"
            value={volunteer.codice_fiscale || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Luogo di Residenza:
          <input
            type="text"
            name="luogo_di_residenza"
            value={volunteer.luogo_di_residenza || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Indirizzo di Domicilio:
          <input
            type="text"
            name="indirizzo_di_domicilio"
            value={volunteer.indirizzo_di_domicilio || ""}
            onChange={handleChange}
          />
        </label>

        {/* Informazioni accademiche */}
        <label>
          Iscritto in Sapienza:
          <select
            name="iscritto_in_sapienza"
            value={volunteer.iscritto_in_sapienza || "NO"}
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
            name="matricola"
            value={volunteer.matricola || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Email Istituzionale:
          <input
            type="email"
            name="email_istituzionale"
            value={volunteer.email_istituzionale || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Status Accademico:
          <input
            type="text"
            name="status_accademico"
            value={volunteer.status_accademico || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Facoltà di Appartenenza:
          <input
            type="text"
            name="facolta_di_appartenenza"
            value={volunteer.facolta_di_appartenenza || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Corso di Laurea:
          <input
            type="text"
            name="corso_di_laurea"
            value={volunteer.corso_di_laurea || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Tipologia di Corso:
          <input
            type="text"
            name="tipologia_di_corso"
            value={volunteer.tipologia_di_corso || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Anno di Iscrizione:
          <input
            type="number"
            name="anno_di_iscrizione"
            value={volunteer.anno_di_iscrizione || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Erasmus/Estero:
          <select
            name="erasmus_o_estero"
            value={volunteer.erasmus_o_estero || "NO"}
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
            name="associazione_esterna"
            value={volunteer.associazione_esterna || "NO"}
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
            name="nome_associazione"
            value={volunteer.nome_associazione || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Quando Entrato:
          <input
            type="date"
            name="quando_entrato"
            value={volunteer.quando_entrato || ""}
            onChange={handleChange}
          />
        </label>

        {/* Sezione alimentare e maglia */}
        <label>
          Esigenze Alimentari:
          <input
            type="text"
            name="esigenze_alimentari"
            value={volunteer.esigenze_alimentari || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Taglia:
          <input
            type="text"
            name="taglia"
            value={volunteer.taglia || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Maglia Presa:
          <select
            name="maglia_presa"
            value={volunteer.maglia_presa || "NO"}
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
    name="ex_socio"
    value={volunteer.ex_socio ? "SI" : "NO"}
    onChange={(e) =>
      setVolunteer({
        ...volunteer,
        ex_socio: e.target.value === "SI",
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
            name="data_dimissione"
            value={volunteer.data_dimissione || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Note:
          <textarea
            name="note"
            value={volunteer.note || ""}
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
