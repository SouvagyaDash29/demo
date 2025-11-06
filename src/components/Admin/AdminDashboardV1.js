import React, { useEffect, useState } from "react";
import {
  FiHome,
  FiTrendingUp,
  FiClock,
  FiCalendar,
  FiSearch,
  FiMoreVertical,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiFile,
  FiMail,
  FiPhone,
  FiCalendar as FiCal,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiEdit,
  FiSlash,
} from "react-icons/fi";
import styled from "styled-components";
import {
  getServiceBookings,
  getSellerTempleList,
  updateSellerStatus,
  getSellerCategory,
} from "../../services/customerServices";
import { getCurrentTempleId } from "../../services/serviceUtils";
import { BiCategoryAlt } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import AddCategoryModal from "./Modals/AddCategoryModal";
import DataTable from "./AdminLayout/DataTable";
import StatusBadges from "./AdminLayout/StatusBadges";
import Button from "../Reusecomponets/Button";
import Modal from "../Seller/Modal/Modal";
import { ActionDropdown } from "./AdminLayout/CompactActionMenu";
// Approvals now sourced from customer API via getSellerTempleList

const DashboardContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.875rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
  min-height: 120px;
`;

const StatGradient = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  transform: translate(40px, -40px);
  opacity: 0.1;
  background: ${(props) => props.gradient};
`;

const StatContent = styled.div`
  position: relative;
  z-index: 1;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${(props) => props.color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color};
`;

const StatNumber = styled.div`
  font-size: clamp(1.1rem, 1.8vw, 1.5rem);
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.4rem;
  line-height: 1;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const ChangeText = styled.div``; // Removed inner styling as change stats are not used
const PeriodText = styled.span``; // Kept placeholder to avoid JSX changes

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  background: white;
  padding: 0.6rem;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  width: fit-content;
  border: 1px solid #f1f5f9;
  overflow-x: auto;
  white-space: nowrap;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  border-radius: 10px;
  border: none;
  background: ${(props) => (props.active ? "#0056d6" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 40px;

  &:hover {
    background: ${(props) => (props.active ? "#0056d6" : "#f8fafc")};
  }
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  min-height: 40px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.85rem;
  color: #334155;
  background: transparent;

  &::placeholder {
    color: #94a3b8;
  }
`;

const SelectFilter = styled.select`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  background: white;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  outline: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  min-height: 40px;
  min-width: 120px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const TableWrapper = styled.div`
  overflow: visible;
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
`;

const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
`;

const HeaderRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
`;

const HeaderCell = styled.th`
  padding: 1.2rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  text-align: left;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: ${(props) => (props.last ? "none" : "1px solid #f1f5f9")};
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 1.2rem 0.75rem;
  vertical-align: middle;
`;

const ActionPill = styled.button`
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: ${(props) =>
    props.variant === "accept"
      ? "#ecfdf5"
      : props.variant === "reject"
      ? "#fee2e2"
      : "white"};
  color: ${(props) =>
    props.variant === "accept"
      ? "#065f46"
      : props.variant === "reject"
      ? "#991b1b"
      : "#334155"};
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.98);
  }
`;

const ServiceBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${(props) => (props.service === "Hall" ? "#eff6ff" : "#f0fdf4")};
  color: ${(props) => (props.service === "Hall" ? "#0056d6" : "#16a34a")};
  text-align: center;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${(props) => {
    switch (props.status) {
      case "Confirmed":
        return "#ecfdf5";
      case "Pending":
        return "#fef3c7";
      case "Cancelled":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Confirmed":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  }};
  text-align: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #334155;
  }
`;

// Premium Seller Approvals Design
const SellerCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SellerCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.2);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => {
      if (props.status === "approved")
        return "linear-gradient(90deg, #10b981, #34d399)";
      if (props.status === "pending")
        return "linear-gradient(90deg, #f59e0b, #fbbf24)";
      if (props.status === "rejected")
        return "linear-gradient(90deg, #ef4444, #f87171)";
      return "linear-gradient(90deg, #6b7280, #9ca3af)";
    }};
  }
`;

const SellerHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SellerDetails = styled.div`
  flex: 1;
`;

const SellerRefCode = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SellerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(props) => {
    if (props.status === "approved")
      return "linear-gradient(135deg, #ecfdf5, #d1fae5)";
    if (props.status === "pending")
      return "linear-gradient(135deg, #fffbeb, #fef3c7)";
    if (props.status === "rejected")
      return "linear-gradient(135deg, #fef2f2, #fee2e2)";
    return "linear-gradient(135deg, #f3f4f6, #e5e7eb)";
  }};
  color: ${(props) => {
    if (props.status === "approved") return "#065f46";
    if (props.status === "pending") return "#92400e";
    if (props.status === "rejected") return "#991b1b";
    return "#6b7280";
  }};
  border: 1px solid
    ${(props) => {
      if (props.status === "approved") return "rgba(16, 185, 129, 0.2)";
      if (props.status === "pending") return "rgba(245, 158, 11, 0.2)";
      if (props.status === "rejected") return "rgba(239, 68, 68, 0.2)";
      return "rgba(107, 114, 128, 0.2)";
    }};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SellerContact = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(248, 250, 252, 0.5);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #475569;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
`;

const DocumentsSection = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
`;

const SectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
`;

const DocumentThumb = styled.a`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  aspect-ratio: 1;
  display: block;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    border-color: #3b82f6;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);

    &::after {
      content: "View";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.8rem;
      backdrop-filter: blur(4px);
    }
  }
`;

const DocumentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const DocumentPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ActionSection = styled.div`
  padding: 1.5rem;
  background: rgba(248, 250, 252, 0.3);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PremiumButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  ${(props) => {
    if (props.variant === "approve") {
      return `
        background: white;
        color: #059669;
        border-color: #34d399;
        box-shadow: 0 1px 2px rgba(16, 185, 129, 0.12);
        
        &:hover {
          background: rgba(16, 185, 129, 0.06);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.12);
        }
        &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25); }
      `;
    } else if (props.variant === "reject") {
      return `
        background: white;
        color: #b91c1c;
        border-color: #f87171;
        box-shadow: 0 1px 2px rgba(239, 68, 68, 0.12);
        
        &:hover {
          background: rgba(239, 68, 68, 0.06);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.12);
        }
        &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25); }
      `;
    } else if (props.variant === "activate") {
      return `
        background: white;
        color: #1d4ed8;
        border-color: #60a5fa;
        box-shadow: 0 1px 2px rgba(59, 130, 246, 0.12);
        
        &:hover {
          background: rgba(59, 130, 246, 0.06);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.12);
        }
        &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); }
      `;
    } else if (props.variant === "deactivate") {
      return `
        background: white;
        color: #ef4444;
        border-color: #ef4444;
        box-shadow: 0 1px 2px rgba(107, 114, 128, 0.12);
        
        &:hover {
          background: rgba(239, 68, 68, 0.06);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(107, 114, 128, 0.12);
        }
        &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25); }
      `;
    }
  }}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const LoaderWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
`;
const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const FullscreenLoader = styled.div`
  position: absolute;
  inset: 0;
  background: #ffffff;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerXL = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
  min-width: 100%;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.3;
`;

const EmptyTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  background: white;
  padding: 1.2rem 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PaginationText = styled.div`
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
`;

const PaginationButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// View Modal
const ViewOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;
const ViewCard = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;
const ViewHeader = styled.div`
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 800;
  color: #0f172a;
`;
const ViewBody = styled.div`
  padding: 16px 20px;
`;
const CloseX = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: ${(props) => (props.active ? "#0056d6" : "white")};
  color: ${(props) => (props.active ? "white" : "#64748b")};
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 36px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => (props.active ? "#0056d6" : "#f8fafc")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddCategoryButton = styled(motion.button)`
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

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 12px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const AdminDashboard = () => {
  const [templeId, setTempleId] = React.useState(
    () => getCurrentTempleId() || ""
  );
  const [activeTab, setActiveTab] = React.useState("total");
  const [serviceFilter, setServiceFilter] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(5);
  const [apiBookings, setApiBookings] = React.useState([]);
  const [bookingsLoading, setBookingsLoading] = React.useState(true);
  const [sellerTabData, setSellerTabData] = React.useState({
    loading: false,
    rows: [],
    error: null,
  });
  const [category,setCategory] = useState([]);
  const [showAddCategoryModal,setShowAddCategoryModal] = useState(false);
const [modalState, setModalState] = useState({
  show: false,
  selectedSeller: null,
  actionType: '',
  remark: '' // you can even include remark here
});
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [categorySearch,setCategorySearch] = useState("");
  const [sellerSearch, setSellerSearch] = React.useState("");
  const [sellerPage, setSellerPage] = React.useState(1);
  const [sellerPerPage] = React.useState(5);
  const [viewItem, setViewItem] = React.useState(null);
  const id = localStorage.getItem("templeId");
  const name = "admin";

  // Keep templeId in sync with any login switches
  React.useEffect(() => {
    const refreshTempleId = () => setTempleId(getCurrentTempleId() || "");
    window.addEventListener("storage", refreshTempleId);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refreshTempleId();
    });
    window.addEventListener("focus", refreshTempleId);
    return () => {
      window.removeEventListener("storage", refreshTempleId);
      window.removeEventListener("focus", refreshTempleId);
    };
  }, []);

  const parseApiDate = (ddmmyyyy) => {
    if (!ddmmyyyy) return null;
    const [dd, mm, yyyy] = String(ddmmyyyy).split("-");
    const d = parseInt(dd, 10);
    const m = parseInt(mm, 10) - 1;
    const y = parseInt(yyyy, 10);
    if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return null;
    return new Date(y, m, d);
  };

  React.useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setBookingsLoading(true);
        const data = await getServiceBookings(id, name);
        const raw =
          (Array.isArray(data) && data) ||
          data?.results ||
          data?.data ||
          data?.bookings ||
          data?.items ||
          [];
        if (!Array.isArray(raw)) {
          console.warn("Unexpected bookings payload shape:", data);
        }
        const normalized = raw
          // 1) Scope to logged-in temple
          .filter(
            (b) =>
              (b?.service_data?.temple_id || b?.service_data?.templeId) ===
              templeId
          )
          // 2) Normalize fields for UI and filters
          .map((b) => {
            const svcRaw = (
              b?.service_data?.service_type_str ||
              b?.service_data?.service_type ||
              ""
            )
              .toString()
              .toUpperCase();
            const svcType = svcRaw.includes("HALL")
              ? "Hall"
              : svcRaw.includes("PUJA")
              ? "Puja"
              : b?.service_data?.service_type_str || "Service";
            const dateObj = parseApiDate(b?.booking_date);
            const y = dateObj ? dateObj.getFullYear() : "";
            const m = dateObj
              ? String(dateObj.getMonth() + 1).padStart(2, "0")
              : "";
            const d = dateObj ? String(dateObj.getDate()).padStart(2, "0") : "";
            const hhmm = (b?.start_time || "").slice(0, 5);
            return {
              id: b?.ref_code || b?.id || "",
              service: svcType, // 2) Hall | Puja for filters
              devotee: b?.customer_data?.name || "",
              contact: b?.customer_data?.mobile_number || "",
              title: b?.service_data?.name || "",
              dateTime: y ? `${y}-${m}-${d}${hhmm ? ` ${hhmm}:00` : ""}` : "",
              status: b?.status_display || b?.status || "",
              amount: b?.unit_price
                ? `₹${b.unit_price}`
                : b?.price
                ? `₹${b.price}`
                : "-",
              templeId:
                b?.service_data?.temple_id || b?.service_data?.templeId || "",
              // 3) Capture variation id to allow counting/grouping by variation if needed
              variationId: b?.service_variation_data?.id || null,
              raw: b,
            };
          });
        if (mounted) {
          setApiBookings(normalized);
        }
      } catch (_) {
        // Silently ignore for now; no error UI
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [templeId]);

  const stats = [
    {
      icon: <FiTrendingUp />,
      number: String(apiBookings.length),
      label: "Total Bookings",
      color: "#0056d6",
      bgGradient: "linear-gradient(135deg, #0056d6 0%, #0070f3 100%)",
    },
    {
      icon: <FiClock />,
      number: String(
        apiBookings.filter((b) => {
          if (!b.dateTime) return false;
          const dt = new Date(b.dateTime.replace(" ", "T"));
          const now = new Date();
          return (
            dt.getFullYear() === now.getFullYear() &&
            dt.getMonth() === now.getMonth() &&
            dt.getDate() === now.getDate()
          );
        }).length
      ),
      label: "Today's Bookings",
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    },
    {
      icon: <FiHome />,
      number: "2",
      label: "Authorized Sellers",
      color: "#f59e0b", // amber/golden
      bgGradient: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
    },
  ];

  const allBookings = React.useMemo(() => apiBookings, [apiBookings]);

  const isToday = (iso) => {
    const d = new Date(iso.replace(" ", "T"));
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(" ", "T"));
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const filteredBookings = React.useMemo(() => {
    // Filter by temple ID first
    let base = allBookings.filter((b) => b.templeId === templeId);

    // Filter by tab (total vs today)
    if (activeTab === "today") {
      base = base.filter((b) => isToday(b.dateTime));
    }

    // Filter by service (Hall | Puja)
    if (serviceFilter !== "All") {
      base = base.filter((b) => b.service === serviceFilter);
    }

    // Filter by search
    const q = search.trim().toLowerCase();
    if (q) {
      base = base.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.devotee.toLowerCase().includes(q) ||
          b.title.toLowerCase().includes(q)
      );
    }

    return base;
  }, [allBookings, templeId, activeTab, serviceFilter, search]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, serviceFilter, search]);

  // Load sellers when approvals tab is active
  const loadSellers = async () => {
    if (activeTab !== "approvals") return;
    setSellerTabData((s) => ({ ...s, loading: true, error: null }));
    try {
      const list = await getSellerTempleList();
      const rawArr = Array.isArray(list)
        ? list
        : list?.results || list?.data || [];
      // Filter by current templeId
      const scoped = rawArr.filter(
        (item) => String(item.temple_id) === String(templeId)
      );
      const rows = scoped.map((r, idx) => {
        const docs = [
          r.document_file_1,
          r.document_file_2,
          r.document_file_3,
        ].filter(Boolean);
        const approved =
          typeof r.is_approved === "boolean"
            ? r.is_approved
            : String(r.is_approved).toLowerCase() === "true";
        const active =
          typeof r.is_active === "boolean"
            ? r.is_active
            : String(r.is_active).toLowerCase() === "true";
        return {
          id: r.seller_ref_code || `S-${idx + 1}`,
          seller_ref_code: r.seller_ref_code || "",
          seller_name: r.seller_name || "",
          seller_email: r.seller_email || "",
          seller_phone: r.seller_phone || "",
          documents: docs,
          is_approved: approved,
          is_active: active,
          raw: r,
        };
      });
      setSellerTabData({ loading: false, rows, error: null });
    } catch (e) {
      setSellerTabData({
        loading: false,
        rows: [],
        error: e?.message || "Failed to load",
      });
    }
  };
  React.useEffect(() => {
    loadSellers();
  }, [activeTab]);

  const filteredSellers = React.useMemo(() => {
    const q = sellerSearch.trim().toLowerCase();
    let base = sellerTabData.rows;
    if (q) {
      base = base.filter(
        (r) =>
          r.seller_name.toLowerCase().includes(q) ||
          r.seller_ref_code.toLowerCase().includes(q) ||
          (r.seller_email && r.seller_email.toLowerCase().includes(q)) ||
          (r.seller_phone && r.seller_phone.toLowerCase().includes(q))
      );
    }
    return base;
  }, [sellerTabData.rows, sellerSearch]);

  const sellerIndexLast = sellerPage * sellerPerPage;
  const sellerIndexFirst = sellerIndexLast - sellerPerPage;
  const sellerCurrent = filteredSellers.slice(
    sellerIndexFirst,
    sellerIndexLast
  );
  const sellerTotalPages =
    Math.ceil(filteredSellers.length / sellerPerPage) || 1;

  const [processingAction, setProcessingAction] = React.useState(null);

  const handleSellerAction = async (row, action, remark) => {
    setProcessingAction(`${row.seller_ref_code}-${action}`);

    const currentTemple =
      templeId || row.raw?.temple_id || row.raw?.templeId || row.temple_id;
    let call_mode;

    if (action === "approve") {
      call_mode = "APPROVE";
    } else if (action === "reject") {
      call_mode = "REJECT";
    } else if (action === "inactive") {
      call_mode = "INACTIVE";
    } else if (action === "modify") {
      call_mode = "ACTION_NEEDED";
    } else if (action === "active") {
      call_mode = "APPROVE";
    }

    try {
      const payload = {
        temple_id: currentTemple,
        call_mode,
        seller_ref_code: row.seller_ref_code,
        remark
      };
      // if (action === "approve" || action === "active" || action === "activate", action === "modify") {
      //   payload.approval_remarks = remark;
      // } else {
      //   payload.cancel_remarks = remark;
      // }

      await updateSellerStatus(payload);

      loadSellers();

      // console.log({
      //   temple_id: currentTemple,
      //   call_mode,
      //   seller_ref_code: row.seller_ref_code,
      //   remarks: remark
      // })

      // Optimistic UI update to immediately reflect new status
      // setSellerTabData((prev) => {
      //   const rows = (prev.rows || []).map((item) => {
      //     if (item.seller_ref_code !== row.seller_ref_code) return item;
      //     const updated = { ...item };
      //     if (action === "approve") {
      //       updated.is_approved = true;
      //       updated.is_active = true; // treat approve as active
      //     } else if (action === "reject") {
      //       updated.is_approved = false; // flip to unapproved
      //       updated.is_active = false; // rejected = inactive
      //     } else if (action === "activate") {
      //       updated.is_approved = true;
      //       updated.is_active = true;
      //     } else if (action === "deactivate") {
      //       updated.is_approved = true; // stays approved
      //       updated.is_active = false;
      //     }
      //     return updated;
      //   });
      //   return { ...prev, rows };
      // });
    } catch (e) {
      console.error("Failed to update seller status:", e);
    } finally {
      setProcessingAction(null);
    }
  };

  const getSellerStatus = (seller) => {
    if (seller.is_approved) return "approved";
    if (!seller.is_approved && seller.is_active) return "pending";
    return "rejected";
  };

  const getSellerStatusText = (seller) => {
    if (seller.is_approved) return "Approved";
    if (!seller.is_approved && seller.is_active) return "Pending";
    return "Rejected";
  };

    const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await getSellerCategory();
      setCategory(response)
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchCategoryData();
    }, []);

  const columns = [
    {
      key: "image",
      title: "Category Image",
      render: (value, item) => (
        <>
            <img src={value} alt={value} style={{width: "15%", aspectRatio: "3/4", objectFit: "contain"}} />
        </>
      ),
    },
    {
      key: "name",
      title: "Category Name",
      render: (rules) => (
        <div>
          {rules}
        </div>
      ),
    },
    {
      key: "tax_rate",
      title: "Tax Rate",
    },
    {
      key: "gst_applicable",
      title: "GST Applicable",
       render: (value) => <StatusBadges value={value} trueLabel="Yes" falseLabel="No" />,
    },
    {
      key: "discount_applicable",
      title: "Discount Applicable",
       render: (value) => <StatusBadges value={value} trueLabel="Yes" falseLabel="No" />,
    },
    {
      key: "is_active",
      title: "Status",
      render: (value) => <StatusBadges value={value} />,
    },
  ];

  // Open modal function
const openRemarkModal = (seller, action) => {
  console.log("openmodal", {
    show: true,
    selectedSeller: seller,
    actionType: action,
    remark: ''
  })
  setModalState({
    show: true,
    selectedSeller: seller,
    actionType: action,
    remark: ''
  });
};

// Close modal function
const closeRemarkModal = () => {
  setModalState({
    show: false,
    selectedSeller: null,
    actionType: '',
    remark: ''
  });
};

// Update remark
const updateRemark = (remark) => {
  setModalState(prev => ({
    ...prev,
    remark
  }));
};

// Handle modal submit
const handleModalSubmit = () => {
  if (!modalState.remark.trim()) {
    alert('Please enter a remark');
    return;
  }

  console.log("handleModalSubmit",modalState.selectedSeller, modalState.actionType, modalState.remark)
  
  if (modalState.selectedSeller) {
    handleSellerAction(modalState.selectedSeller, modalState.actionType, modalState.remark);
    closeRemarkModal();
  }
};

  return (
    <DashboardContainer>
      <MainContent>
        {(bookingsLoading || sellerTabData.loading) && (
          <FullscreenLoader>
            <SpinnerXL />
          </FullscreenLoader>
        )}
        {/* Stats Grid */}
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatGradient gradient={stat.bgGradient} />
              <StatContent>
                <StatHeader>
                  <StatIcon color={stat.color}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </StatIcon>
                </StatHeader>

                <StatNumber>{stat.number}</StatNumber>

                <StatLabel>{stat.label}</StatLabel>

                <StatChange>
                  <ChangeText type={stat.changeType}>
                    {stat.changeType === "increase" ? (
                      <FiArrowUp size={14} />
                    ) : stat.changeType === "decrease" ? (
                      <FiArrowDown size={14} />
                    ) : null}
                    {stat.change}
                  </ChangeText>
                  <PeriodText>{stat.period}</PeriodText>
                </StatChange>
              </StatContent>
            </StatCard>
          ))}
        </StatsGrid>

        {/* Tabs */}
        <TabsContainer>
          {[
            {
              key: "total",
              label: "Total Bookings",
              icon: <FiTrendingUp size={18} />,
            },
            {
              key: "today",
              label: "Today's Bookings",
              icon: <FiCalendar size={18} />,
            },
            {
              key: "approvals",
              label: "Seller Approvals",
              icon: <FiHome size={18} />,
            },
            {
              key: "category",
              label: "Product Category",
              icon: <BiCategoryAlt size={18} />,
            },
          ].map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </TabButton>
          ))}
        </TabsContainer>

        {/* Controls */}
        {activeTab === "category" ? (
          <ControlsContainer>
            {/* Search input
            <SearchContainer>
              <FiSearch size={20} color="#64748b" />
              <SearchInput
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </SearchContainer> */}

            {/* Add category button */}
            {/* <AddCategoryButton onClick={() => setShowAddCategoryModal(true)}>
              <FiPlus size={18} />
              Add Category
            </AddCategoryButton> */}
          </ControlsContainer>
        ) :activeTab !== "approvals" ? (
          <ControlsContainer>
            <SearchContainer>
              <FiSearch size={20} color="#64748b" />
              <SearchInput
                type="text"
                placeholder="Search bookings, devotees, services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchContainer>

            <SelectFilter
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="All">All Services</option>
              <option value="Hall">Halls</option>
              <option value="Puja">Puja Services</option>
            </SelectFilter>
          </ControlsContainer>
        ) : (
          <ControlsContainer>
            <SearchContainer>
              <FiSearch size={20} color="#64748b" />
              <SearchInput
                type="text"
                placeholder="Search sellers by name, email, mobile..."
                value={sellerSearch}
                onChange={(e) => setSellerSearch(e.target.value)}
              />
            </SearchContainer>
          </ControlsContainer>
        )}

        {/* Main Table Area */}
        <TableWrapper>
          <TableContainer>
            {/* Table Header */}
            {activeTab == "category" ?
            <TableHeader>
                {/* <HeaderRow>
                  <HeaderCell>Category Image</HeaderCell>
                  <HeaderCell>Category Name</HeaderCell>
                  <HeaderCell>Tax Rate</HeaderCell>
                  <HeaderCell>GST Applicable</HeaderCell>
                  <HeaderCell>Discount Applicable</HeaderCell>
                  <HeaderCell>Active</HeaderCell>
                  <HeaderCell>Actions</HeaderCell>
                </HeaderRow> */}
              </TableHeader>
            : activeTab !== "approvals" ? (
              <TableHeader>
                <HeaderRow>
                  <HeaderCell>Service</HeaderCell>
                  <HeaderCell>Booking ID</HeaderCell>
                  <HeaderCell>Devotee</HeaderCell>
                  <HeaderCell>Date & Time</HeaderCell>
                  <HeaderCell>Actions</HeaderCell>
                </HeaderRow>
              </TableHeader>
            ) : (
              <TableHeader>
                <HeaderRow>
                  <HeaderCell>Seller Ref Code</HeaderCell>
                  <HeaderCell>Seller Name</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>Documents</HeaderCell>
                  <HeaderCell>Actions</HeaderCell>
                </HeaderRow>
              </TableHeader>
            )}

            {/* Table Body */}
            <TableBody>
              {activeTab === "category" ?
               <DataTable
                  data={category}
                  columns={columns}
                  loading={loading}
                  pagination={true}
                  onEdit={() => console.log("button click")}
                  onDelete={() => console.log("button click")}
                  emptyIcon="🔄"
                  emptyTitle="No Product Found"
                  emptyDescription="To add a new Product Click on Add product button"
                  isDiscountButtonShow={true}
                  setShowDiscountModal={() => setShowAddCategoryModal(true)}
                  ButtonLable="Add Category"
                />
              :activeTab !== "approvals" ? (
                bookingsLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      style={{ textAlign: "center", padding: "3rem" }}
                    >
                      <LoaderWrap>
                        <Spinner />
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>
                          Loading bookings...
                        </span>
                      </LoaderWrap>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      last={index === currentItems.length - 1}
                    >
                      <TableCell>
                        <ServiceBadge service={booking.service}>
                          {booking.service}
                        </ServiceBadge>
                      </TableCell>

                      <TableCell
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: "700",
                          color: "#334155",
                        }}
                      >
                        {booking.id}
                      </TableCell>

                      <TableCell>
                        <div
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: "700",
                            color: "#1e293b",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {booking.devotee}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#64748b",
                          }}
                        >
                          {booking.contact}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            color: "#1e293b",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {formatDate(booking.dateTime)}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#64748b",
                          }}
                        >
                          {new Date(
                            booking.dateTime.replace(" ", "T")
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                          }}
                        >
                          <ActionButton onClick={() => setViewItem(booking)}>
                            <FiEye size={16} />
                          </ActionButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : sellerTabData.loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ textAlign: "center", padding: "3rem" }}
                  >
                    <LoadingSpinner />
                    <div
                      style={{
                        marginTop: "1rem",
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#64748b",
                      }}
                    >
                      Loading seller applications...
                    </div>
                  </TableCell>
                </TableRow>
              ) : sellerCurrent.length > 0 ? (
                sellerCurrent.map((seller, index) => (
                  <TableRow
                    key={seller.id}
                    last={index === sellerCurrent.length - 1}
                  >
                    <TableCell>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: "#1e293b",
                          fontFamily: "monospace",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {seller.seller_ref_code}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "#1e293b",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {seller.seller_name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem",
                        }}
                      >
                        {seller.seller_email && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontSize: "0.8rem",
                              color: "#64748b",
                            }}
                          >
                            <FiMail size={12} />
                            <span>{seller.seller_email}</span>
                          </div>
                        )}
                        {seller.seller_phone && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontSize: "0.8rem",
                              color: "#64748b",
                            }}
                          >
                            <FiPhone size={12} />
                            <span>{seller.seller_phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {/* <StatusIndicator status={getSellerStatus(seller)}>
                        {getSellerStatusText(seller)}
                      </StatusIndicator> */}
                      <StatusBadges value={seller.raw.status_display} />
                    </TableCell>

                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {seller.documents.length > 0 ? (
                          seller.documents.map((doc, docIndex) => (
                            <a
                              key={docIndex}
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-block",
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "2px solid #e2e8f0",
                                transition: "none",
                                textDecoration: "none",
                              }}
                            >
                              <img
                                src={doc}
                                alt={`Document ${docIndex + 1}`}
                                style={{
                                  width: "60px",
                                  height: "40px",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </a>
                          ))
                        ) : (
                          <div
                            style={{
                              color: "#9ca3af",
                              fontSize: "0.85rem",
                              fontStyle: "italic",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <FiFile size={14} />
                            No documents
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                       <ActionDropdown
                          seller={seller} 
                          processingAction={processingAction}
                          openRemarkModal={openRemarkModal}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ textAlign: "center", padding: "3rem" }}
                  >
                    <EmptyIcon>🧾</EmptyIcon>
                    <EmptyTitle>No seller applications found</EmptyTitle>
                    <div style={{ fontSize: "0.95rem", color: "#64748b" }}>
                      {sellerSearch
                        ? "Try adjusting your search query"
                        : "All seller applications have been processed"}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableContainer>

          {activeTab !== "approvals"
            ? filteredBookings.length === 0 && (
                <EmptyState>
                  <EmptyIcon>📋</EmptyIcon>
                  <EmptyTitle>No bookings found</EmptyTitle>
                  <div style={{ fontSize: "0.95rem" }}>
                    Try adjusting your search or filters
                  </div>
                </EmptyState>
              )
            : null}
        </TableWrapper>

        {/* Pagination */}
        {activeTab !== "category" && (
          <>
          {activeTab !== "approvals"
          ? filteredBookings.length > 0 && (
              <PaginationContainer>
                <PaginationText>
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredBookings.length)} of{" "}
                  {filteredBookings.length} results
                </PaginationText>

                <PaginationButtons>
                  <PaginationButton
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft size={16} />
                  </PaginationButton>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <PaginationButton
                        key={number}
                        onClick={() => paginate(number)}
                        active={currentPage === number}
                      >
                        {number}
                      </PaginationButton>
                    )
                  )}

                  <PaginationButton
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    <FiChevronRight size={16} />
                  </PaginationButton>
                </PaginationButtons>
              </PaginationContainer>
            )
          : filteredSellers.length > 0 && (
              <PaginationContainer>
                <PaginationText>
                  Showing {sellerIndexFirst + 1} to{" "}
                  {Math.min(sellerIndexLast, filteredSellers.length)} of{" "}
                  {filteredSellers.length} results
                </PaginationText>
                <PaginationButtons>
                  <PaginationButton
                    onClick={() => setSellerPage(Math.max(1, sellerPage - 1))}
                    disabled={sellerPage === 1}
                  >
                    <FiChevronLeft size={16} />
                  </PaginationButton>
                  {Array.from(
                    { length: sellerTotalPages },
                    (_, i) => i + 1
                  ).map((number) => (
                    <PaginationButton
                      key={number}
                      onClick={() => setSellerPage(number)}
                      active={sellerPage === number}
                    >
                      {number}
                    </PaginationButton>
                  ))}
                  <PaginationButton
                    onClick={() =>
                      setSellerPage(Math.min(sellerTotalPages, sellerPage + 1))
                    }
                    disabled={sellerPage === sellerTotalPages}
                  >
                    <FiChevronRight size={16} />
                  </PaginationButton>
                </PaginationButtons>
              </PaginationContainer>
            )}
            </>
            )}
      </MainContent>
      {viewItem && (
        <ViewOverlay onClick={() => setViewItem(null)}>
          <ViewCard onClick={(e) => e.stopPropagation()}>
            <ViewHeader>
              <div>Booking Details – {viewItem.id}</div>
              <CloseX onClick={() => setViewItem(null)}>×</CloseX>
            </ViewHeader>
            <ViewBody>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <strong>Service</strong>
                  <div>{viewItem.service}</div>
                </div>
                <div>
                  <strong>Devotee</strong>
                  <div>{viewItem.devotee}</div>
                </div>
                <div>
                  <strong>Contact</strong>
                  <div>{viewItem.contact}</div>
                </div>
                <div>
                  <strong>Service Name</strong>
                  <div>{viewItem.title}</div>
                </div>
                <div>
                  <strong>Date</strong>
                  <div>{formatDate(viewItem.dateTime)}</div>
                </div>
                <div>
                  <strong>Time</strong>
                  <div>
                    {new Date(
                      viewItem.dateTime.replace(" ", "T")
                    ).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div>
                  <strong>Status</strong>
                  <div>{viewItem.status}</div>
                </div>
                <div>
                  <strong>Amount</strong>
                  <div>{viewItem.amount}</div>
                </div>
              </div>
            </ViewBody>
          </ViewCard>
        </ViewOverlay>
      )}

      <AnimatePresence>
        {showAddCategoryModal && (
          <AddCategoryModal
            // policy={selectedPolicy}
            onClose={() => setShowAddCategoryModal(false)}
             onSuccess={() => {setShowAddCategoryModal(false)}}
            //  product = {product}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modalState.show  && (
          <Modal modalHeader="Submission Remark" onClose={closeRemarkModal}>
            <div style={{padding: "8px 10px", margin: "10px 0px"}}>
            <Input
          type="text"
          placeholder="Remark (optional)"
          value={modalState.remark}
          required
          onChange={e => updateRemark(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleModalSubmit();
            }
      }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
      <Button
        variant="outline"
        color="gray"
        size="sm"
        onClick={closeRemarkModal}
      >
        Cancel
      </Button>
      <Button
        variant="filled"
        color="green"
        size="sm"
        onClick={handleModalSubmit}
        disabled={!modalState.remark.trim()}
      >
        <FiCheckCircle size={16} />
        Confirm
      </Button>
    </div>
    </div>
          </Modal>
        )}
      </AnimatePresence>
    </DashboardContainer>
  );
};

export default AdminDashboard;
