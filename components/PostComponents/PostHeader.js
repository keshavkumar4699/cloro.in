// components/PostHeader.jsx
"use client";

import Link from "next/link";

export const PostHeader = ({
  post,
  isFollowing,
  onToggleFollow,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-x-2">
      <Link
        className="font-semibold hover:text-primary transition-colors duration-200 interactive text-sm sm:text-base"
        href={`/posts/${post._id}`}
        onClick={(e) => e.stopPropagation()}
      >
        {post.title}
      </Link>
      <span className="text-base-content/50 text-xs sm:text-sm">•</span>
      <span className="text-xs sm:text-sm text-base-content/50">
        {formatTimeAgo(post.createdAt)}
      </span>
      <span className="text-base-content/50 text-xs sm:text-sm">•</span>
      <a
        href="#"
        className={`text-xs sm:text-sm transition-colors duration-200 ${
          isFollowing ? "text-primary" : "text-base-content/70 hover:text-primary"
        }`}
        onClick={(e) => {
          e.preventDefault();
          onToggleFollow();
        }}
      >
        {isFollowing ? "Following" : "Follow"}
      </a>
    </div>
  );
};

// Helper function
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};