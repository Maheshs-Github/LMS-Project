import z from "zod";

const getAllCoursesSchema = z.object({
  query: z
    .object({
      searchValue: z.string().trim().optional(),
      sortBy: z.enum(["price-low", "price-high", "rating", ""]).optional(),
      category: z.string().trim().optional(),

      page: z.coerce.number().int().positive().default(1),

      limit: z.coerce.number().int().positive().max(100).default(10),
    })
    .strict(),
});

export { getAllCoursesSchema };
