
const ChartSkeleton = () => {
  return (
    <div className="chart-container">
      <div className="mb-4 flex justify-between">
        <div className="skeleton h-8 w-1/3 rounded-md"></div>
        <div className="skeleton h-8 w-1/5 rounded-md"></div>
      </div>
      <div className="skeleton h-[300px] w-full rounded-md"></div>
      <div className="mt-4 flex justify-between">
        <div className="skeleton h-6 w-1/6 rounded-md"></div>
        <div className="skeleton h-6 w-1/6 rounded-md"></div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
