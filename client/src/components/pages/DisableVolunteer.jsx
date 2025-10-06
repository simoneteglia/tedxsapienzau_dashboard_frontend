import React, { useState } from "react";

export default function DisableVolunteerModal({ volunteer, onConfirm, onCancel }) {
  const [confirmationText, setConfirmationText] = useState("");
  const expected = (volunteer?.name || "").toLowerCase();

  const handleConfirm = () => {
    if (confirmationText.trim().toLowerCase() === expected && expected) {
      onConfirm();
    } else {
      alert("Il nome inserito non corrisponde.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onCancel} 
    >
      {/* Modal box */}
      <div
        onClick={(e) => e.stopPropagation()} 
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "24px",
          width: "400px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
          animation: "fadeIn 0.2s ease-in-out",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#d32f2f", marginBottom: "16px" }}>
          Elimina volontario
        </h2>
        <p style={{ marginBottom: "12px", color:"#000"}}>
          Per confermare l'eliminazione di{" "}
          <strong>{volunteer.name}</strong>, scrivi il suo nome:
        </p>

        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="Inserisci il nome"
          style={{
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "8px",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: "#ccc",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancella
          </button>

          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: "#d32f2f",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Elimina
          </button>
        </div>
      </div>

      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}