// components/PostComponents/PostCard.jsx
"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { TimeAgo } from "../TimeAgo";

export function PostCard({ post }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (!post.chainId) {
      throw new Error("This post is not associated with a chain.");
    }
    router.push(`${pathname}?chainId=${post.chainId}&postId=${post._id}`, { 
      scroll: false 
    });
  };

  return (
    <div
      className="card rounded-xl p-4 transition-all duration-300 border cursor-pointer bg-base-100 border-base-300 hover:bg-base-200 hover:border-primary/20 hover:shadow-md"
      onClick={handleClick}
    >
      <PostHeader post={post} />
      <PostContent post={post} />
    </div>
  );
}

function PostHeader({ post }) {
  return (
    <div className="flex items-start gap-3 mb-3">
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
                alt={post.author.name || post.author?.username || ""} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="bg-neutral text-neutral-content w-full h-full rounded-full flex items-center justify-center text-xs">
                {post.author?.name?.charAt(0)?.toUpperCase() || 
                 post.author?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 text-sm">
          <h3 className="font-semibold truncate hover:text-primary transition-colors">
            {post.title}
          </h3>
          <span className="text-base-content/50">•</span>
          <span className="text-base-content/50">{post.views || 0} views</span>
          <span className="text-base-content/50">•</span>
          <span className="text-base-content/50">
            <TimeAgo date={post.createdAt} />
          </span>
        </div>
        <Link 
          href={`/users/${post.author?.username || "anonymous"}`} 
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-base-content/70 hover:text-primary transition-colors"
        >
          @{post.author?.username || "user"}
        </Link>
      </div>
    </div>
  );
}

function PostContent({ post }) {
  return (
    <div className="mt-1">
      {post.content && (
        <p className="text-base-content/90 text-sm mb-3 leading-relaxed line-clamp-3">
          {post.content}
        </p>
      )}
      {post.imageUrl && (
        <div className="rounded-lg overflow-hidden max-h-80 md:max-h-96 flex justify-center bg-base-200/30 mt-2">
          <img
            src={post.imageUrl}
            alt={post.title || "Post image"}
            className="object-contain max-h-80 md:max-h-96 w-full"
          />
        </div>
      )}
    </div>
  );
}