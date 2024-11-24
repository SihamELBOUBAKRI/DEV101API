import React, { useEffect, useState } from "react";
import axios from "axios";

const List = ({ token }) => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        console.log("Token being sent:", token); 
        const response = await axios.get("https://notes.devlop.tech/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from props
          },
        });
        setNotes(response.data); // Assuming response.data contains an array of notes
        setError("");
      } catch (err) {
        setError("Failed to load notes. Please try again.");
      }
    };

    fetchNotes();
  }, [token]);

  return (
    <div>
      <h1>Your Notes</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {notes.length > 0 ? (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>{note.content}</li>
          ))}
        </ul>
      ) : (
        <p>No notes available.</p>
      )}
    </div>
  );
};

export default List;
