import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import PostDetail from "./pages/PostDetail/PostDetail.jsx";
import CreatePostModal from "./components/CreatePostModal/CreatePostModal.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:slug" element={<PostDetail />} />
      </Routes>
      <CreatePostModal />
    </>
  );
}
