import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { items } from "@/db/schema";
import { desc, count } from "drizzle-orm";
import type { ApiResponse, ItemFormValues } from "@/types";
import type { Item } from "@/db/schema";

interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  error?: string;
}

// GET /api/items
export async function GET(req: NextRequest): Promise<NextResponse<PaginatedResponse<Item>>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "10", 10));

    // Get total count
    const countResult = await db.select({ count: count() }).from(items);
    const total = countResult[0].count;
    const totalPages = Math.ceil(total / limit);

    // Validate page
    if (page > totalPages && total > 0) {
      return NextResponse.json(
        { success: false, error: "Page out of range" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;
    const allItems = await db
      .select()
      .from(items)
      .orderBy(desc(items.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: allItems,
      total,
      page,
      limit,
      totalPages,
    });
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