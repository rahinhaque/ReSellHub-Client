import AddProductForm from '@/components/AddProductForm';
import DashboardHeader from '@/components/DashboardHeader';
import React from 'react'

const AddProductsPage = () => {
  return (
    <div>
      <DashboardHeader
        title="Add products"
        description="Add Your products here"
      />

      {/* Add product form */}
      <AddProductForm/>
    </div>
  );
}

export default AddProductsPage
