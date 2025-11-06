import React, { useEffect, useState } from 'react'
import CustomerLayout from '../Customer/CustomerLayout'
import { getProductDetailList, getSellerCategory, getSellerProductList } from '../../services/customerServices';
import { FiEdit, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { AnimatePresence, motion } from "framer-motion";
import styled from 'styled-components';
import DataTable from '../Admin/AdminLayout/DataTable';
import AddProductModalSeller from './Modal/AddProductModalSeller';
import AddDicountProductModal from './Modal/AddDicountProductModal';
import ProductStockAvalibility from './Modal/ProductStockAvalibility';
import SellerDataTable from './ReusableComponents/SellerDataTable';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { LuListX } from "react-icons/lu";
import { Ban, ListPlus, SquarePen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';

const PageContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const PageHeader = styled.h2`
  color: #1e293b;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '';
    width: 4px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const AddButton = styled(motion.button)`
  background: #005ce6;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover { 
	background: rgb(0, 72, 179);
	border-color: rgba(0, 72, 179, 0.5);
	transform: translateY(-2px);
  }
`;

const handleDeletePolicy = (policy) => {
  console.log("delete button clicked")
};

const SellerProduct = () => {
  const { productList: product, getProductDetailsList } = useCustomerAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [stockActiveModal, setStockActiveModal] = useState(false)
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const columns = [
    { key: 'image', title: 'Product', type: 'image', accessor: r => r.image },
    { key: 'product_name', title: 'Product Name', type: 'text' },
    { key: 'selling_price', title: 'Price', type: 'text', accessor: r => `₹${r.selling_price}` },
    {
      key: 'actions',
      title: 'Actions',
      type: 'actions',
      buttons: [
        {
          label: "View",
          icon: MdOutlineRemoveRedEye,
          onClick: (row) => { console.log(row) },
          size: "md",

        }
      ],
      menuItems: [
        {
          label: 'Edit',
          icon: SquarePen,
          onClick: (row) => handleEditProduct(row)
        },
        {
          label: (row) => (row.variations?.length ?? 0) === 0 ? 'Add Variation' : 'Edit Variation',
          icon: ListPlus,
          onClick: (row) => {
            const mode = (row.variations?.length ?? 0) === 0 ? 'add' : 'edit';
            handleAddVariation(row, mode);
          }
        },
        {
          label: 'Inactive',
          icon: Ban,
          onClick: (row) => console.log('Delete:', row)
        }
      ]
    }
  ]

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await getSellerCategory();
      // console.log(response);
      setCategoryList(response)
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProductData(product);
    navigate("/seller-EditProduct", { state: { productData: product } });
    // console.log(product)
  };
  const handleAddVariation = (product) => {
    setSelectedProductData(product);
    navigate("/seller-AddVariation", { state: { productData: product } });
    // console.log(product)
  };

  useEffect(() => {
    getProductDetailsList();
    fetchCategoryData();
  }, []);
  return (
    <CustomerLayout>
      <>
        <PageContainer>
          {/* <DataTable
          spiritual={true}
          data={product}
          columns={columns}
          loading={loading}
          pagination={true}
          onEdit={handleEditPolicy}
          onDelete={handleDeletePolicy}
          emptyIcon="🔄"
          emptyTitle="No Product Found"
          emptyDescription="To add a new Product Click on Add product button"
          isDiscountButtonShow={true}
          setShowDiscountModal={setStockActiveModal}
          ButtonLable="Change Product Visibility"
        /> */}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>

            <PageHeader>Product List</PageHeader>

            <AddButton
              onClick={() => navigate("/seller-AddProduct")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus />
              Add New Product
            </AddButton>
          </div>


          <SellerDataTable
            columns={columns}
            data={product}
            filters={{
              search: { placeholder: 'Search by name or SKU...', keys: ['product_name', 'sku'] },
              selects: [
                {
                  id: 'status', label: 'Status', key: 'status', options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Pending', value: 'pending' }
                  ]
                }
              ],
            }}
            pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
          />

        </PageContainer>

        {/* <AnimatePresence>
          {showAddModal && (
            <AddProductModalSeller
              // policy={selectedPolicy}
              onClose={() => setShowAddModal(false)}
              onSuccess={() => { setShowAddModal(false); fetchData(); }}
              product={product}
              selectedProduct={selectedProductData}
            />
          )}
        </AnimatePresence> */}

        <AnimatePresence>
          {showDiscountModal && (
            <AddDicountProductModal
              // policy={selectedPolicy}
              onClose={() => setShowDiscountModal(false)}
              onSuccess={() => { setShowDiscountModal(false) }}
              product={product}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stockActiveModal && (
            <ProductStockAvalibility
              // policy={selectedPolicy}
              product={product}
              onClose={() => setStockActiveModal(false)}
              onSuccess={() => { setStockActiveModal(false) }}
            />
          )}
        </AnimatePresence>
      </>
    </CustomerLayout>
  )
}

export default SellerProduct