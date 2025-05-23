// components/PostAuthor.jsx
"use client";

import Link from "next/link";

export const PostAuthor = ({ author }) => {
  return (
    <Link
      className="flex items-center space-x-2 interactive hover:bg-base-300 rounded-lg p-1 transition-all duration-200 max-w-[60%] hover:scale-[1.01]"
      href={`/users/${author?.username || "anonymous"}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="avatar">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-primary/50 hover:ring-primary transition-all duration-300">
          {author?.image ? (
            <img
              src={author.image}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-neutral text-neutral-content w-full h-full rounded-full flex items-center justify-center text-xs">
              {author?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
      </div>
      <div className="truncate">
        <p className="text-xs sm:text-sm font-medium truncate">
          {author?.name || "Anonymous"}
        </p>
        <p className="text-[10px] sm:text-xs text-base-content/50 truncate">
          @{author?.username || "user"}
        </p>
      </div>
    </Link>
  );
};