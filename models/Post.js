import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String },
    tags: { type: [String], default: [] },
    author: { type: authorSchema, required: true },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    publishedAt: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", excerpt: "text", content: "text" });

export default mongoose.model("Post", postSchema);
