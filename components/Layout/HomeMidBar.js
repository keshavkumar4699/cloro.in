"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import PostsList from "@/components/PostComponents/PostsList";
import SinglePostView from "@/components/PostComponents/SinglePostView";

const HomeMidBar = () => {
  const { data: isSession } = useSession();
  const [selectedPost, setSelectedPost] = useState(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get('post');

  useEffect(() => {
    if (postId) {
      // Fetch the single post when URL changes
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/posts/${postId}`);
          const data = await res.json();
          setSelectedPost(data);
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      };
      fetchPost();
    } else {
      setSelectedPost(null);
    }
  }, [postId]);

  const handlePostSelect = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="mx-auto px-2 py-4 sm:px-4 sm:py-6">
      {selectedPost ? (
        <SinglePostView post={selectedPost} />
      ) : (
        <PostsList onPostSelect={handlePostSelect} />
      )}
    </div>
  );
};

export default HomeMidBar;