"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
} from "react-icons/fi";
import { GiLotus, TempleGate } from "react-icons/gi";

// Color themes
const BLUE_THEME = {
  primary: "#0056d6",
  primaryLight: "#cfe0ff",
  primaryDark: "#0a4db4",
  secondary: "#d7e4ff",
  background: "#f3f8ff",
  accent: "#d64545",
  success: "#3b82f6",
  textDark: "#0f172a",
  textLight: "#3b82f6",
  border: "#cfe0ff",
  surface: "#ffffff",
  hover: "#eaf2ff",
};

const SPIRITUAL_THEME = {
  primary: "#d4af37",
  primaryLight: "#f4e4a6",
  primaryDark: "#b8941f",
  secondary: "#e6d2aa",
  background: "#f8f4e6",
  accent: "#c44536",
  success: "#87a96b",
  textDark: "#2c3e50",
  textLight: "#3498db",
  border: "#8b4513",
  surface: "#fefcf5",
  hover: "#f4e4a630",
};

const getColors = (spiritual) => spiritual ? SPIRITUAL_THEME : BLUE_THEME;

const TableContainer = styled.div`
  background: ${props => getColors(props.$spiritual).surface};
  border-radius: 0.75rem;
  overflow: visible;
  box-shadow: 0 6px 24px ${props => getColors(props.$spiritual).primary}15;
  border: 1px solid ${props => getColors(props.$spiritual).primaryLight};
`;

const TableHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => getColors(props.$spiritual).primaryLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: ${props => getColors(props.$spiritual).background};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => getColors(props.$spiritual).textDark}80;
    font-size: 1rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => getColors(props.$spiritual).primaryLight};
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: ${props => getColors(props.$spiritual).surface};
  color: ${props => getColors(props.$spiritual).textDark};

  &:focus {
    outline: none;
    border-color: ${props => getColors(props.$spiritual).primary};
    box-shadow: 0 0 0 3px ${props => getColors(props.$spiritual).primary}20;
  }

  &::placeholder {
    color: ${props => getColors(props.$spiritual).textDark}60;
    opacity: 0.6;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: visible;
`;

const TableHead = styled.thead`
  background: linear-gradient(180deg, 
    ${props => getColors(props.$spiritual).background} 0%, 
    ${props => getColors(props.$spiritual).primaryLight}30 100%);

  th {
    padding: 1rem 2rem;
    text-align: left;
    font-weight: 600;
    color: ${props => getColors(props.$spiritual).primaryDark};
    font-size: 0.9rem;
    border-bottom: 1px solid ${props => getColors(props.$spiritual).secondary};
    position: relative;

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 60%;
      width: 1px;
      background: linear-gradient(to bottom, transparent, ${props => getColors(props.$spiritual).secondary}, transparent);
    }
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${props => getColors(props.$spiritual).primaryLight}50;
    transition: background-color 0.2s;
    background: ${props => getColors(props.$spiritual).surface};
    position: relative;

    &:nth-child(even) {
      background: ${props => getColors(props.$spiritual).background};
    }

    &:hover {
      background: ${props => getColors(props.$spiritual).hover};
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 1rem 2rem;
    color: ${props => getColors(props.$spiritual).textDark};
    font-size: 0.9rem;
    vertical-align: middle;
  }
`;

const ActionCell = styled.td`
  text-align: right;
`;

const ActionButton = styled.button`
  background: ${props => getColors(props.$spiritual).surface};
  border: 1px solid ${props => getColors(props.$spiritual).primaryLight};
  color: ${props => getColors(props.$spiritual).primary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  width: 36px;
  height: 36px;

  &:hover {
    background: ${props => getColors(props.$spiritual).primaryLight}30;
    color: ${props => getColors(props.$spiritual).primaryDark};
    border-color: ${props => getColors(props.$spiritual).primary};
  }
`;

const ActionMenu = styled(motion.div)`
  position: absolute;
  ${(props) => (props.$openAbove ? "bottom: calc(100% + 4px);" : "top: calc(100% + 4px);")}
  right: 0;
  background: ${props => getColors(props.$spiritual).surface};
  border: 1px solid ${props => getColors(props.$spiritual).primaryLight};
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px ${props => getColors(props.$spiritual).primary}20;
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
  transform-origin: ${(props) => (props.$openAbove ? "bottom right" : "top right")};
  
  @media (max-height: 700px) {
    max-height: 60vh;
    overflow: auto;
  }
`;

const ActionWrapper = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
`;

const ActionMenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${props => getColors(props.$spiritual).textDark};
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid ${props => getColors(props.$spiritual).primaryLight}50;

  &:hover {
    background: ${props => getColors(props.$spiritual).primaryLight}30;
    color: ${props => getColors(props.$spiritual).primaryDark};
  }

  &.danger {
    color: ${props => getColors(props.$spiritual).accent};

    &:hover {
      background: ${props => getColors(props.$spiritual).accent}15;
    }
  }

  .icon {
    font-size: 0.9rem;
    color: ${props => getColors(props.$spiritual).primary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => getColors(props.$spiritual).primary};

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: ${props => getColors(props.$spiritual).primaryLight};
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: ${props => getColors(props.$spiritual).textDark};
  }

  p {
    margin: 0;
    opacity: 0.8;
    color: ${props => getColors(props.$spiritual).textDark};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  flex-direction: column;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${props => getColors(props.$spiritual).primaryLight};
    border-top: 4px solid ${props => getColors(props.$spiritual).primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    color: ${props => getColors(props.$spiritual).primary};
    font-size: 0.9rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const TableFooter = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid ${props => getColors(props.$spiritual).primaryLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => getColors(props.$spiritual).background};
  color: ${props => getColors(props.$spiritual).primary};
  font-size: 0.9rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Pagination = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => getColors(props.$spiritual).primaryLight};
  background: ${(props) => (props.$active ? getColors(props.$spiritual).primary : getColors(props.$spiritual).surface)};
  color: ${(props) => (props.$active ? getColors(props.$spiritual).surface : getColors(props.$spiritual).primary)};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => getColors(props.$spiritual).primaryLight}30;
    color: ${props => getColors(props.$spiritual).primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.85); /* soft visible layer */
  color: #2c3e50; /* SPIRITUAL_DEEP_BLUE for contrast */
  border: 2px solid rgba(255, 255, 255, 0.6);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background: rgba(248, 244, 230, 0.95); /* SPIRITUAL_CREAM */
    border-color: #d4af37; /* SPIRITUAL_GOLD */
    color: #c44536; /* SPIRITUAL_TERRACOTTA for energy */
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    background: rgba(230, 210, 170, 0.9); /* SPIRITUAL_SAND tone */
  }
`;

const AddButton2 = styled(motion.button)`
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

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  emptyIcon = <GiLotus />,
  emptyTitle = "No Data Found",
  emptyDescription = "There are no items to display at this time.",
  searchable = true,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  spiritual = false, // New prop to enable spiritual theme
  isDiscountButtonShow= false,
  setShowDiscountModal,
  ButtonLable=""
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [openAboveRowIndex, setOpenAboveRowIndex] = useState(null);

  const filteredData = searchable
    ? data.filter((item) =>
        columns.some((column) => {
          const value = item[column.key];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      )
    : data;

  const handleActionClick = (index, event) => {
    event.stopPropagation();
    if (activeActionMenu === index) {
      setActiveActionMenu(null);
      setOpenAboveRowIndex(null);
      return;
    }

    try {
      const rect = event.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenAbove = spaceBelow < 180;
      setOpenAboveRowIndex(shouldOpenAbove ? index : null);
    } catch {
      setOpenAboveRowIndex(null);
    }

    setActiveActionMenu(index);
  };

  const handleActionItemClick = (action, item) => {
    setActiveActionMenu(null);
    setOpenAboveRowIndex(null);
    if (action === "edit" && onEdit) onEdit(item);
    if (action === "delete" && onDelete) onDelete(item);
    if (action === "view" && onView) onView(item);
  };

  useState(() => {
    const handleClickOutside = () => {
      setActiveActionMenu(null);
      setOpenAboveRowIndex(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <TableContainer $spiritual={spiritual}>
        <LoadingContainer $spiritual={spiritual}>
          <div className="spinner"></div>
          <div className="loading-text">Loading sacred records...</div>
        </LoadingContainer>
      </TableContainer>
    );
  }

  const ActiveButton = spiritual ? AddButton : AddButton2;


  return (
    <TableContainer $spiritual={spiritual}>
      {searchable && (
        <TableHeader $spiritual={spiritual}>
          <SearchContainer $spiritual={spiritual}>
            <FiSearch className="search-icon" />
            <SearchInput
              type="text"
              placeholder="Search sacred records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              $spiritual={spiritual}
            />
          </SearchContainer>

          {isDiscountButtonShow && (
            <ActiveButton
              onClick={() => setShowDiscountModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus />
              {ButtonLable}
            </ActiveButton>
          )}

        </TableHeader>
      )}

      {filteredData.length === 0 ? (
        <EmptyState $spiritual={spiritual}>
          <div className="icon">{emptyIcon}</div>
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
        </EmptyState>
      ) : (
        <>
          <Table>
            <TableHead $spiritual={spiritual}>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.title}</th>
                ))}
                {(onEdit || onDelete || onView) && <th>Actions</th>}
              </tr>
            </TableHead>
            <TableBody>
              {filteredData.map((item, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render
                        ? column.render(item[column.key], item, rowIndex)
                        : item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <ActionCell>
                      <ActionWrapper>
                        <ActionButton
                          aria-label="Row actions"
                          onClick={(e) => handleActionClick(rowIndex, e)}
                          $spiritual={spiritual}
                        >
                          <FiMoreVertical />
                        </ActionButton>

                        {activeActionMenu === rowIndex && (
                          <ActionMenu
                            $openAbove={openAboveRowIndex === rowIndex}
                            $spiritual={spiritual}
                            initial={{ opacity: 0, scale: 0.98, y: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {onView && (
                              <ActionMenuItem
                                onClick={() =>
                                  handleActionItemClick("view", item)
                                }
                                $spiritual={spiritual}
                              >
                                <FiEye className="icon" />
                                View Details
                              </ActionMenuItem>
                            )}
                            {onEdit && (
                              <ActionMenuItem
                                onClick={() =>
                                  handleActionItemClick("edit", item)
                                }
                                $spiritual={spiritual}
                              >
                                <FiEdit className="icon" />
                                Edit
                              </ActionMenuItem>
                            )}
                            {onDelete && (
                              <ActionMenuItem
                                className="danger"
                                onClick={() =>
                                  handleActionItemClick("delete", item)
                                }
                                $spiritual={spiritual}
                              >
                                <FiTrash2 className="icon" color="#d64545" />
                                Delete
                              </ActionMenuItem>
                            )}
                          </ActionMenu>
                        )}
                      </ActionWrapper>
                    </ActionCell>
                  )}
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {pagination && (
            <TableFooter $spiritual={spiritual}>
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} entries
              </div>
              <Pagination>
                <PageButton
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                  $spiritual={spiritual}
                >
                  Previous
                </PageButton>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <PageButton
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                  $spiritual={spiritual}
                >
                  Next
                </PageButton>
              </Pagination>
            </TableFooter>
          )}
        </>
      )}
    </TableContainer>
  );
};

export default DataTable;