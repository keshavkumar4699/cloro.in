// components/PostComponents/ChainView/ChainView.jsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "../PostCard/PostCard";
import ChainHeader from "./ChainHeader";
import ChainStats from "./ChainStats";
import ChainControls from "./ChainControls";
import PostsError from "../PostsError";
import { PostSkeleton } from "../PostSkeleton";

export default function ChainView() {
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest");

  const searchParams = useSearchParams();
  const chainId = searchParams.get("chainId");
  const highlightPostId = searchParams.get("highlightPost");

  const fetchChainData = useCallback(async () => {
    if (!chainId) {
      setError("No Chain ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/chains?chainId=${chainId}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({
          message: "Server error",
        }));
        throw new Error(
          errData.message || `Failed to fetch chain: ${res.status}`
        );
      }
      const data = await res.json();
      setChainData(data);
    } catch (err) {
      console.error("Fetch chain error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chainId]);

  useEffect(() => {
    fetchChainData();
  }, [fetchChainData]);

  const sortedPosts = useCallback(() => {
    if (!chainData?.posts) return [];
    return [...chainData.posts].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [chainData, sortOrder]);

  // Scroll to highlighted post
  useEffect(() => {
    if (highlightPostId && !loading) {
      const element = document.getElementById(`post-${highlightPostId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          element.classList.add("ring-2", "ring-primary");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-primary");
          }, 2000);
        }, 300);
      }
    }
  }, [highlightPostId, loading]);

  if (loading) {
    return <ChainSkeleton />;
  }

  if (error) {
    return <PostsError error={error} onRetry={fetchChainData} />;
  }

  if (!chainData) {
    return (
      <div className="text-center mt-8 p-4 text-base-content/70">
        Chain not found.
      </div>
    );
  }

  const posts = sortedPosts();

  return (
    <div className="relative animate-fadeIn">
      <ChainHeader title={chainData.title} author={chainData.author} />

      <ChainStats
        postCount={posts.length}
        followersCount={chainData.followersCount}
        views={chainData.views}
      />

      <div className="m-3 space-y-3">
        <ChainControls
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          showSort={posts.length > 1}
        />

        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              id={`post-${post._id}`}
              className={highlightPostId === post._id ? "highlight-post" : ""}
            >
              <PostCard post={post} />
            </div>
          ))
        ) : (
          <EmptyChainMessage />
        )}
      </div>
    </div>
  );
}

// ... (keep existing ChainSkeleton and EmptyChainMessage components)
function ChainSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="sticky top-0 z-30 bg-base-100/90 py-3 border-b border-base-300">
        {/* Skeleton header */}
      </div>
      <div className="container mx-auto px-2 sm:px-4 mt-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function EmptyChainMessage() {
  return (
    <p className="text-center text-lg text-base-content/60 py-16 px-4">
      <span className="text-3xl block mb-2">📭</span> This chain has no posts
      yet.
    </p>
  );
}
