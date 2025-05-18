// app/posts/page.js
"use client";
import { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid"; // You can choose another if you prefer
import PostModal from "@/components/PostModal/PostModal";
import PostsList from "@/components/PostsList";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

export default function PostsPage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts on initial load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]); // Add new post at beginning
    setIsPostModalOpen(false); // Close the modal
  };

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <PostsList initialPosts={posts} />
        </div>

        <PostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onPostCreated={handleNewPost}
        />
      </div>

      {/* Sticky Create Post Button */}
      <button
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Create Post"
      >
        <PencilSquareIcon className="h-6 w-6" />
      </button>

      <Footer />
    </>
  );
}
