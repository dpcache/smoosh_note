"use client"
import { useEffect, useState } from 'react';
import PlusCard from './components/add_note_card'; // Assuming this is AddNotePlusCard
import { Button, Grid, Box } from '@mui/material'; // Added Grid and Box for layout
import { useNotification } from './components/notification_provider';
import NoteCard from './components/note_card';

// Define the type for a Note (must match your NoteCard's expectation)
interface Note {
  title: string;
  content: string;
}

const INITIAL_LOAD_COUNT = 9;
const LOAD_MORE_COUNT = 3;

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [notes, setNotes] = useState<Note[]>([]); // State for storing fetched notes
  const [input, setInput] = useState('');
  const { showNotification } = useNotification();

  // --- 1. Function to Fetch Notes ---
  const fetchNotes = async () => {
    try {
      // Replace with your actual API endpoint for GET all notes
      const response = await fetch('/api/notes');
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data: Note[] = await response.json();
      setNotes(data);
      // Optional: show a notification on successful fetch
      showNotification("Notes loaded successfully!", "success");
    } catch (error) {
      console.error("Error fetching notes:", error);
      showNotification("Error loading notes!", "error");
    }
  };


  useEffect(() => {
    fetchNotes();

    const socket = new WebSocket('ws://localhost:3001');
    socket.onmessage = (event: MessageEvent) => {
      showNotification(event.data, "success");
    };
    setWs(socket);

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws && input) {
      ws.send(input);
      setInput('');
    }
  };

  return (
    <Box sx={{ p: '2rem' }}>
      <h1>Next.js Notes App</h1>

      {/* Notification Demo/Test Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={() => showNotification("This is a success message!", "success")}
        >
          Show Success Notification
        </Button>
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}> {/* max-width of 1100px */}
        <Grid container spacing={3}> {/* spacing={3} typically means 24px */}
          {/* The rest of your Grid items with the fixed 200px width */}
          <Grid>
            <PlusCard onClick={() => console.log("Add Note clicked")} />
          </Grid>
          {notes.map((note, idx) => (
            <Grid key={idx}>
              <NoteCard note={note} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}