import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const archivedParam = url.searchParams.get("archived");
    const searchQuery = url.searchParams.get("q")?.trim() ?? "";
    const lastIdParam = url.searchParams.get("lastId");
    const limitParam = url.searchParams.get("limit");

    const limit = limitParam ? parseInt(limitParam) : 20;
    const fetchLimit = limit + 1;

    const archived = archivedParam === "true";
    const lastId = lastIdParam ? parseInt(lastIdParam) : 0;

    const whereClause: any = { archived };
    if (lastId) whereClause.id = { gt: lastId };

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { content: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // Fetch notes sorted by creation date descending
    let notes = await prisma.note.findMany({
      where: whereClause,
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
    });

    const hasMore = notes.length > limit;
    if (hasMore) notes = notes.slice(0, limit);

    return NextResponse.json({ notes, hasMore });
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
    let { title, content } = await req.json();

    // Normalize nullish values
    title = title ?? "";
    content = content ?? "";

    // Character limit config
    const TITLE_LIMIT = 50;
    const CONTENT_LIMIT = 255;

    // Basic validation
    if (!title && !content) {
      return NextResponse.json(
        { error: "Title or content required" },
        { status: 400 }
      );
    }

    // Character limit validation
    if (title.length > TITLE_LIMIT) {
      return NextResponse.json(
        { error: `Title exceeds ${TITLE_LIMIT} characters` },
        { status: 400 }
      );
    }

    if (content.length > CONTENT_LIMIT) {
      return NextResponse.json(
        { error: `Content exceeds ${CONTENT_LIMIT} characters` },
        { status: 400 }
      );
    }

    // Create note
    const note = await prisma.note.create({
      data: { title, content },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}


// PUT /api/notes/:id → update note
export async function PUT(req: NextRequest) {
  try {
    let { id, title, content } = await req.json();

    // ID is required
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // Normalize null/undefined fields
    title = title ?? "";
    content = content ?? "";

    // Character limit config
    const TITLE_LIMIT = 50;
    const CONTENT_LIMIT = 255;

    // Ensure at least one field is not completely empty
    if (!title && !content) {
      return NextResponse.json(
        { error: "Title or content required" },
        { status: 400 }
      );
    }

    // Character limit validation
    if (title.length > TITLE_LIMIT) {
      return NextResponse.json(
        { error: `Title exceeds ${TITLE_LIMIT} characters` },
        { status: 400 }
      );
    }

    if (content.length > CONTENT_LIMIT) {
      return NextResponse.json(
        { error: `Content exceeds ${CONTENT_LIMIT} characters` },
        { status: 400 }
      );
    }

    // Update
    const note = await prisma.note.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
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
