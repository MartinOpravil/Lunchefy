import { Loader } from "lucide-react";
import React from "react";

const LoaderSpiner = () => {
  return (
    <div className="flex-center p-3">
      <Loader className="animate-spin text-accent" size={30} />
    </div>
  );
};

export default LoaderSpiner;
