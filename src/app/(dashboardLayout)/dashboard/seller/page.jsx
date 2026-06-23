import React from 'react'

const SellerOverview = () => {

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Seller Dashboard
        </h1>

        <p className="mt-2 text-gray-600 text-base max-w-2xl">
          Welcome back! Here's an overview of your marketplace activity.
          Track your products, monitor sales, view revenue, and manage pending
          orders—all from one place.
        </p>
      </div>

      {/* Dashboard Cards will go here */}
    </div>
  );
};

export default SellerOverview;
