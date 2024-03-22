import { z } from "zod";

export const taskInput = z.string({
  required_error: "Describe todo",
});
