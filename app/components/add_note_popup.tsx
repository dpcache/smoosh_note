"use client";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";


export type AddNotePopupProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  content?: string;
};


export default function AddNotePopup({
  open,
  onClose,
  title = "Add Note",
  content = "This is a popup triggered by clicking the + card.",
}: AddNotePopupProps) {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!noteTitle || !noteContent) {
      setError("Title and Note are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save note");
      }

      // Optionally clear the form
      setNoteTitle("");
      setNoteContent("");

      // Close the dialog
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <DialogContentText sx={{ mb: 1 }}>{content}</DialogContentText>

        {/* Title input */}
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />

        {/* Note textarea */}
        <TextField
          label="Note"
          variant="outlined"
          fullWidth
          multiline
          minRows={4}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}