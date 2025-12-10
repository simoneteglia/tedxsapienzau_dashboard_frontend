import { useState, useEffect } from "react";
import "../../assets/styles/landing.css";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
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
  const token = localStorage.getItem("access_token");
  const { isAdmin } = useOutletContext() || { isAdmin: false };

  useEffect(() => {
    const fetchVolunteer = async () => {
      console.log("Fetching volunteer with id:", id);
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${global.CONNECTION.ENDPOINT}/volunteer?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text(); // <- log raw response
      // console.log("Status:", res.status);
      // console.log("Raw response:", text);

      try {
        const data = JSON.parse(text);
        if (data.volunteer) setVolunteer(data.volunteer);
      } catch (err) {
        console.error("Failed to parse JSON", err);
      }
    };
    fetchVolunteer();
  }, [id]);

  const handleDisable = async () => {
    try {
      const query =
        volunteer?.id != null
          ? `id=${volunteer.id}`
          : `student_id=${volunteer.student_id ?? id}`;

      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${global.CONNECTION.ENDPOINT}/disable_volunteer?${query}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newToken = res.headers.get("X-New-Token");
      const data = await res.json();

      if (newToken) {
        localStorage.setItem("access_token", newToken);
      } else if (data.new_access_token) {
        localStorage.setItem("access_token", data.new_access_token);
      }

      if (res.status === 401) {
        console.warn("Session expired. Logging out...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return;
      }

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
    <>
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
              {volunteer.name} {volunteer.surname}
              {volunteer.subleader === "SI" ||
                (volunteer.subleader === "Si" && (
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
                ))}
            </h2>
            <p>
              <strong>Team:</strong> {volunteer.team || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {volunteer.status || "N/A"}
            </p>
            <p>
              <strong>Tessera associativa pagata:</strong>{" "}
              {volunteer.membership_card_paid || "N/A"}
            </p>
          </div>

          <div style={{ flex: 1, padding: "20px" }}>
            {volunteer.is_ex_member === "Si" && (
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
                  <strong>Ex Socio:</strong> {volunteer.is_ex_member || "N/A"}
                </p>
                <p>
                  <strong>Data Dimissione:</strong>{" "}
                  {volunteer.resignation_date || "N/A"}
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
          <strong>Genere:</strong> {volunteer.gender || "N/A"}
        </p>
        <p>
          <strong>Telefono:</strong> {volunteer.phone_number || "N/A"}
        </p>
        <p>
          <strong>Email Personale:</strong> {volunteer.personal_email || "N/A"}
        </p>
        <p>
          <strong>Data di Nascita:</strong> {volunteer.date_of_birth || "N/A"}
        </p>
        <p>
          <strong>Luogo di Nascita:</strong> {volunteer.place_of_birth || "N/A"}
        </p>
        <p>
          <strong>Codice Fiscale:</strong> {volunteer.fiscal_code || "N/A"}
        </p>
        <p>
          <strong>Luogo di Residenza:</strong>{" "}
          {volunteer.place_of_residence || "N/A"}
        </p>
        <p>
          <strong>Indirizzo di Domicilio:</strong>{" "}
          {volunteer.address_of_domicile || "N/A"}
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
          {volunteer.is_enrolled_in_sapienza || "N/A"}
        </p>
        <p>
          <strong>Matricola:</strong> {volunteer.student_id || "N/A"}
        </p>
        <p>
          <strong>Email Istituzionale:</strong>{" "}
          {volunteer.institutional_email || "N/A"}
        </p>
        <p>
          <strong>Status Accademico:</strong>{" "}
          {volunteer.academic_status || "N/A"}
        </p>

        <p>
          <strong>Facoltà di Appartenenza:</strong>{" "}
          {volunteer.faculty_name || "N/A"}
        </p>
        <p>
          <strong>Dipartimento:</strong> {volunteer.dipartimento || "N/A"}
        </p>
        <p>
          <strong>Tipologia:</strong> {volunteer.course_type || "N/A"}
        </p>

        <p>
          <strong>Corso:</strong> {volunteer.degree_name || "N/A"}
        </p>

        <p>
          <strong>Anno di Iscrizione:</strong>{" "}
          {volunteer.enrollment_year || "N/A"}
        </p>
        <p>
          <strong>Erasmus/Estero:</strong> {volunteer.erasmus_status || "N/A"}
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
          {volunteer.is_in_external_association || "N/A"}
        </p>
        <p>
          <strong>Nome Associazione:</strong>{" "}
          {volunteer.external_association_name || "N/A"}
        </p>
        <p>
          <strong>Data di Ingresso in Associazione:</strong>{" "}
          {volunteer.joining_year || "N/A"}
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
          {volunteer.dietary_requirements || "N/A"}
        </p>
        <p>
          <strong>Taglia T-Shirt:</strong> {volunteer.tshirt_size || "N/A"}
        </p>
        <p>
          <strong>T-Shirt Presa?</strong> {volunteer.has_taken_tshirt || "N/A"}
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
          {volunteer.id_document_link ? (
            <a
              href={volunteer.id_document_link}
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
          {volunteer.id_document_type || "N/A"}
        </p>
        <p>
          <strong>Numero del Documento:</strong>{" "}
          {volunteer.id_document_number || "N/A"}
        </p>
        <p>
          <strong>Scadenza Documento:</strong>{" "}
          {volunteer.id_document_expiry_date || "N/A"}
        </p>
        <p>
          <strong>Atto di Adesione Associazione:</strong>{" "}
          {volunteer.join_association_document_link ? (
            <a
              href={volunteer.join_association_document_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Visualizza Atto di Adesione
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <hr />
        <h3
          style={{
            color: "#eb0028",
          }}
        >
          Informazioni Tirocinio
        </h3>
        <p>
          <strong>Stato Tirocinio: </strong>{" "}
          {volunteer.traineeship_status === "ongoing"
            ? "In corso"
            : volunteer.traineeship_status === "completed"
            ? "Terminato"
            : "Non effettuato"}
        </p>
        {(volunteer.traineeship_status === "ongoing" ||
          volunteer.traineeship_status === "completed") && (
          <p>
            <strong>Data Inizio: </strong> {volunteer.start_date || "N/A"}
          </p>
        )}

        {volunteer.traineeship_status === "completed" && (
          <p>
            <strong>Data Fine: </strong> {volunteer.completed_date || "N/A"}
          </p>
        )}
        <hr />
        <h3
          style={{
            color: "#eb0028",
          }}
        >
          Note
        </h3>
        <p>
          <strong>Note:</strong> {volunteer.notes || " "}
        </p>

        {(volunteer.is_ex_member === true ||
          volunteer.is_ex_member === "Si") && (
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
              {volunteer.is_ex_member === true
                ? "Si"
                : volunteer.is_ex_member || "N/A"}
            </p>
            <p>
              <strong>Data Dimissione:</strong>{" "}
              {volunteer.resignation_date || "N/A"}
            </p>
          </div>
        )}

        <hr />

        {isAdmin && (
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
        )}

        <button
          style={{
            backgroundColor: "#1E90FF", // different color to distinguish
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: 8,
          }}
          onClick={() => window.open(volunteer.id_document_link, "_blank")}
        >
          Documento
        </button>

        {volunteer.is_ex_member !== true && isAdmin && (
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
        )}
      </div>

      {/* ⬇️  render modal *outside* of landing container */}
      {showModal && (
        <DisableVolunteerModal
          volunteer={volunteer}
          onConfirm={handleDisable}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
