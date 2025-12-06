"use client";
import { useState } from "react";
import { Box } from "@mui/material";
import SideMenu from "./components/side_menu";
import NotesContent from "./components/notes_content";
import ArchiveContent from "./components/archive_content";

export default function Page() {
  const [selectedMenu, setSelectedMenu] = useState<"notes" | "trash">("notes");

  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu selected={selectedMenu} onSelect={setSelectedMenu} />

      <Box sx={{ flexGrow: 1, ml: "220px" }}>
        {selectedMenu === "notes" && <NotesContent />}
        {selectedMenu === "trash" && <ArchiveContent />}
      </Box>
    </Box>
  );
}
