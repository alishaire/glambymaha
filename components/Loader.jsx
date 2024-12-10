import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-row gap-2">
      <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:-.3s]"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-blue-700 [animation-delay:-.5s]"></div>
    </div>
  );
};

export default Loader;
