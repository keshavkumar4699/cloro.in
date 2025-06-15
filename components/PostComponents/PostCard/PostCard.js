// components/PostComponents/PostCard/PostCard.jsx
"use client";
import Link from "next/link";
import { PostContent } from "./PostContent";
import { PostHeader } from "./PostHeader";

export default function PostCard({ post }) {
  // Directly link to chain view with the post's chainId
  return (
    <div
      className="card rounded-xl p-4 transition-all duration-300 border bg-base-100 border-base-300 hover:bg-base-200 hover:border-primary/20 hover:shadow-md block"
    >
      <PostHeader post={post} />
      <PostContent post={post} />
    </div>
  );
}
