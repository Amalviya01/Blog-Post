import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { connectDB } from "./config/db.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { upload, handleUpload, uploadsDir } from "./middleware/upload.js";

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

async function main() {
  await connectDB();

  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors({ origin: CLIENT_URL }));
  app.use("/uploads", express.static(uploadsDir));
  app.post("/upload", upload.single("image"), handleUpload);

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use("/graphql", express.json(), expressMiddleware(server));

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`Server running at http://localhost:${PORT}/graphql`);
}

main().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
