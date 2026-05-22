import type { Item } from "@/db/schema";

export type { Item };

export type ItemFormValues = {
  name:           string;
  description:    string;
  category:       string;
  quantity:       number;
  price:          number;
  imageUrl?:      string;
  imagePublicId?: string;
};

export type ApiResponse<T> =
  | { success: true;  data: T }
  | { success: false; error: string };