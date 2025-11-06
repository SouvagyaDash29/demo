// components/StatusBadge.jsx
import styled from "styled-components";

const Badge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  white-space: nowrap;
  
  ${({ status }) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'success':
      case 'in stock':
      case 'Y':
      case true:
        return `
          color: #059669;
          background: #d1fae5;
          border: 1px solid #a7f3d0;
        `;
      
      case 'inactive':
      case 'rejected':
      case 'failed':
      case 'cancelled':
      case 'out of stock':
      case 'N':
      case false:
        return `
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
        `;
      
      case 'pending':
      case 'processing':
      case 'waiting':
        return `
          color: #d97706;
          background: #fffbeb;
          border: 1px solid #fed7aa;
        `;
      
      case 'submitted':
      case 'under review':
      case 'in progress':
        return `
          color: #2563eb;
          background: #dbeafe;
          border: 1px solid #bfdbfe;
        `;
      
      case 'draft':
      case 'saved':
        return `
          color: #6b7280;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
        `;
      
      case 'warning':
      case 'attention':
        return `
          color: #ea580c;
          background: #fff7ed;
          border: 1px solid #fdba74;
        `;
      
      default:
        return `
          color: #6b7280;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
        `;
    }
  }}
`;

const StatusBadges = ({ value, customLabels = {} }) => {
  // Normalize the value to lowercase string for consistent matching
  const normalizedValue = typeof value === 'string' ? value.toLowerCase() : value;
  
  // Define default labels for different status types
  const defaultLabels = {
    // Active states
    'active': 'Active',
    'approved': 'Approved',
    'completed': 'Completed',
    'success': 'Success',
    'in stock': 'In Stock',
    'Y': 'Yes',
    'true': 'Active',
    
    // Inactive states
    'inactive': 'Inactive',
    'rejected': 'Rejected',
    'failed': 'Failed',
    'cancelled': 'Cancelled',
    'out of stock': 'Out of Stock',
    'N': 'No',
    'false': 'Inactive',
    
    // Pending states
    'pending': 'Pending',
    'processing': 'Processing',
    'waiting': 'Waiting',
    
    // Review states
    'submitted': 'Submitted',
    'under review': 'Under Review',
    'in progress': 'In Progress',
    
    // Draft states
    'draft': 'Draft',
    'saved': 'Saved',
    
    // Warning states
    'warning': 'Warning',
    'attention': 'Attention Required'
  };

  // Get the display text - use custom label if provided, otherwise use default label
  const getDisplayText = () => {
    // Check for exact matches first
    if (customLabels[value]) return customLabels[value];
    if (customLabels[normalizedValue]) return customLabels[normalizedValue];
    
    // Check in default labels
    if (defaultLabels[value]) return defaultLabels[value];
    if (defaultLabels[normalizedValue]) return defaultLabels[normalizedValue];
    
    // For boolean values
    if (value === true) return customLabels.true || defaultLabels.true;
    if (value === false) return customLabels.false || defaultLabels.false;
    
    // For number values (common in database fields)
    if (value === 1) return customLabels[1] || customLabels.true || defaultLabels.true;
    if (value === 0) return customLabels[0] || customLabels.false || defaultLabels.false;
    
    // Fallback - capitalize the original value
    return typeof value === 'string' 
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      : String(value);
  };

  return (
    <Badge status={normalizedValue}>
      {getDisplayText()}
    </Badge>
  );
};

export default StatusBadges;