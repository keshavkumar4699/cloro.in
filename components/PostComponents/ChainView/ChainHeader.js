// components/PostComponents/ChainView/ChainHeader.jsx
"use client";
import Link from "next/link";

export default function ChainHeader({ title, author }) {
  return (
    <div className="sticky top-0 z-30 bg-base-100/95 backdrop-blur-sm py-3 border-b border-base-300 shadow-sm">
      <div className="container mx-auto px-2 sm:px-0">
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="text-lg sm:text-xl font-semibold text-base-content text-center truncate max-w-full px-2">
            {title || "Chain"}
          </h1>
          {author && (
            <p className="text-xs text-base-content/70">
              Curated by{" "}
              <Link
                href={`/users/${author.username || author._id}`}
                className="link link-hover text-xs font-medium hover:text-primary"
              >
                {author.name || author.username}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}