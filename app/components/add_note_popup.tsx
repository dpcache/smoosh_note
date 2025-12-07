"use client";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  TextField,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Note } from "../interfaces/note_model";

export type AddNotePopupProps = {
  open: boolean;
  onClose: () => void;
  note?: Note;
};

export default function AddNotePopup({ open, onClose, note }: AddNotePopupProps) {
  const [noteTitle, setNoteTitle] = useState(note?.title || "");
  const [noteContent, setNoteContent] = useState(note?.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW: Track runtime-created note ID so POST happens only once
  const [createdNoteId, setCreatedNoteId] = useState<number | null>(null);

  const prevTitleRef = useRef("");
  const prevContentRef = useRef("");

  useEffect(() => {
    if (open) {
      setNoteTitle(note?.title || "");
      setNoteContent(note?.content || "");
      setError(null);

      prevTitleRef.current = note?.title || "";
      prevContentRef.current = note?.content || "";

      // Reset created runtime id
      setCreatedNoteId(null);
    }
  }, [open, note]);

  const handleSave = async () => {
    if (!noteTitle && !noteContent) return;

    setLoading(true);
    setError(null);

    try {
      const isEditingOriginal = !!note?.id;
      const isEditingCreated = createdNoteId !== null;

      const method =
        isEditingOriginal || isEditingCreated ? "PUT" : "POST";

      const endpoint = "/api/notes";

      const payload: Partial<Note> = {
        id: isEditingOriginal ? note!.id : createdNoteId ?? undefined,
        title: noteTitle ?? "",
        content: noteContent ?? "",
        archived: note?.archived ?? false,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save note");
      }

      const savedNote: Note = await res.json();

      if (method === "POST") {
        setCreatedNoteId(savedNote.id);
      }

      prevTitleRef.current = noteTitle;
      prevContentRef.current = noteContent;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounce auto-save
  useEffect(() => {
    if (!open) return; 
    if (
      noteTitle === prevTitleRef.current &&
      noteContent === prevContentRef.current
    ) {
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      handleSave();
    }, 600);

    return () => clearTimeout(handler);
  }, [noteTitle, noteContent, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 3, position: "relative" }}>
        {loading && (
          <CircularProgress
            size={20}
            sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
          />
        )}

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            padding: 0.5,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <TextField
          placeholder="Title"
          variant="standard"
          fullWidth
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              borderBottom: "none",
            },
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        />

        <TextField
          placeholder="Write your note..."
          variant="standard"
          fullWidth
          multiline
          minRows={4}
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          sx={{
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              borderBottom: "none",
            },
          }}
        />

        {error && <Box sx={{ color: "error.main", mt: 1 }}>{error}</Box>}
      </Box>
    </Dialog>
  );
}
