import React, { useEffect, useState } from "react";
import axios from "axios";

const List = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [editNoteId, setEditNoteId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [shareUserId, setShareUserId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("https://notes.devlop.tech/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(response.data); // Adjust based on API response
        setError("");
      } catch (err) {
        setError("Failed to load notes. Please try again.");
      }
    };

    fetchNotes();
  }, [token]);

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`https://notes.devlop.tech/api//notes/:${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(notes.filter((note) => note.id !== id)); // Remove the note from the list
    } catch (err) {
      console.error("Error deleting note:", err.response || err.message);
      setError("Failed to delete the note. Please try again.");
    }
  };

  // Update a note
  const updateNote = async (id) => {
    try {
      await axios.put(
        `https://notes.devlop.tech/api/notes/:${id}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNotes(
        notes.map((note) =>
          note.id === id ? { ...note, content: editContent } : note
        )
      );
      setEditNoteId(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating note:", err.response || err.message);
      setError("Failed to update the note. Please try again.");
    }
  };

  // Share a note
  const shareNote = async (id, recipientId) => {
    try {
      await axios.post(
        `https://notes.devlop.tech/api/notes/:${id}/share`,
        { userId: recipientId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`Note shared with user ID: ${recipientId}`);
      setShareUserId(""); // Clear the input field
    } catch (err) {
      console.error("Error sharing note:", err.response || err.message);
      setError("Failed to share the note. Please try again.");
    }
  };

  return (
    <div>
      <h1>Your Notes</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {notes.length > 0 ? (
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.id}</td>
                <td>
                  {editNoteId === note.id ? (
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  ) : (
                    note.content
                  )}
                </td>
                <td>
                  {editNoteId === note.id ? (
                    <button onClick={() => updateNote(note.id)}>Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditNoteId(note.id);
                        setEditContent(note.content);
                      }}
                    >
                      Update
                    </button>
                  )}
                  <button onClick={() => deleteNote(note.id)}>Delete</button>
                  <button
                    onClick={() => {
                      const recipientId = prompt("Enter recipient user ID:");
                      if (recipientId) shareNote(note.id, recipientId);
                    }}
                  >
                    Share
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No notes available.</p>
      )}
    </div>
  );
};

export default List;
