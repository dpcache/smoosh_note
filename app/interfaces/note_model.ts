export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string; // or Date
  updatedAt: string; // or Date
}