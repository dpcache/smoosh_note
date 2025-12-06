import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  SxProps,
  Theme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddNotePopup from "./add_note_popup";
import { Note } from "../interfaces/note_model";


interface NoteCardProps {
  note: Note;
  sx?: SxProps<Theme>;
  onDelete?: (id: string) => void; // callback for delete
}

export default function NoteCard({ note, sx, onDelete }: NoteCardProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click from opening popup

    if (!note.id) return;

    try {
      const res = await fetch(`/api/notes?id=${note.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete note");
      }
    } catch (err: any) {
      console.error("Delete failed:", err.message);
      // Optionally show a toast/notification here
    }
  };

  const cardSx: SxProps<Theme> = {
    width: 200,
    height: 300,
    display: "flex",
    flexDirection: "column",
    borderRadius: 2,
    boxShadow: 3,
    p: 0,
    m: 0,
    cursor: "pointer",
    "&:hover": {
      boxShadow: 6,
    },
    position: "relative", // for absolute icons
    ...sx,
  };

  return (
    <>
      <Card sx={cardSx} elevation={2} onClick={handleOpen}>
        <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            noWrap
            title={note.title}
            sx={{ fontWeight: "bold" }}
          >
            {note.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 10,
              whiteSpace: "pre-wrap",
            }}
          >
            {note.content}
          </Typography>
        </CardContent>

        {/* Icons at bottom-right */}
        <Box
          sx={{
            position: "absolute",
            bottom: 4,
            right: 4,
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{ bgcolor: "background.paper" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => e.stopPropagation()} // prevent popup
            sx={{ bgcolor: "background.paper" }}
          >
            <AttachFileIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>

      <AddNotePopup
        open={open}
        onClose={handleClose}
        note={note}
      />
    </>
  );
}