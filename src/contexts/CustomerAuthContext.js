"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getCustomerAuth,
  clearCustomerAuth,
  isCustomerAuthenticated,
  getSellerAllList,
} from "../services/customerServices";

const CustomerAuthContext = createContext(null);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error(
      "useCustomerAuth must be used within a CustomerAuthProvider"
    );
  }
  return context;
};

export const CustomerAuthProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sellerProfile, setSellerProfile] = useState([]);
  const customerCode = localStorage.getItem("customerRefCode");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      if (isCustomerAuthenticated()) {
        const authData = getCustomerAuth();
        setCustomerData(authData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (authData) => {
    setCustomerData(authData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearCustomerAuth();
    setCustomerData(null);
    setIsAuthenticated(false);
  };

  const getSellerProfile = async () => {
    try {
      const response = await getSellerAllList();
      const filteredData = response.find((seller) => seller.cust_ref_code === customerCode)
      setSellerProfile(filteredData);
    } catch (error) {
      console.error(error)
    }
  } 

  const value = {
    customerData,
    isAuthenticated,
    loading,
    login,
    logout,
    sellerProfile,
    getSellerProfile
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};
