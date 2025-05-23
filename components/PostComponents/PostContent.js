export const PostContent = ({ content, imageUrl }) => {
  return (
    <div className="mt-2 mb-3">
      {content && (
        <p className="text-base-content/90 text-sm mb-3 leading-relaxed">
          {content}
        </p>
      )}
      {imageUrl && (
        <div className="rounded-lg overflow-hidden max-h-96 flex justify-center bg-gradient-to-br from-base-200 to-base-300 transition-all duration-300 hover:shadow-lg">
          <img
            src={imageUrl}
            alt="Post content"
            className="object-contain max-h-96 w-full hover:scale-[1.02] transition-transform duration-500 ease-in-out"
          />
        </div>
      )}
    </div>
  );
};