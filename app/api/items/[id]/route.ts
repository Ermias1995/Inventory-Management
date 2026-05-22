import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import type { ApiResponse, ItemFormValues } from "@/types";
import type { Item } from "@/db/schema";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PUT /api/items/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Item>>> {
  try {
    const { id } = await params;
    const body: ItemFormValues = await req.json();

    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, error: "Name, category and price are required" },
        { status: 400 }
      );
    }

    const [updatedItem] = await db
      .update(items)
      .set({
        name:          body.name.trim(),
        description:   body.description?.trim() ?? "",
        category:      body.category.trim(),
        quantity:      Number(body.quantity),
        price:         String(body.price),
        imageUrl:      body.imageUrl      ?? null,
        imagePublicId: body.imagePublicId ?? null,
        updatedAt:     new Date(),
      })
      .where(eq(items.id, Number(id)))
      .returning();

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error("[PUT /api/items/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ id: number }>>> {
  try {
    const { id } = await params;

    // Fetch item first to get Cloudinary public_id
    const [item] = await db
      .select()
      .from(items)
      .where(eq(items.id, Number(id)));

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    // Delete from database
    await db.delete(items).where(eq(items.id, Number(id)));

    return NextResponse.json({ success: true, data: { id: Number(id) } });
  } catch (error) {
    console.error("[DELETE /api/items/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}