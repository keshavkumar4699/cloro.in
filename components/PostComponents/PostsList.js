// components/PostComponents/PostsList.jsx
"use client";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import PostCard from "./PostCard/PostCard";
import { PostSkeleton } from "./PostSkeleton";
import PostsError from "./PostsError";

export default function PostsList() {
  const { data: posts, loading, error, refetch } = useFetchPosts();

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <PostsError error={error} onRetry={refetch} />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center mt-8 text-base-content/70">
        No posts found.
      </div>
    );
  }

  return (
    <div className="m-3 space-y-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
