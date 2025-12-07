"use client";
import { useState } from "react";
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SideMenu from "./components/side_menu";
import NotesContent from "./components/notes_content";
import ArchiveContent from "./components/archive_content";

export default function Page() {
  const [selectedMenu, setSelectedMenu] = useState<"notes" | "trash">("notes");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Jia Notes App
          </Typography>
          <Button color="inherit" startIcon={<AccountCircleIcon />}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexGrow: 1, mt: "64px" /* height of AppBar */ }}>
        <SideMenu selected={selectedMenu} onSelect={setSelectedMenu} />
        <Box sx={{ flexGrow: 1, ml: "220px", p: 2 }}>
          {selectedMenu === "notes" && <NotesContent archived={false} />}
          {selectedMenu === "trash" && <NotesContent archived={true} />}
        </Box>
      </Box>
    </Box>
  );
}
