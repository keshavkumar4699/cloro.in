// components/PostStats.jsx
"use client";

import {
  EyeIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export const PostStats = ({ post, onShare }) => {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4">
      <div className="flex items-center space-x-1 text-sm">
        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
        <span className="text-base-content/70">{post.views || 0}</span>
      </div>

      <div className="flex items-center space-x-1 text-sm">
        <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
        <span className="text-base-content/70">{post.followers || 0}</span>
      </div>

      <div className="flex items-center space-x-1 text-sm">
        <ChatBubbleLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
        <span className="text-base-content/70">{post.comments || 0}</span>
      </div>

      <button
        className="flex items-center space-x-1 text-sm p-1 rounded-lg transition-all duration-200 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30"
        onClick={onShare}
      >
        <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary/80" />
      </button>
    </div>
  );
};