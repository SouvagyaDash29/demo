"use client";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiDollarSign,
  FiRefreshCw,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
} from "react-icons/fi";
import {
  MdTempleHindu,
  MdMiscellaneousServices,
  MdApproval,
} from "react-icons/md";
import { GiLotus } from "react-icons/gi";
import { getStoredFirstName } from "../../../services/authServices";
import {
  AppleIcon,
  Calendar,
  Calendar1,
  CalendarArrowDown,
  Plug,
} from "lucide-react";
import { FaPlusSquare, FaRegCalendarPlus, FaSellsy } from "react-icons/fa";

const SidebarContainer = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: linear-gradient(180deg, #0056d6 0%, #005ad1 100%);
  color: #eaf2ff;
  z-index: 1000;
  overflow: hidden;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease;
  width: ${(props) => (props.collapsed ? "80px" : "280px")};
  border-right: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    transform: translateX(${(props) => (props.mobileOpen ? "0" : "-100%")});
    width: 280px;
    transition: transform 0.3s ease;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  background: rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 1.2rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  .om-symbol {
    font-size: 2.2rem;
    color: #ffffff;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.35));
    position: relative;
  }

  .brand-text {
    display: ${(props) => (props.collapsed ? "none" : "block")};

    .title {
      font-size: 1.3rem;
      font-weight: 700;
      margin: 0;
      color: #ffffff;
      letter-spacing: 0.5px;
    }

    .subtitle {
      font-size: 0.75rem;
      color: #dbeafe;
      margin: 0;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .admin-name {
      font-size: 0.75rem;
      color: #eaf2ff;
      margin-top: 0.25rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.08);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const MenuSection = styled.div`
  margin-bottom: 1.8rem;
  position: relative;
`;

const SectionTitle = styled.div`
  padding: 0 1.5rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 850;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #bfdbfe;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: ${(props) => (props.collapsed ? "none" : "block")};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 1rem;
    right: 1rem;
    bottom: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
    );
  }
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: ${(props) => (props.active ? "#0f172a" : "#eaf2ff")};
  background: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.92)" : "transparent"};
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  margin: 0 0.5rem;
  border-radius: 6px;

  &:hover {
    background: ${(props) =>
      props.active ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.12)"};
    color: ${(props) => (props.active ? "#0f172a" : "#ffffff")};
    transform: ${(props) =>
      props.collapsed ? "translateX(0)" : "translateX(4px)"};
  }

  .icon {
    font-size: 1.3rem;
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => (props.active ? "#0f172a" : "#dbeafe")};
  }

  .label {
    margin-left: 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    display: ${(props) => (props.collapsed ? "none" : "block")};
  }

  .badge {
    margin-left: auto;
    background: #ef4444;
    color: #ffffff;
    font-size: 0.7rem;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    min-width: 1rem;
    height: 1rem;
    display: ${(props) => (props.collapsed ? "none" : "flex")};
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(17, 24, 39, 0.95);
  color: #ffffff;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  margin-left: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 1001;
  border: 1px solid rgba(255, 255, 255, 0.12);

  &::before {
    content: "";
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: rgba(17, 24, 39, 0.95);
  }
`;

const BellIconDecor = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
`;

const AdminSidebar = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const location = useLocation();
  const firstName = getStoredFirstName();
  const [hoveredItem, setHoveredItem] = useState(null);
  const username = localStorage.getItem("username");

  const menuItems = [
    {
      section: "Dashboard",
      items: [
        {
          path: "/dashboard",
          icon: FiHome,
          label: "Dashboard",
          badge: null,
        },
      ],
    },
    {
      section: "Temple Management",
      items: [
        // If username is 'admin', show Add Temple + All Temples
        ...(username === "admin"
          ? [
              {
                path: "/addtemple",
                icon: FaPlusSquare,
                label: "Add Temple",
                badge: null,
              },
              {
                path: "/add-groups",
                icon: FaPlusSquare,
                label: "Add Groups",
                badge: null,
              },
              {
                path: "/catalog-setup",
                icon: FaPlusSquare,
                label: "Catalog Setup",
                badge: null,
              },
              {
                path: "/temple-list",
                icon: MdTempleHindu,
                label: "All Temples",
                badge: null,
              },
            ]
          : [
              // Otherwise, show user-specific temple options
              {
                path: "/temple-list",
                icon: MdTempleHindu,
                label: "My Temple",
                badge: null,
              },
              {
                path: "/services",
                icon: MdMiscellaneousServices,
                label: "Temple Services",
                badge: "",
              },
              {
                path: "/admin-services",
                icon: FaRegCalendarPlus,
                label: "New Bookings",
                badge: null,
              },

              {
                path: "/sellerApproval",
                icon: MdApproval,
                label: "Approve Seller",
                badge: "",
              },
            ]),
      ],
    },
    {
      section: "Policy Management",
      items: [
        {
          path: "/advance-policies",
          icon: FiDollarSign,
          label: "Advance Policies",
          badge: null,
        },
        {
          path: "/refund-policies",
          icon: FiRefreshCw,
          label: "Refund Policies",
          badge: null,
        },
        {
          path: "/pricing-rules",
          icon: FiTrendingUp,
          label: "Pricing Rules",
          badge: null,
        },
      ],
    },
  ];

  return (
    <>
      <SidebarContainer
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <SidebarHeader collapsed={collapsed}>
          <Logo collapsed={collapsed}>
            <motion.div
              className="om-symbol"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <GiLotus />
            </motion.div>
            <div className="brand-text">
              <div className="title">Temple Admin</div>
              <div className="subtitle">Divine Management Portal</div>
              {firstName && (
                <div className="admin-name">
                  <FiBell size={12} /> Welcome, {firstName}
                </div>
              )}
            </div>
          </Logo>

          <CollapseButton onClick={onToggleCollapse}>
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </CollapseButton>
        </SidebarHeader>

        <SidebarContent>
          {menuItems.map((section, sectionIndex) => (
            <MenuSection key={sectionIndex}>
              <SectionTitle collapsed={collapsed}>
                {section.section}
              </SectionTitle>
              {section.items.map((item, itemIndex) => (
                <MenuItem
                  key={itemIndex}
                  to={item.path}
                  active={location.pathname === item.path}
                  collapsed={collapsed}
                  onMouseEnter={() =>
                    setHoveredItem(
                      collapsed ? `${sectionIndex}-${itemIndex}` : null
                    )
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={onCloseMobile}
                >
                  <span className="icon">
                    <item.icon />
                    {item.badge && <BellIconDecor>{item.badge}</BellIconDecor>}
                  </span>
                  <span className="label">{item.label}</span>
                  {item.badge && <span className="badge">{item.badge}</span>}

                  {/* Tooltip disabled in collapsed mode to avoid visual artifact */}
                </MenuItem>
              ))}
            </MenuSection>
          ))}
        </SidebarContent>
      </SidebarContainer>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
              display: "none",
            }}
            className="mobile-overlay"
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-overlay {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
