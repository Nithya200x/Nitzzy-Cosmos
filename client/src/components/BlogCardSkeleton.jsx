const BlogCardSkeleton = () => {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-lg animate-pulse">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-base-300" />
        <div className="flex-1">
          <div className="h-3 w-24 bg-base-300 rounded mb-2" />
          <div className="h-2 w-16 bg-base-300 rounded" />
        </div>
      </div>

      <div className="px-4">
        <div className="h-48 w-full bg-base-300 rounded-xl" />
      </div>

      <div className="card-body">
        <div className="h-5 w-3/4 bg-base-300 rounded mb-3" />
        <div className="h-3 w-full bg-base-300 rounded mb-2" />
        <div className="h-3 w-5/6 bg-base-300 rounded mb-4" />
        <div className="h-8 w-28 bg-base-300 rounded ml-auto" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
