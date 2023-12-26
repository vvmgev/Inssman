const SkeletonAnimation = ({ children }) => {
  return (
    <div
      className="overflow-hidden relative space-y-5
                bg-gradient-to-r from-transparent to-transparent py-2
                shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full
                before:animate-[shimmer_1.5s] before:border-t before:border-sky-400
                before:bg-gradient-to-r before:from-transparent before:via-sky-400 before:to-transparent"
    >
      {children}
    </div>
  );
};

export default SkeletonAnimation;
