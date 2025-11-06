import { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiEdit, FiMoreVertical, FiSlash, FiXCircle } from "react-icons/fi";
import styled from "styled-components";
import Button from "../../Reusecomponets/Button";
import { motion } from "framer-motion";

export const ActionDropdown = ({ seller, processingAction, openRemarkModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action, e) => {
    e.stopPropagation();
    openRemarkModal(seller, action);
    setIsOpen(false);
  };

  const getActionsByStatus = () => {
    switch(seller.raw.status) {
      case 'A': // Approved - show Inactive button
        return [
          {
            label: 'Inactive',
            action: 'inactive',
            icon: FiSlash,
            variant: 'outline',
            color: 'gray'
          }
        ];

      case 'S': // Submitted - show Approve, Reject, Modify buttons
        return [
          {
            label: 'Approve',
            action: 'approve',
            icon: FiCheckCircle,
            variant: 'filled',
            color: 'green'
          },
          {
            label: 'Reject',
            action: 'reject',
            icon: FiXCircle,
            variant: 'outline',
            color: 'red'
          },
          {
            label: 'Modification Required',
            action: 'modify',
            icon: FiEdit,
            variant: 'outline',
            color: 'blue'
          }
        ];

      case 'X': // Inactive - show Activate button
        return [
          {
            label: 'Activate',
            action: 'active',
            icon: FiCheckCircle,
            variant: 'filled',
            color: 'green'
          }
        ];

      default:
        return [];
    }
  };

  const actions = getActionsByStatus();

  if (actions.length === 0) {
    return (
      <Button variant="outline" color="gray" size="sm" disabled>
        No Action
      </Button>
    );
  }

  return (
    <DropdownContainer ref={dropdownRef}>
      <MenuButton
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        disabled={processingAction}
      >
        <FiMoreVertical size={16} />
      </MenuButton>

      {isOpen && (
        <DropdownMenu
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {actions.map((item, index) => (
            <DropdownMenuItem
              key={item.action}
              onClick={(e) => handleActionClick(item.action, e)}
              disabled={processingAction === `${seller.seller_ref_code}-${item.action}`}
              $variant={item.variant}
              $color={item.color}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <MenuItemContent>
                <item.icon size={14} />
                {item.label}
                {processingAction === `${seller.seller_ref_code}-${item.action}` && (
                  <Spinner size={12} />
                )}
              </MenuItemContent>
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

// Styled Components
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  min-width: 180px;
  z-index: 50;
  overflow: hidden;
`;

const DropdownMenuItem = styled(motion.button)`
  display: flex;
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

&:hover:not(:disabled) {
    ${({ $color }) => {
      switch($color) {
        case 'green':
          return `background: #f0fdf4;`; // Lighter shade of green
        case 'red':
          return `background: #fef2f2;`; // Lighter shade of red
        case 'blue':
          return `background: #eff6ff;`; // Lighter shade of blue
        case 'gray':
          return `background: #f9fafb;`; // Lighter shade of gray
        default:
          return `background: #f9fafb;`;
      }
    }}
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f9fafb;
  }

  ${({ $variant, $color }) => {
    if ($variant === 'filled') {
      return `
        color: ${$color === 'green' ? '#059669' : 
                $color === 'red' ? '#dc2626' : 
                $color === 'blue' ? '#2563eb' : '#6b7280'};
      `;
    } else {
      return `
        color: ${$color === 'green' ? '#059669' : 
                $color === 'red' ? '#dc2626' : 
                $color === 'blue' ? '#2563eb' : '#6b7280'};
      `;
    }
  }}
`;

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Spinner = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #6b7280;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;