import { GraphQLError } from "graphql";
import Post from "../models/Post.js";
import { generateUniqueSlug } from "../utils/slugify.js";

const DEFAULT_LIMIT = 9;

function badInput(message) {
  return new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT" } });
}

async function normalizePostFields(input, existing = null) {
  const title = input.title.trim();
  const content = input.content.trim();
  const authorName = input.author?.name?.trim();

  if (!title) throw badInput("Title cannot be empty.");
  if (!content) throw badInput("Content cannot be empty.");
  if (!authorName) throw badInput("Author name cannot be empty.");

  const slug = input.slug?.trim()
    ? await generateUniqueSlug(input.slug.trim(), existing?.id)
    : existing?.slug ?? (await generateUniqueSlug(title));

  return {
    title,
    slug,
    excerpt: input.excerpt?.trim() || "",
    content,
    coverImage: input.coverImage || "",
    category: input.category?.trim() || "",
    tags: input.tags || [],
    author: { name: authorName, avatar: input.author?.avatar || "" },
    status: input.status === "draft" ? "draft" : "published",
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : existing?.publishedAt ?? new Date(),
  };
}

export const resolvers = {
  Query: {
    posts: async (_, { page = 1, limit = DEFAULT_LIMIT, category, tag, search }) => {
      const filter = { status: "published" };
      if (category) filter.category = category;
      if (tag) filter.tags = tag;
      if (search) filter.$text = { $search: search };

      const currentPage = Math.max(1, page);
      const totalCount = await Post.countDocuments(filter);
      const totalPages = Math.max(1, Math.ceil(totalCount / limit));

      const posts = await Post.find(filter)
        .sort({ publishedAt: -1 })
        .skip((currentPage - 1) * limit)
        .limit(limit);

      return { posts, totalCount, totalPages, currentPage };
    },

    post: async (_, { slug }) => {
      return Post.findOne({ slug });
    },

    categories: async () => {
      const categories = await Post.distinct("category", { category: { $ne: "" } });
      return categories.sort();
    },

    tags: async () => {
      const tags = await Post.distinct("tags");
      return tags.sort();
    },
  },

  Mutation: {
    addPost: async (_, { input }) => {
      const fields = await normalizePostFields(input);
      return Post.create(fields);
    },

    updatePost: async (_, { id, input }) => {
      const existing = await Post.findById(id);
      if (!existing) throw badInput("Post not found.");

      const fields = await normalizePostFields(input, { id, slug: existing.slug, publishedAt: existing.publishedAt });
      existing.set(fields);
      return existing.save();
    },

    deletePost: async (_, { id }) => {
      const result = await Post.findByIdAndDelete(id);
      return Boolean(result);
    },
  },

  Post: {
    id: (post) => post._id.toString(),
    publishedAt: (post) => post.publishedAt.toISOString(),
    createdAt: (post) => post.createdAt.toISOString(),
    updatedAt: (post) => post.updatedAt.toISOString(),
  },
};
