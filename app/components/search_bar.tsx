"use client";
import { TextField, Box } from "@mui/material";


interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}


export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Search Notes"
        variant="outlined"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
}