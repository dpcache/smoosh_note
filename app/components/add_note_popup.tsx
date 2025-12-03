"use client";
import * as React from "react";
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
        />

        {/* Note textarea */}
        <TextField
          label="Note"
          variant="outlined"
          fullWidth
          multiline
          minRows={4}
        />
      </DialogContent>


      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onClose}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}