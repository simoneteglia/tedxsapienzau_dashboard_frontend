import React, { useState } from "react";

export default function DisableVolunteerModal({ volunteer, onConfirm, onCancel }) {
  const [confirmationText, setConfirmationText] = useState("");
  const expected = (volunteer?.nome || "").toLowerCase();

  const handleConfirm = () => {
    if (confirmationText.trim().toLowerCase() === expected && expected) {
      onConfirm();
    } else {
      alert("Il nome inserito non corrisponde.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Elimina volontario</h2>
        <p className="mb-2">
          Per confermare l'eliminazione di <strong>{volunteer.nome}</strong>, scrivi il suo nome:
        </p>
        <input
          type="text"
          className="w-full border rounded p-2 mb-4"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="Inserisci il nome"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancella
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}