"use client";
import { useEffect, useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import NoteCard from "./note_card";
import { useNotification } from "./notification_provider";
import { Note } from "../interfaces/note_model";
import { useWS } from "../components/ws_context";
import SearchBar from "./search_bar";

export default function ArchiveContent() {
  const [notesMap, setNotesMap] = useState<Map<number, Note>>(new Map());
  const [notesList, setNotesList] = useState<Note[]>([]);
  const [lastId, setLastId] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const { showNotification } = useNotification();
  const { subscribe, unsubscribe } = useWS();
  const [search, setSearch] = useState("");

  const fetchNotes = async (query: string = "", loadMore = false) => {
    try {
      const url = new URL("/api/notes", location.origin);
      url.searchParams.set("archived", "true");
      url.searchParams.set("limit", "20");

      if (query.trim()) url.searchParams.set("q", query);
      if (loadMore && lastId) url.searchParams.set("lastId", lastId.toString());

      const response = await fetch(url.toString());
      const data: { notes: Note[]; hasMore: boolean } = await response.json();

      const fetchedNotes = data.notes;

      if (!loadMore) {
        const m = new Map<number, Note>();
        fetchedNotes.forEach((n) => m.set(n.id, n));
        setNotesMap(m);
        setNotesList(fetchedNotes);
      } else {
        setNotesList((prev) => {
          const newNotes = fetchedNotes.filter((n) => !notesMap.has(n.id));
          const m = new Map(notesMap);
          newNotes.forEach((n) => m.set(n.id, n));
          setNotesMap(m);
          return [...prev, ...newNotes];
        });
      }

      if (fetchedNotes.length > 0) {
        setLastId(fetchedNotes[fetchedNotes.length - 1].id);
      }

      setHasMore(data.hasMore);
    } catch {
      showNotification("Error loading archived notes!", "error");
    }
  };

  // Fetch notes + subscribe to WS updates
  const listener = ({ operation, note }: { operation: string; note: Note }) => {
    const matchesSearch =
      search.trim() === "" ||
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());

    setNotesMap((prevMap) => {
      const newMap = new Map(prevMap);

      switch (operation) {
        case "INSERT":
          // Only add if archived and matches search
          if (note.archived && matchesSearch) {
            newMap.set(note.id, note);
            setNotesList((prev) => [note, ...prev.filter((n) => n.id !== note.id)]);
          }
          break;

        case "UPDATE":
          if (note.archived) {
            // It is archived → keep only if matches search
            if (matchesSearch) {
              newMap.set(note.id, note);
              setNotesList((prev) => [
                note,
                ...prev.filter((n) => n.id !== note.id),
              ]);
            } else {
              newMap.delete(note.id);
              setNotesList((prev) =>
                prev.filter((n) => n.id !== note.id)
              );
            }
          } else {
            // It is no longer archived → remove
            newMap.delete(note.id);
            setNotesList((prev) =>
              prev.filter((n) => n.id !== note.id)
            );
          }
          break;

        case "DELETE":
          newMap.delete(note.id);
          setNotesList((prev) =>
            prev.filter((n) => n.id !== note.id)
          );
          break;
      }

      return newMap;
    });
  };

  // Search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setLastId(0);
      fetchNotes(search);
    }, 800);

    return () => clearTimeout(handler);
  }, [search]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <SearchBar query={search} onChange={setSearch} />
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {notesList.map((note) => (
          <Grid key={note.id}>
            <NoteCard note={note} />
          </Grid>
        ))}
      </Grid>

      {hasMore && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button variant="contained" onClick={() => fetchNotes(search, true)}>
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
}
