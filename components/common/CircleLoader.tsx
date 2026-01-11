import { LoaderCircle } from "lucide-react";
import React from "react";

const CircleLoader = () => {
  return (
    <div className="flex justify-center items-center h-full py-3">
      <LoaderCircle className="text-gray-400 animate-spin	" />
    </div>
  );
};

export default CircleLoader;
