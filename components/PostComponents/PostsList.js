// components/PostsList.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { PostSkeleton } from "./PostSkeleton";

export default function PostsList({ onPostSelect }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    // Update URL without page reload
    router.push(`${pathname}?post=${postId}`, { scroll: false });
    // Notify parent component to update content
    if (onPostSelect) {
      const post = posts.find((p) => p._id === postId);
      onPostSelect(post);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading)
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );

  if (error)
    return <div className="text-error text-center mt-8">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="card rounded-xl p-4 transition-all duration-300 border cursor-pointer bg-base-200 border-base-300 hover:bg-base-300 hover:border-primary/20 hover:shadow-lg"
          onClick={() => handlePostClick(post._id)}
        >
          {/* Post Header - User info and metadata */}
          <div className="flex items-start gap-3 mb-3">
            {/* User Avatar - Made smaller */}
            <Link
              href={`/users/${post.author?.username || "anonymous"}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0"
            >
              <div className="avatar">
                <div className="w-8 h-8 rounded-full ring-1 ring-primary/50 hover:ring-primary transition-all duration-300">
                  {post.author?.image ? (
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-neutral text-neutral-content w-full h-full rounded-full flex items-center justify-center text-xs">
                      {post.author?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>
            </Link>

            {/* Post title and user info */}
            <div className="flex-1 min-w-0">
              {/* Single line for title, views, and time that can wrap */}
              <div className="flex flex-wrap items-center gap-x-2 text-sm">
                <h3 className="font-semibold truncate hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <span className="text-base-content/50">•</span>
                <span className="text-base-content/50">
                  {post.views || 0} views
                </span>
                <span className="text-base-content/50">•</span>
                <span className="text-base-content/50">
                  {formatTimeAgo(post.createdAt)}
                </span>
              </div>

              <Link
                href={`/users/${post.author?.username || "anonymous"}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-base-content/70 hover:text-neutral-700 transition-colors"
              >
                @{post.author?.username || "user"}
              </Link>
            </div>
          </div>

          {/* Post Content - Clickable area excluded */}
          <div
            className="rounded-xl p-3 bg-gradient-to-br bg">
            {post.content && (
              <p className="text-base-content/90 text-sm mb-3 leading-relaxed">
                {post.content}
              </p>
            )}
            {post.imageUrl && (
              <div className="rounded-lg overflow-hidden max-h-96 flex justify-center bg-gradient-to-br from-base-200 to-base-300 transition-all duration-300 hover:shadow-lg">
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="object-contain max-h-96 w-full hover:scale-[1.02] transition-transform duration-500 ease-in-out"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
