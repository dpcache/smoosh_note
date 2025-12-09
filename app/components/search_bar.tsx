"use client";
import { TextField, Box, InputAdornment, CircularProgress } from "@mui/material";


interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  loading?: boolean;
}


export default function SearchBar({ query, onChange, loading }: SearchBarProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="Search Notes"
        variant="outlined"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}