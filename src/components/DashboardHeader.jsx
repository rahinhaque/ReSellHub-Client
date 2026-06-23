import React from "react";

const DashboardHeader = ({ title, description }) => {
  return (
    <div className="mb-8 border-b border-gray-200 pb-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

      {description && (
        <p className="mt-2 max-w-3xl text-gray-600">{description}</p>
      )}
    </div>
  );
};

export default DashboardHeader;
