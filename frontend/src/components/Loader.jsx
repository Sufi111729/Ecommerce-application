import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 border-2 border-ink/30 border-t-ink rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
