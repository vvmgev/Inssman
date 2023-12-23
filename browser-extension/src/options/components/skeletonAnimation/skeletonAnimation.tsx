const SkeletonAnimation = ({ children }) => {
  return (
    <div className="relative py-2 space-y-5 overflow-hidden shadow-xl bg-gradient-to-r from-transparent to-transparent shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:border-t before:border-sky-400 before:bg-gradient-to-r before:from-transparent before:via-sky-400 before:to-transparent">
      {children}
    </div>
  );
};

export default SkeletonAnimation;
