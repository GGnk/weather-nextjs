const SkeletonDescriptionWeather = () => {
  return (
    <div className="border border-blue-300 shadow rounded-md p-4">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <div className="bg-slate-700 rounded h-2 w-2/4"></div>
          <div className="bg-slate-700 h-2 rounded w-full"></div>
          <div className="bg-slate-700 h-2 rounded w-full"></div>
          <div className="bg-slate-700 h-2 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDescriptionWeather;
