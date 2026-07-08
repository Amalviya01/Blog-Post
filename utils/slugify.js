import slugify from "slugify";
import Post from "../models/Post.js";

export async function generateUniqueSlug(title, ignoreId = null) {
  const base = slugify(title, { lower: true, strict: true });

  let candidate = base;
  let suffix = 1;

  while (true) {
    const existing = await Post.findOne({ slug: candidate });
    if (!existing || existing._id.toString() === ignoreId) {
      return candidate;
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
