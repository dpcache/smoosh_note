import { Note } from "../interfaces/note_model";

type WSListener = (data: {
  operation: "INSERT" | "UPDATE" | "DELETE";
  note: Note;
}) => void;

class WSManager {
  private static instance: WSManager;
  private socket: WebSocket | null = null;
  private listeners: WSListener[] = [];

  private constructor() {
    this.connect();
  }

  public static getInstance() {
    if (!WSManager.instance) {
      WSManager.instance = new WSManager();
    }
    return WSManager.instance;
  }

  private connect() {
    this.socket = new WebSocket("ws://localhost:3001");

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (typeof data.id !== "number") return;

        const note: Note = {
          id: data.id,
          title: data.title,
          content: data.content,
          archived: data.archived ?? false,
          createdAt: data.createdAt ?? new Date().toISOString(),
          updatedAt: data.updatedAt ?? new Date().toISOString(),
        };

        this.listeners.forEach((listener) =>
          listener({ operation: data.operation, note })
        );
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket closed, reconnecting...");
      setTimeout(() => this.connect(), 2000); // auto-reconnect
    };
  }

  public addListener(listener: WSListener) {
    this.listeners.push(listener);
  }

  public removeListener(listener: WSListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  public sendMessage(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}

export default WSManager;