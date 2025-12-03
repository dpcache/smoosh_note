"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import type { SxProps } from "@mui/system";
import AddNotePopup from "./add_note_popup";


export type AddNotePlusCardProps = {
  /** click handler for the + button */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** optional MUI sx overrides */
  sx?: SxProps;
  /** aria-label for accessibility */
  ariaLabel?: string;
  /** disable ripple / interaction (keeps visual but disables clicking) */
  disabled?: boolean;
};


export default function AddNotePlusCard({
  onClick,
  sx,
  ariaLabel = "add",
  disabled = false,
}: AddNotePlusCardProps) {

  const [open, setOpen] = React.useState(false);
  const handleCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    onClick?.(e);
  };

  const cardSx: SxProps = {
    width: 200,
    height: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    boxShadow: 1,
    p: 0,
    m: 0,
    ...sx,
  };

  return (
    <>
      <Card sx={cardSx} elevation={2}>
        <IconButton
          aria-label={ariaLabel}
          onClick={handleCardClick}
          disabled={disabled}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </Card>
      <AddNotePopup open={open} onClose={() => setOpen(false)} />
    </>
  );
}