import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const archivedParam = url.searchParams.get("archived");

    // Default to false (non-archived notes)
    const archived = archivedParam === "true" ? true : false;

    const notes = await prisma.note.findMany({
      where: { archived },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/notes failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}


// POST /api/notes → create new note
export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: { title, content },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

// PUT /api/notes/:id → update note
export async function PUT(req: NextRequest) {

  try {
    const { id, title, content } = await req.json();
    if (!id || !title || !content) {
      return NextResponse.json({ error: "ID, title, and content required" }, { status: 400 });
    }

    const note = await prisma.note.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

// DELETE /api/notes/:id → delete note
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const id = Number(idParam);

    // Find the note first
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (!note.archived) {
      // Soft delete: set archived = true
      const updated = await prisma.note.update({
        where: { id },
        data: { archived: true },
      });
      return NextResponse.json({
        message: "Note archived (soft deleted)",
        note: updated,
      });
    } else {
      // Hard delete: remove from database
      await prisma.note.delete({ where: { id } });
      return NextResponse.json({ message: "Note permanently deleted" });
    }
  } catch (error) {
    console.error("DELETE /api/notes failed:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
