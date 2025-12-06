"use client";
import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import NoteCard from "./note_card";
import { useNotification } from "./notification_provider";
import { Note } from "../interfaces/note_model";
import { useWS } from "./ws_context";


export default function ArchiveContent() {
  const [notesMap, setNotesMap] = useState<Map<number, Note>>(new Map());
  const { showNotification } = useNotification();
  const { subscribe, unsubscribe } = useWS();

  const fetchNotes = async () => {
    try {
      // Fetch only archived notes
      const response = await fetch("/api/notes?archived=true");
      const data: Note[] = await response.json();

      const m = new Map<number, Note>();
      data.forEach((n) => m.set(n.id, n));
      setNotesMap(m);

      showNotification("Archive loaded!", "success");
    } catch {
      showNotification("Error loading archive!", "error");
    }
  };

  useEffect(() => {
    fetchNotes();

    const listener = ({ operation, note }: { operation: string; note: Note }) => {
      setNotesMap((prev) => {
        const updatedMap = new Map(prev);

        switch (operation) {
          case "INSERT":
            if (!note.archived) updatedMap.set(note.id, note);
            break;
          case "UPDATE":
            if (note.archived) {
              updatedMap.delete(note.id);
            } else if (prev.has(note.id)) {
              updatedMap.set(note.id, note);
            }
            break;
          case "DELETE":
            updatedMap.delete(note.id);
            break;
        }

        return updatedMap;
      });
    };

    subscribe(listener);
    return () => unsubscribe(listener);
  }, [subscribe, unsubscribe]);


  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Grid container spacing={3}>
        {Array.from(notesMap.values()).map((note) => (
          <Grid key={note.id}>
            <NoteCard note={note} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}