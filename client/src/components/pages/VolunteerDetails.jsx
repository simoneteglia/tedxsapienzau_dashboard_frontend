import { useState, useEffect } from "react";
import "../../assets/styles/landing.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import image from "../../assets/images/user.jpg";
import global from "../../global.json";
import Link from "@mui/material/Link";
import DisableVolunteerModal from "./DisableVolunteer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function VolunteerDetails() {
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const res = await fetch(
          `${global.CONNECTION.ENDPOINT}/volunteer?id=${id}`
        );
        const data = await res.json();
        if (data.volunteer) setVolunteer(data.volunteer);
      } catch (e) {
        console.error("Error fetching volunteer", e);
      }
    };
    fetchVolunteer();
  }, [id]);

  const handleDisable = async () => {
    try {
      const query =
        volunteer?.id != null
          ? `id=${volunteer.id}`
          : `matricola=${volunteer.matricola ?? id}`;

      const res = await fetch(
        `${global.CONNECTION.ENDPOINT}/disable_volunteer?${query}`,
        { method: "PUT" }
      );
      const data = await res.json();

      if (res.ok) {
        setShowModal(false);
        setVolunteer(data.volunteer);
        alert("Volontario eliminato con successo");
      } else {
        alert(`Errore: ${data.error || data.message}`);
      }
    } catch (e) {
      console.error(e);
      alert("Errore durante l'eliminazione");
    }
  };

  return (
    <div
      className="landing-main-container"
      style={{ padding: "0px 20px 10px 20px", color: "#333" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {/* back arrow on the far left */}
        <button
          onClick={() => navigate("/volunteers")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#333",
            fontSize: "18px",
          }}
        >
          <ArrowBackIcon style={{ fontSize: "28px" }} />
        </button>

        {/* centered title */}
        <h1
          className="volunteers-title"
          style={{ flex: 1, textAlign: "center", margin: 0 }}
        >
          Dettagli Volontario
        </h1>

        {/* empty spacer on the right so title stays centered */}
        <div style={{ width: "40px" }}></div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src={image}
            alt="Volunteer"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              border: "2px solid #ddd",
            }}
          />
        </div>

        <div style={{ flex: 2, padding: "20px" }}>
          <h2 style={{ margin: "0" }}>
            {volunteer.nome} {volunteer.cognome}
            {volunteer.subleader === "Si" && (
              <label
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  fontSize: "18px",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  marginLeft: "20px",
                }}
              >
                Subleader
              </label>
            )}
          </h2>
          <p>
            <strong>Team:</strong> {volunteer.team || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {volunteer.status || "N/A"}
          </p>
        </div>

        <div style={{ flex: 1, padding: "20px" }}>
          {volunteer.ex_socio === "Si" && (
            <div
              style={{
                backgroundColor: "rgba(246, 71,71, 0.8)",
                borderRadius: "8px",
                fontSize: "18px",
                padding: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <strong>Ex Socio:</strong> {volunteer.ex_socio || "N/A"}
              </p>
              <p>
                <strong>Data Dimissione:</strong>{" "}
                {volunteer.data_dimissione || "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>
      <hr />
      <h3
        style={{
          color: "#eb0028",
        }}
      >
        Informazioni Personali
      </h3>
      <p>
        <strong>Genere:</strong> {volunteer.genere || "N/A"}
      </p>
      <p>
        <strong>Telefono:</strong> {volunteer.telefono || "N/A"}
      </p>
      <p>
        <strong>Email Personale:</strong> {volunteer.email_personale || "N/A"}
      </p>
      <p>
        <strong>Data di Nascita:</strong> {volunteer.data_di_nascita || "N/A"}
      </p>
      <p>
        <strong>Luogo di Nascita:</strong> {volunteer.luogo_di_nascita || "N/A"}
      </p>
      <p>
        <strong>Codice Fiscale:</strong> {volunteer.codice_fiscale || "N/A"}
      </p>
      <p>
        <strong>Luogo di Residenza:</strong>{" "}
        {volunteer.luogo_di_residenza || "N/A"}
      </p>
      <p>
        <strong>Indirizzo di Domicilio:</strong>{" "}
        {volunteer.indirizzo_di_domicilio || "N/A"}
      </p>
      <hr />
      <h3
        style={{
          color: "#eb0028",
        }}
      >
        Informazioni Accademiche
      </h3>
      <p>
        <strong>Sei iscritto in Sapienza?</strong>{" "}
        {volunteer.iscritto_in_sapienza || "N/A"}
      </p>
      <p>
        <strong>Matricola:</strong> {volunteer.matricola || "N/A"}
      </p>
      <p>
        <strong>Email Istituzionale:</strong>{" "}
        {volunteer.email_istituzionale || "N/A"}
      </p>
      <p>
        <strong>Status Accademico:</strong>{" "}
        {volunteer.status_accademico || "N/A"}
      </p>

      <p>
        <strong>Facoltà di Appartenenza:</strong>{" "}
        {volunteer.facolta_di_appartenenza || "N/A"}
      </p>
      <p>
        <strong>Dipartimento:</strong> {volunteer.dipartimento || "N/A"}
      </p>
      <p>
        <strong>Tipologia:</strong> {volunteer.tipologia || "N/A"}
      </p>

      <p>
        <strong>Corso:</strong> {volunteer.corso_di_laurea || "N/A"}
      </p>

      <p>
        <strong>Anno di Iscrizione:</strong>{" "}
        {volunteer.anno_di_iscrizione || "N/A"}
      </p>
      <p>
        <strong>Erasmus/Estero:</strong> {volunteer.erasmus_o_estero || "N/A"}
      </p>
      <hr />
      <h3
        style={{
          color: "#eb0028",
        }}
      >
        Associazioni
      </h3>
      <p>
        <strong>Associazione Esterna:</strong>{" "}
        {volunteer.associazione_esterna || "N/A"}
      </p>
      <p>
        <strong>Nome Associazione:</strong>{" "}
        {volunteer.nome_associazione || "N/A"}
      </p>
      <p>
        <strong>Data di Ingresso in Associazione:</strong>{" "}
        {volunteer.data_ingresso_associazione || "N/A"}
      </p>
      <hr />
      <h3
        style={{
          color: "#eb0028",
        }}
      >
        Preferenze ed Extra
      </h3>
      <p>
        <strong>Esigenze Alimentari:</strong>{" "}
        {volunteer.esigenze_alimentari || "N/A"}
      </p>
      <p>
        <strong>Taglia T-Shirt:</strong> {volunteer.taglia_tshirt || "N/A"}
      </p>
      <p>
        <strong>T-Shirt Presa?</strong> {volunteer.tshirt_presa || "N/A"}
      </p>
      <hr />
      <h3
        style={{
          color: "#eb0028",
        }}
      >
        Documenti
      </h3>
      <p>
        <strong>Documenti Socio:</strong>{" "}
        {volunteer.documenti_socio ? (
          <a
            href={volunteer.documenti_socio}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Visualizza documento
          </a>
        ) : (
          "N/A"
        )}
      </p>

      <p>
        <strong>Tipo di Documento:</strong>{" "}
        {volunteer.tipo_di_documento || "N/A"}
      </p>
      <p>
        <strong>Numero del Documento:</strong>{" "}
        {volunteer.numero_del_documento || "N/A"}
      </p>
      <p>
        <strong>Scadenza Documento:</strong>{" "}
        {volunteer.scadenza_documento || "N/A"}
      </p>
      <hr />
      <h3
        style={{
          color: "#eb0028",
        }}
      >
        Note
      </h3>
      <p>
        <strong>Note:</strong> {volunteer.note || " "}
      </p>

      {(volunteer.ex_socio === true || volunteer.ex_socio === "Si") && (
        <div
          style={{
            backgroundColor: "rgba(246, 71,71, 0.8)",
            borderRadius: "8px",
            fontSize: "18px",
            padding: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <p>
            <strong>Ex Socio:</strong>{" "}
            {volunteer.ex_socio === true ? "Si" : volunteer.ex_socio || "N/A"}
          </p>
          <p>
            <strong>Data Dimissione:</strong>{" "}
            {volunteer.data_dimissione || "N/A"}
          </p>
        </div>
      )}

      <hr />

      <button
        style={{
          backgroundColor: "#FFA500",
          color: "white",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
          marginRight: 8,
        }}
        onClick={() => navigate(`/volunteer/edit/${id}`)}
      >
        Modifica
      </button>

      <button
        style={{
          backgroundColor: "#ff0000ff",
          color: "white",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => setShowModal(true)}
      >
        Elimina
      </button>

      {showModal && (
        <DisableVolunteerModal
          volunteer={volunteer}
          onConfirm={handleDisable}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
