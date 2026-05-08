interface LoadingSkeleton {
  className?: string;
}

const LoadingSkeleton = ({
  className = "aspect-[670/161]",
}: LoadingSkeleton) => {
  return (
    <div
      className={`
        bg-slate-200 
        rounded-2xl 
        animate-pulse 
        relative 
        overflow-hidden 
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};

export default LoadingSkeleton;
