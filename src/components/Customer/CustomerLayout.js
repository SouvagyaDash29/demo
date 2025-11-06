import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiLogOut,
  FiMapPin,
} from "react-icons/fi";
import { FaHome, FaCalendarAlt, FaBook, FaThList, FaClipboardList } from "react-icons/fa";
import { IoPerson, IoSettingsSharp } from "react-icons/io5";
import { FaBoxArchive, FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { MdTempleHindu } from "react-icons/md";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import LocationModal from "./CustomerModal/LocationModal";

/* Spiritual Color Palette */
const SPIRITUAL_GOLD = "#d4af37";
const SPIRITUAL_GOLD_LIGHT = "#f4e4a6";
const SPIRITUAL_GOLD_DARK = "#b8941f";
const SPIRITUAL_SAND = "#e6d2aa";
const SPIRITUAL_CREAM = "#f8f4e6";
const SPIRITUAL_TERRACOTTA = "#c44536";
const SPIRITUAL_SAGE = "#87a96b";
const SPIRITUAL_DEEP_BLUE = "#2c3e50";
const SPIRITUAL_LIGHT_BLUE = "#3498db";
const SPIRITUAL_MAROON = "#8b4513";
const SPIRITUAL_OFFWHITE = "#fefcf5";

/* Shared sizing */
const SIDEBAR_W_COLLAPSED = 88;
const SIDEBAR_W_EXPANDED = 260;
const NAV_HEIGHT = 88;

/* Global animation tokens */
const TRANSITION_EASE = "ease-in-out";
const TRANSITION_S = 0.3;
const TRANSITION_CSS = `${TRANSITION_S}s ${TRANSITION_EASE}`;

/* Spiritual Glass tokens */
const GLASS_BG_IDLE =
  "linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(244, 228, 166, 0.08))";
const GLASS_BG_HOVER =
  "linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(244, 228, 166, 0.12))";
const GLASS_HILITE = "rgba(212, 175, 55, 0.2)";
const GLASS_BLUR = "16px";
const GLASS_SAT = "140%";

const seller_Color_palttels = {
  Primary: "#8B5CF6",
  Accent:	"#FACC15",
Background:	"#F9FAFB" ,
 white:	"#FFFFFF",
Text_Primary:	"#1F2937",
Text_Secondary:	"#6B7280",
Success:	"#10B981",
Warning:	"#F59E0B",
Error:	"#EF4444",
blue: "#667EEA",
purple: "#764BA2",
linear_gradient: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
backgroung_linear_gradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.14))",
menuItems_hover: "linear-gradient(145deg, #764ba2, #7c3aed)",
GLASS_BG_HOVER : "linear-gradient(135deg, rgb(255 255 255 / 24%), rgb(255 255 255 / 14%))",
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: radial-gradient(
      1100px 700px at 6% -12%,
      rgba(212, 175, 55, 0.08) 0%,
      transparent 60%
    ),
    radial-gradient(
      900px 600px at 96% 108%,
      rgba(135, 169, 107, 0.06) 0%,
      transparent 60%
    ),
    ${(props) => props.isSeller ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" : `linear-gradient(135deg, ${SPIRITUAL_OFFWHITE} 0%, ${SPIRITUAL_CREAM} 100%)`};
`;

const Sidebar = styled(motion.div)`
  width: ${(props) =>
    props.collapsed ? `${SIDEBAR_W_COLLAPSED}px` : `${SIDEBAR_W_EXPANDED}px`};
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow: visible;

  transition: background ${TRANSITION_CSS}, box-shadow ${TRANSITION_CSS},
    border-color ${TRANSITION_CSS}, transform ${TRANSITION_CSS};
    background: ${(props) => props.isSeller ? seller_Color_palttels.GLASS_BG_HOVER : GLASS_BG_IDLE};
  backdrop-filter: blur(${GLASS_BLUR}) saturate(${GLASS_SAT});
  -webkit-backdrop-filter: blur(${GLASS_BLUR}) saturate(${GLASS_SAT});

  box-shadow: 0 18px 48px rgba(44, 62, 80, 0.08),
    0 4px 12px rgba(44, 62, 80, 0.06), inset 0 1px 0 ${GLASS_HILITE};
  border-right: 1px solid rgba(212, 175, 55, 0.15);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
    background: linear-gradient(
      180deg,
      rgba(212, 175, 55, 0.08) 0%,
      transparent 38%
    );
  /*  background: ${(props) => props.isSeller ? seller_Color_palttels.linear_gradient : "linear-gradient(180deg,rgba(212, 175, 55, 0.08) 0%,transparent 38%)"} */
  }

  &:hover {
    background: ${(props) => props.isSeller? seller_Color_palttels.GLASS_BG_HOVER : GLASS_BG_HOVER};
    box-shadow: 0 22px 60px rgba(44, 62, 80, 0.12),
      0 6px 16px rgba(44, 62, 80, 0.08), inset 0 1px 0 ${GLASS_HILITE};
  }

  @media (max-width: 768px) {
    transform: translateX(${(props) => (props.mobileOpen ? "0" : "-100%")});
    width: ${SIDEBAR_W_EXPANDED}px;
    transition: transform ${TRANSITION_CSS};
  }

  @supports not (
    (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))
  ) {
    background: rgba(248, 244, 230, 0.85);
  }
`;

const SidebarHeader = styled.div`
  padding: 1.25rem 1.25rem 1rem 1.25rem;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 0;
  cursor: pointer;

  transition: background ${TRANSITION_CSS}, color ${TRANSITION_CSS},
    border-color ${TRANSITION_CSS};

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: ${props => props.isSeller ? seller_Color_palttels.GLASS_BG_HOVER : "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)"};
    pointer-events: none;
    border-radius: 1px;
    transition: background ${TRANSITION_CSS};
  }

  @media (max-width: 768px) {
    &::after {
      left: 16px;
      right: 16px;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .om-symbol {
    font-size: 1.75rem;
    color: ${SPIRITUAL_GOLD};
    background: none;
    filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
  }

  .brand-text {
    display: ${(props) => (props.collapsed ? "none" : "block")};
    transition: opacity ${TRANSITION_CSS};

    .title {
      font-size: 1.08rem;
      font-weight: 700;
      margin: 0;
      color: ${(props) => props.isSeller ? "#0f172a" : SPIRITUAL_DEEP_BLUE};
      letter-spacing: 0.2px;
      background: linear-gradient(
        135deg,
        ${SPIRITUAL_GOLD_DARK},
        ${SPIRITUAL_TERRACOTTA}
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 0.78rem;
      color: ${(props) => props.isSeller ? "#94a3b8" : SPIRITUAL_SAGE};
      margin: 0;
      font-weight: 500;
    }
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 50%;
  right: -18px;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 20px;
  background: ${(props) => props.isSeller? seller_Color_palttels.linear_gradient : `linear-gradient(135deg,${SPIRITUAL_GOLD},${SPIRITUAL_GOLD_DARK})`};
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  color: ${SPIRITUAL_OFFWHITE};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  transition: all 0.16s ${TRANSITION_EASE};
  box-shadow: 0 10px 22px rgba(212, 175, 55, 0.25),
    0 3px 8px rgba(44, 62, 80, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  z-index: 2000;
  pointer-events: auto;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      120% 100% at -10% -20%,
      rgba(255, 255, 255, 0.4) 0%,
      transparent 50%
    );
    pointer-events: none;
    transition: opacity 0.16s ${TRANSITION_EASE};
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-50%) scale(1.06);
    border-color: rgba(212, 175, 55, 0.6);
    box-shadow: 0 14px 28px rgba(212, 175, 55, 0.35),
      0 5px 12px rgba(44, 62, 80, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(-50%) scale(0.97);
    box-shadow: 0 8px 18px rgba(212, 175, 55, 0.2),
      0 2px 8px rgba(44, 62, 80, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.6rem 0;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.3);
    border-radius: 4px;
  }
`;

const MenuSection = styled.div`
  margin: 0.5rem 0 1.2rem 0;
`;

const SectionTitle = styled.div`
  padding: 0 1.25rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${SPIRITUAL_SAGE};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: ${(props) => (props.collapsed ? "none" : "block")};
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.72rem 1rem;
  margin: 0.28rem 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.18s ${TRANSITION_EASE};

  color: ${(props) =>
    props.active ? SPIRITUAL_OFFWHITE : SPIRITUAL_DEEP_BLUE};

background: ${(props) =>
  props.active
    ? props.isSeller
      ? seller_Color_palttels.linear_gradient
      : `linear-gradient(145deg, ${SPIRITUAL_GOLD}, ${SPIRITUAL_TERRACOTTA})`
    : "transparent"};

  /* border: 1px solid
    ${(props) => (props.active ? "transparent" : "rgba(212, 175, 55, 0.2)")}; */
  box-shadow: ${(props) =>
    props.active
      ? "0 2px 10px rgba(212, 175, 55, 0.4)"
      : "inset 0 1px 0 rgba(255, 255, 255, 0.3)"};

  &:hover {
      background: ${(props) =>
  props.active
    ? props.isSeller
      ? seller_Color_palttels.menuItems_hover
      : `linear-gradient(145deg, ${SPIRITUAL_GOLD_DARK}, ${SPIRITUAL_MAROON})`
    : props.isSeller? "rgb(255 255 255 / 18%)": "transparent"};

    border-color: ${(props) =>
      props.active ? "transparent" : "rgba(212, 175, 55, 0.3)"};
    color: ${(props) =>
      props.active ? SPIRITUAL_OFFWHITE : SPIRITUAL_DEEP_BLUE};
    box-shadow: ${(props) =>
      props.active
        ? "0 4px 14px rgba(212, 175, 55, 0.5)"
        : "inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 8px rgba(44, 62, 80, 0.08)"};
  }

  .icon {
    font-size: 1.22rem;
    min-width: 1.22rem;
    display: flex;
    align-items: center;
    justify-content: center;
  color: ${({ isSeller, active }) =>
isSeller
    ? active
      ? "#ffffff"
      : "#6b7280"
    : active
    ? SPIRITUAL_OFFWHITE
    : SPIRITUAL_GOLD};
    transition: color 0.18s ${TRANSITION_EASE};
  }

  .label {
    margin-left: 0.9rem;
    font-weight: 600;
    font-size: 0.95rem;
    display: ${(props) => (props.collapsed ? "none" : "block")};
    color: inherit;
  }

  .badge {
    margin-left: auto;
    background: ${SPIRITUAL_TERRACOTTA};
    color: ${SPIRITUAL_OFFWHITE};
    font-size: 0.7rem;
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    min-width: 1rem;
    height: 1rem;
    display: ${(props) => (props.collapsed ? "none" : "flex")};
    align-items: center;
    justify-content: center;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(196, 69, 54, 0.4);
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${(props) =>
    props.sidebarCollapsed
      ? `${SIDEBAR_W_COLLAPSED}px`
      : `${SIDEBAR_W_EXPANDED}px`};
  padding-top: ${NAV_HEIGHT}px;
  transition: margin-left ${TRANSITION_CSS};
  will-change: margin-left;

  @media (max-width: 768px) {
    margin-left: 0;
    padding-top: ${NAV_HEIGHT}px;
  }
`;

const TopNavbar = styled.div`
  background: rgba(248, 244, 230, 0.7);
  backdrop-filter: blur(10px) saturate(130%);
  -webkit-backdrop-filter: blur(10px) saturate(130%);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 6px 18px rgba(44, 62, 80, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);

  height: ${NAV_HEIGHT}px;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  top: 0;
  left: ${(props) =>
    props.sidebarCollapsed
      ? `${SIDEBAR_W_COLLAPSED}px`
      : `${SIDEBAR_W_EXPANDED}px`};
  right: 0;
  z-index: 900;

  transition: left ${TRANSITION_CSS};
  will-change: left;

  @media (max-width: 768px) {
    left: 0;
    padding: 0 1.5rem;
  }
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${SPIRITUAL_GOLD};
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ${TRANSITION_EASE};

  &:hover {
    background: rgba(212, 175, 55, 0.1);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserMenu = styled.div`
  position: relative;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  background: rgba(248, 244, 230, 0.6);
`;

const UserButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(248, 244, 230, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.25);
  backdrop-filter: blur(8px) saturate(125%);
  -webkit-backdrop-filter: blur(8px) saturate(125%);
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  border-radius: 12px;
  transition: all 0.18s ${TRANSITION_EASE};

  &:hover {
    background: rgba(248, 244, 230, 0.9);
    border-color: rgba(212, 175, 55, 0.4);
  }
`;

const UserAvatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(
    135deg,
    ${SPIRITUAL_GOLD},
    ${SPIRITUAL_TERRACOTTA}
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${SPIRITUAL_OFFWHITE};
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
`;

const UserInfo = styled.div`
  text-align: left;

  .name {
    font-weight: 600;
    color: ${SPIRITUAL_DEEP_BLUE};
    font-size: 0.9rem;
    margin: 0;
  }

  .role {
    font-size: 0.75rem;
    color: ${SPIRITUAL_SAGE};
    margin: 0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const PageContent = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 80px);
  background: ${(props) => props.isSeller ? seller_Color_palttels.Background : SPIRITUAL_OFFWHITE};

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 62, 80, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: ${SPIRITUAL_OFFWHITE};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12),
    0 2px 8px rgba(44, 62, 80, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.2);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
`;

const DropdownItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all 0.2s ${TRANSITION_EASE};
  color: ${SPIRITUAL_DEEP_BLUE};
  background: transparent;

  .icon {
    margin-right: 0.75rem;
    font-size: 1.1rem;
    color: ${SPIRITUAL_GOLD};
    transition: all 0.2s ${TRANSITION_EASE};
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ${TRANSITION_EASE};
  }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(212, 175, 55, 0.1),
      rgba(135, 169, 107, 0.05)
    );
    color: ${SPIRITUAL_TERRACOTTA};

    .icon {
      color: ${SPIRITUAL_TERRACOTTA};
      transform: scale(1.1);
    }

    .label {
      color: ${SPIRITUAL_TERRACOTTA};
    }
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 175, 55, 0.3),
    transparent
  );
  margin: 0.25rem 0;
`;
const CustomerLayout = ({ children }) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      return localStorage.getItem("selectedState") || "";
    } catch {
      return "";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(
        "sidebarCollapsed",
        JSON.stringify(sidebarCollapsed)
      );
    } catch {
      /* ignore storage failures */
    }
  }, [sidebarCollapsed]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { customerData, logout, sellerProfile, getSellerProfile } = useCustomerAuth();
  const custmercode = localStorage.getItem("customerRefCode");
  const isSeller = custmercode?.startsWith("S");
  let menuItems = [];

  // console.log(sellerProfile)

  if (custmercode?.startsWith("S")) {
    // ✅ Only Dashboard + Profile
    menuItems = [
      {
        section: "Main",
        items: [
          {
            path: "/seller-Dashboard",
            icon: FaHome,
            label: "Dashboard",
            badge: null,
          },
          {
            path: "/seller-Products",
            icon: FaBoxArchive,
            label: "Products",
            badge: null,
          },
          {
            path: "/seller-Orders",
            icon: FaClipboardList,
            label: "Orders",
            badge: null,
          },
          {
            path: "/seller-Application",
            icon: FaBook,
            label: "My Application",
            badge: null,
          },
        ],
      },
      {
        section: "Account",
        items: [
          {
            path: "/seller-Profile",
            icon: IoPerson,
            label: "Profile",
            badge: null,
          },
          {
            path: "/customer-settings",
            icon: IoSettingsSharp,
            label: "Settings",
            badge: null,
          },
        ],
      },
    ];
  } else {
    // ✅ Full menu
    menuItems = [
      {
        section: "Main",
        items: [
          {
            path: "/customer-dashboard",
            icon: FaHome,
            label: "Dashboard",
            badge: null,
          },
          {
            path: "/customer-services",
            icon: FaThList,
            label: "All Services",
            badge: null,
          },
          {
            path: "/customer-temples",
            icon: MdTempleHindu,
            label: "Temples",
            badge: null,
          },
          {
            path: "/customer-bookings",
            icon: FaCalendarAlt,
            label: "My Bookings",
            badge: null,
          },
        ],
      },
      {
        section: "Account",
        items: [
          {
            path: "/customer-profile",
            icon: IoPerson,
            label: "Profile",
            badge: null,
          },
          {
            path: "/customer-settings",
            icon: IoSettingsSharp,
            label: "Settings",
            badge: null,
          },
        ],
      },
    ];
  }
  const handleMenuClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/customer-login");
  };

  const getUserInitials = () => {
    if (customerData?.custRefCode) {
      return customerData.custRefCode.charAt(0).toUpperCase();
    }
    return "C";
  };
  useEffect(() => {
    const handleStorageChange = () => {
      const newLocation = localStorage.getItem("selectedState");
      if (newLocation) {
        setSelectedLocation(newLocation);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [sidebarCollapsed]);

  useEffect(() => {
    getSellerProfile();
  },[])
  return (
    <LayoutContainer isSeller={isSeller}>
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        initial={false}
        animate={{
          width: sidebarCollapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_EXPANDED,
        }}
        transition={{ duration: TRANSITION_S, ease: "easeInOut" }}
        isSeller={isSeller}
      >
        <SidebarHeader isSeller={isSeller}>
          <Logo collapsed={sidebarCollapsed} onClick={() => navigate("/")} isSeller={isSeller}>
            <motion.div
              className="om-symbol"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              🕉️
            </motion.div>
            <div className="brand-text" isSeller={isSeller}>
              <div className="title" isSeller={isSeller}>Temple Connect</div>
              <div className="subtitle" isSeller={isSeller}>{customerData?.custRefCode}</div>
            </div>
          </Logo>

          <CollapseButton
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            isSeller={isSeller}
          >
            {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </CollapseButton>
        </SidebarHeader>

        <SidebarContent>
          {menuItems.map((section, sectionIndex) => (
            <MenuSection key={sectionIndex}>
              <SectionTitle collapsed={sidebarCollapsed}>
                {section.section}
              </SectionTitle>
              {section.items.map((item, itemIndex) => (
                <MenuItem
                  key={itemIndex}
                  active={location.pathname === item.path}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleMenuClick(item.path)}
                  isSeller={isSeller}
                >
                  <span className="icon">
                    <item.icon />
                  </span>
                  <span className="label">{item.label}</span>
                  {item.badge && <span className="badge">{item.badge}</span>}
                </MenuItem>
              ))}
            </MenuSection>
          ))}

          <MenuSection>
            <MenuItem collapsed={sidebarCollapsed} onClick={handleLogout}>
              <span className="icon">
                <FaPersonWalkingDashedLineArrowRight />
              </span>
              <span className="label">Logout</span>
            </MenuItem>
          </MenuSection>
        </SidebarContent>
      </Sidebar>

      <MainContent sidebarCollapsed={sidebarCollapsed}>
        {/* PASS THE PROP HERE */}
        <TopNavbar sidebarCollapsed={sidebarCollapsed}>
          <NavLeft>
            <MobileMenuButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </MobileMenuButton>
            {selectedLocation && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: "rgba(212, 175, 55, 0.1)",
                  borderRadius: "8px",
                  color: "#2c3e50",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
                onClick={() => setShowLocationModal(true)}
              >
                <FiMapPin style={{ color: "#d4af37" }} />
                {selectedLocation}
              </div>
            )}
          </NavLeft>
          <NavRight>
            <UserMenu>
              <UserButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <UserAvatar>{getUserInitials()}</UserAvatar>
                <UserInfo>
                  <div className="name">{custmercode?.startsWith("S") ? `${ sellerProfile ? sellerProfile.name : "Seller"}` : "Devotee"}</div>
                  <div className="role">{customerData?.custRefCode}</div>
                </UserInfo>
                <FiChevronDown
                  style={{
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </UserButton>

              <AnimatePresence>
                {dropdownOpen && (
                  <UserDropdown
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownItem
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(isSeller ? "/seller-Profile" : "/customer-profile");
                      }}
                    >
                      <span className="icon">
                        <FiUser />
                      </span>
                      <span className="label">Profile</span>
                    </DropdownItem>

                    <DropdownDivider />

                    <DropdownItem
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <span className="icon">
                        <FiLogOut />
                      </span>
                      <span className="label">Logout</span>
                    </DropdownItem>
                  </UserDropdown>
                )}
              </AnimatePresence>
            </UserMenu>
          </NavRight>
        </TopNavbar>

        <PageContent isSeller={isSeller}>{children}</PageContent>
      </MainContent>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </LayoutContainer>
  );
};

export default CustomerLayout;
