// app/posts/page.js
"use client";
import { useState } from "react";
import PostModal from "@/components/PostModal/PostModal";
import PostsList from "@/components/PostsList";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

export default function PostsPage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <>
    <Header/>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Community Posts</h1>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Post
          </button>
        </div>

        <PostsList />

        <PostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
        />
      </div>
      <Footer/>
    </>
  );
}
