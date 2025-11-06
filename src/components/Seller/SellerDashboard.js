import React, { useEffect, useState } from "react";
import CustomerLayout from "../Customer/CustomerLayout";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import styled from "styled-components";
import DataTable from "../Admin/AdminLayout/DataTable";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import AddProductModalSeller from "./Modal/AddProductModalSeller";
import { getSellerCategory, getSellerProductList } from "../../services/customerServices";

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px 24px;
  min-width: 220px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 6px;
`;

const Value = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #000;
`;

const Change = styled.div`
  font-size: 14px;
  color: ${({ positive }) => (positive ? "#16a34a" : "#dc2626")};
  margin-top: 4px;
`;
const Container = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;
const AddButton = styled(motion.button)`
  background: rgba(212, 175, 55, 0.15); /* translucent SPIRITUAL_GOLD */
  color: ${({ theme }) => theme?.text || "#2c3e50"}; /* SPIRITUAL_DEEP_BLUE as default */
  border: 2px solid rgba(212, 175, 55, 0.4);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  color: #2c3e50; /* SPIRITUAL_DEEP_BLUE */
  background-color: rgba(212, 175, 55, 0.2);

  &:hover {
    background: rgba(212, 175, 55, 0.3);
    border-color: rgba(212, 175, 55, 0.6);
    color: #b8941f; /* SPIRITUAL_GOLD_DARK */
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    background: rgba(212, 175, 55, 0.35);
    border-color: rgba(184, 148, 31, 0.7);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(230, 210, 170, 0.3); /* SPIRITUAL_SAND tint */
  }
`;

export const orders = [
  {
    id: 1,
    order_id: "ORD-1001",
    customer_name: "John Doe",
    product_name: "Ghee",
    total_amount: "₹120.00",
    status: "Delivered",
    date: "2025-10-01",
  },
  {
    id: 2,
    order_id: "ORD-1002",
    customer_name: "Emily Clark",
    product_name: "Diya",
    total_amount: "₹250.00",
    status: "Pending",
    date: "2025-10-02",
  },
  {
    id: 3,
    order_id: "ORD-1003",
    customer_name: "Michael Smith",
    product_name: "Agarbatti",
    total_amount: "₹75.00",
    status: "Cancelled",
    date: "2025-10-03",
  },
  {
    id: 4,
    order_id: "ORD-1004",
    customer_name: "Sophia Brown",
    product_name: "Flower",
    total_amount: "₹95.00",
    status: "Processing",
    date: "2025-10-05",
  },
  {
    id: 5,
    order_id: "ORD-1005",
    customer_name: "Liam Johnson",
    product_name: "Sindoor",
    total_amount: "₹450.00",
    status: "Delivered",
    date: "2025-10-06",
  },
];


const SellerDashboard = () => {
    const [showAddModal, setShowAddModal] = useState(false);
  const { customerData } = useCustomerAuth();
  const statsData = [
    { title: "Total Earnings", value: "₹12,500", change: 15 },
    { title: "Orders Received", value: "345", change: 10 },
    { title: "Products Listed", value: "78", change: 5 },
  ];

  const orderColumns = [
  {
    key: "order_id",
    title: "Order ID",
    render: (value) => <strong>{value}</strong>,
  },
  {
    key: "customer_name",
    title: "Customer",
  },
  {
    key: "product_name",
    title: "Product",
  },
  {
    key: "total_amount",
    title: "Total Amount",
  },
  {
    key: "status",
    title: "Status",
    render: (value) => {
      const statusStyles = {
        Delivered: {
          color: "#059669",
          background: "#d1fae5",
        },
        Pending: {
          color: "#b45309",
          background: "#fef3c7",
        },
        Cancelled: {
          color: "#dc2626",
          background: "#fee2e2",
        },
        Processing: {
          color: "#2563eb",
          background: "#dbeafe",
        },
      };

      const { color, background } = statusStyles[value] || {
        color: "#374151",
        background: "#f3f4f6",
      };

      return (
        <span
          style={{
            fontSize: "0.75rem",
            color,
            background,
            padding: "0.125rem 0.5rem",
            borderRadius: "9999px",
            marginTop: "0.25rem",
            display: "inline-block",
            fontWeight: "600",
          }}
        >
          {value}
        </span>
      );
    },
  },
  {
    key: "date",
    title: "Order Date",
  },
];

const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

      const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSellerProductList();
      setProduct(response);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await getSellerCategory();
        // console.log(response);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
        fetchData();
        fetchCategoryData();
      }, []);


  return (
    <CustomerLayout>
      <h4 style={{ color: "#7c8c9d", marginBottom: "10px" }}>
        Welcome Back, {customerData?.custRefCode}
      </h4>
      <Container>
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            //   change={stat.change}
          />
        ))}
      </Container>
      <div style={{marginTop: "20px"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px"}}>
            <h3>Order Overview</h3>
            <AddButton
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Add Product
          </AddButton>
        </div>
       <DataTable
       spiritual={true}
            data={orders}
            columns={orderColumns}
            loading={false}
            pagination={true}
            onEdit={(order) => console.log("Edit order:", order)}
            onDelete={(order) => console.log("Delete order:", order)}
            emptyIcon="📦"
            emptyTitle="No Orders Found"
            emptyDescription="Once customers start ordering, you’ll see them listed here."
            />

      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddProductModalSeller
            // policy={selectedPolicy}
            onClose={() => setShowAddModal(false)}
             onSuccess={() => {setShowAddModal(false);}}
             product = {product}
          />
        )}
      </AnimatePresence>

    </CustomerLayout>
  );
};

export default SellerDashboard;

export const StatsCard = ({ title, value, change }) => {
  const isPositive = change >= 0;

  return (
    <Card>
      <div>
        <Title>{title}</Title>
        <Value>{value}</Value>
      </div>
      <Change positive={isPositive}>
        {/* {isPositive ? `+${change}%` : `${change}%`} */}
      </Change>
    </Card>
  );
};
