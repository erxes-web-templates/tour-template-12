import { AppWindowMac, Codepen } from "lucide-react";
import React from "react";

const EmptyState = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="text-center p-3 w-full text-gray-500 mx-auto">
      <div className="flex justify-center">
        <AppWindowMac strokeWidth={1.5} className="w-8 h-8" />
      </div>
      <h2 className="text-xl mb-3 mt-2">{title || "Not found"}</h2>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
};

export default EmptyState;
