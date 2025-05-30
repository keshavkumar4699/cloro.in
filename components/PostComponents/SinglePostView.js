// SinglePostView.jsx
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SinglePostView({ post }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Post Card - Same styling as PostsList items */}
      <div className="card rounded-xl p-4 transition-all duration-300 border cursor-pointer bg-base-200 border-base-300 hover:bg-base-300 hover:border-primary/20 hover:shadow-lg">
        {/* Post Header - Same as PostsList */}
        <div className="flex items-start gap-3 mb-3">
          {/* User Avatar */}
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
            <div className="flex flex-wrap items-center gap-x-2 text-sm">
              <h3 className="font-semibold truncate">{post.title}</h3>
              <span className="text-base-content/50">•</span>
              <span className="text-base-content/50">
                {post.views || 0} views
              </span>
              <span className="text-base-content/50">•</span>
              <span className="text-base-content/50">
                {new Date(post.createdAt).toLocaleDateString()}
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

        {/* Post Content - Same styling as PostsList */}
        <div className="rounded-xl p-3 bg-gradient-to-br">
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
    </div>
  );
}
