"use client";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface SideMenuProps {
  onSelect: (menu: "notes" | "trash") => void;
  selected: "notes" | "trash";
}

export default function SideMenu({ onSelect, selected }: SideMenuProps) {
  return (
    <Box
      sx={{
        width: 220,
        bgcolor: "#f5f5f5",
        height: "100vh",
        p: 2,
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Spacer to push icons below AppBar */}
      <Box sx={{ height: "64px" }} />

      <List>
        {/* Notes */}
        <ListItemButton
          selected={selected === "notes"}
          onClick={() => onSelect("notes")}
        >
          <ListItemIcon>
            <DescriptionOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Notes" />
        </ListItemButton>

        {/* Trash */}
        <ListItemButton
          selected={selected === "trash"}
          onClick={() => onSelect("trash")}
        >
          <ListItemIcon>
            <DeleteOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItemButton>
      </List>
    </Box>
  );
}
