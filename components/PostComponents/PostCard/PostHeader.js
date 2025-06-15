import Link from "next/link";
import { TimeAgo } from "./TimeAgo";

export function PostHeader({ post }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <Link
        href={`/users/${post.author?._id || "anonymous"}`}
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
                  post.author?.username?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 text-sm">
          <Link
            className="font-semibold truncate hover:text-primary transition-colors"
            href={`/posts/chains?chainId=${post.chainId}&highlightPost=${post._id}`}
          >
            {post.title}
          </Link>
          <span className="text-base-content/50">•</span>
          <span className="text-base-content/50">{post.views || 0} views</span>
          <span className="text-base-content/50">•</span>
          <span className="text-base-content/50">
            <TimeAgo date={post.createdAt} />
          </span>
        </div>
        <Link
          href={`/users/${post.author?._id || "anonymous"}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm text-base-content/70 hover:text-primary transition-colors"
        >
          @{post.author?.name || "user"}
        </Link>
      </div>
    </div>
  );
}
