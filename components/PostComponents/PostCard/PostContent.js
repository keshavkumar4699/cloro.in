import Link from "next/link";

export function PostContent({ post }) {
  return (
    <Link
      href={`/posts/chains?chainId=${post.chainId}&highlightPost=${post._id}`}
      className="mt-1"
    >
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
    </Link>
  );
}
