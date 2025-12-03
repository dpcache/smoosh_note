"use client"
import { useEffect, useState } from 'react';
import PlusCard from './components/add_note_card';

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

    socket.onmessage = (event: MessageEvent) => {
      setMessages((prev) => [...prev, event.data]);
    };

    setWs(socket);

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input) {
      ws.send(input);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Next.js + TypeScript WebSocket Demo</h1>
      <div>
        <PlusCard/>
      </div>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}