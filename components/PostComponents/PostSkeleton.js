// components/PostSkeleton.jsx
export const PostSkeleton = () => {
  return (
    <div className="card rounded-xl p-4 border border-base-300 bg-base-100 animate-pulse">
      {/* Header Section */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-base-300"></div>
        </div>
        
        {/* Title and Metadata */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-base-300 rounded w-3/4"></div>
          <div className="flex gap-2">
            <div className="h-3 bg-base-300 rounded w-16"></div>
            <div className="h-3 bg-base-300 rounded w-16"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-2">
        {/* Text Content */}
        <div className="space-y-1">
          <div className="h-3 bg-base-300 rounded w-full"></div>
          <div className="h-3 bg-base-300 rounded w-5/6"></div>
          <div className="h-3 bg-base-300 rounded w-4/6"></div>
        </div>
        
        {/* Image Placeholder */}
        <div className="mt-2 rounded-lg bg-base-300 h-48 w-full"></div>
      </div>
    </div>
  );

};