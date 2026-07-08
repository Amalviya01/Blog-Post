# MetaBlog — Full-Stack Blog App

A full-stack blog application built with **React**, **Node.js**, **GraphQL** (Apollo Server), and **MongoDB**. Users can browse posts (with category filters, pagination, and search) and publish new posts through a rich creation form, including image uploads.

## Approach

- **Backend** (`/`): Express + Apollo Server expose a GraphQL API over a MongoDB `Post` collection (title, slug, excerpt, markdown content, cover image, category, tags, author, status, publish date). A REST `/upload` endpoint (multer) handles image uploads to local disk and returns a URL, since file uploads don't fit naturally into a GraphQL mutation. Code is split into `config/`, `models/`, `graphql/`, `middleware/`, and `utils/` so each concern (DB connection, schema, resolvers, uploads, slug generation) lives on its own.
- **Frontend** (`/frontend`): A Vite + React SPA using Apollo Client for data fetching and `react-router-dom` for routing. Styling is hand-written SASS (CSS Modules, one `.module.scss` per component) rather than a utility framework. The post editor stores content as markdown — the toolbar inserts markdown syntax into a textarea, and `react-markdown` renders it back on the detail/preview views, avoiding the complexity of a full WYSIWYG editor while keeping the same toolbar UX.

## Project Structure

```
.
├── config/db.js              # mongoose connection
├── models/Post.js            # Post schema
├── graphql/
│   ├── typeDefs.js
│   └── resolvers.js
├── middleware/upload.js      # multer config + /upload handler
├── utils/slugify.js          # unique slug generation
├── uploads/                  # uploaded images (gitignored)
├── server.js                 # entrypoint: wires express, apollo, db, uploads
├── .env.example
└── frontend/
    ├── src/
    │   ├── apollo/client.js
    │   ├── context/           # CreateModalContext (controls the Create Blog modal)
    │   ├── graphql/           # queries.js, mutations.js
    │   ├── components/        # Header, Hero, PostCard, CreatePostModal, MarkdownToolbar, etc.
    │   ├── pages/              # Home, PostDetail
    │   ├── styles/              # SASS variables/mixins/global
    │   └── utils/                # uploadImage, formatDate, estimateReadTime, formatRelativeTime
    └── .env.example
```

## Setup

### 1. Backend

```
npm install
cp .env.example .env      # set MONGO_URI, PORT, CLIENT_URL
```

Start MongoDB locally (or point `MONGO_URI` at an Atlas cluster), then:

```
npm run dev
```

Server runs at `http://localhost:4000/graphql` (Apollo Sandbox in the browser) with uploads served from `http://localhost:4000/uploads`.

### 2. Frontend

```
cd frontend
npm install
cp .env.example .env      # VITE_GRAPHQL_URL, VITE_UPLOAD_URL
npm run dev
```

App runs at `http://localhost:3000`.

## GraphQL API

**Queries**
- `posts(page, limit, category, tag, search)` — paginated, filterable, returns `{ posts, totalCount, totalPages, currentPage }`
- `post(slug)` — single post for the detail page
- `categories` / `tags` — distinct values for filters

**Mutations**
- `addPost(input: PostInput!)`
- `updatePost(id, input: PostInput!)`
- `deletePost(id)`

Example:
```graphql
mutation {
  addPost(input: {
    title: "My First Post"
    content: "Hello **world**"
    author: { name: "Jane Doe" }
  }) {
    id
    slug
  }
}
```

## Image upload

`POST /upload` (multipart, field name `image`, PNG/JPEG, max 5MB) → `{ "url": "http://localhost:4000/uploads/<file>" }`. The frontend uploads the file here first, then passes the returned URL as `coverImage` in the `addPost`/`updatePost` mutation.

## Demo
\blog-graphql\Demo\Blog-post.mp4 