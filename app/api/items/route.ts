import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { ApiResponse, ItemFormValues } from "@/types";
import type { Item } from "@/db/schema";

// GET /api/items
export async function GET(): Promise<NextResponse<ApiResponse<Item[]>>> {
  try {
    const allItems = await db
      .select()
      .from(items)
      .orderBy(desc(items.createdAt));

    return NextResponse.json({ success: true, data: allItems });
  } catch (error) {
    console.error("[GET /api/items]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST /api/items
export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Item>>> {
  try {
    const body: ItemFormValues = await req.json();

    // Basic validation
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { success: false, error: "Name, category and price are required" },
        { status: 400 }
      );
    }

    const [newItem] = await db
      .insert(items)
      .values({
        name:          body.name.trim(),
        description:   body.description?.trim() ?? "",
        category:      body.category.trim(),
        quantity:      Number(body.quantity),
        price:         String(body.price),
        imageUrl:      body.imageUrl      ?? null,
        imagePublicId: body.imagePublicId ?? null,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/items]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}