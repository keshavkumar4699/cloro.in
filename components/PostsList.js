// components/PostsList.js
"use client";
import { useEffect, useState } from "react";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to post!</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="p-4 border rounded">
            <h3 className="text-xl font-bold">{post.title}</h3>
            <p className="text-gray-600">{post.content}</p>
            <div className="mt-2 text-sm text-gray-500">
              Posted by {post.author?.name || "Unknown"} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}