import { CollectionCollors } from "@/lib/constants";
import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(4, { message: "collection must be at least 4 symbols" }),
  color: z
    .string()
    .refine((color) => Object.keys(CollectionCollors).includes(color)),
});

export type createCollectionSchemaType = z.infer<typeof createCollectionSchema>;
