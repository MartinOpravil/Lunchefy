import { Loader } from "lucide-react";
import React from "react";

const LoaderSpiner = () => {
  return (
    <div className="flex-center">
      <Loader className="animate-spin text-white" size={30} />
    </div>
  );
};

export default LoaderSpiner;
