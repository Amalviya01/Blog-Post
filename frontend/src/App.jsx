import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import CreatePostModal from "./components/CreatePostModal/CreatePostModal.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:slug" element={<Home />} />
      </Routes>
      <CreatePostModal />
    </>
  );
}
