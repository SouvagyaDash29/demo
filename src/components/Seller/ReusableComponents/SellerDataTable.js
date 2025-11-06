import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { CiMenuKebab } from "react-icons/ci";

/**
 * SellerDataTable – dynamic, themed, filterable, and paginated
 * ------------------------------------------------------------
 * Features:
 * - Dynamic columns with support for: text, image, status badge, actions, custom renderer
 * - Action buttons & menu items with label/icon/disabled/hidden that can be strings OR functions(row)
 * - Search across configured keys; n dropdown filters; multiselects; single date & date range; double date range
 * - Client-side pagination (controlled internally) and page size options
 * - Themeable via `theme` prop to override colors
 *
 * Props (high-level):
 * - columns: Array<{
 *     key: string,
 *     title: string,
 *     type?: 'text'|'image'|'status'|'custom'|'actions',
 *     accessor?: (row) => any  // if omitted, uses row[key]
 *     render?: (row) => ReactNode  // for custom type
 *     buttons?: Array<ActionDef>
 *     menuItems?: Array<ActionDef>
 *   }>
 *
 *   type ActionDef = {
 *     label: string | ((row) => string),
 *     icon?: React.ComponentType<{ size?: number }> | ((row) => React.ReactNode),
 *     onClick: (row) => void,
 *     disabled?: boolean | ((row) => boolean),
 *     hidden?: boolean | ((row) => boolean)
 *   }
 *
 * - data: any[]
 * - selectable?: boolean
 * - onSelectionChange?: (ids: string[]) => void
 * - rowId?: (row, index) => string    // optional custom id; defaults to `row._tableId` or auto
 * - theme?: Partial<typeof defaultColors>
 * - filters?: {
 *     search?: { placeholder?: string, keys?: string[] | ((row)=>string[]) }
 *     selects?: Array<{ id: string, label: string, options: {label:string,value:any}[], key?: string, accessor?: (row)=>any }>
 *     multiselects?: Array<{ id: string, label: string, options: {label:string,value:any}[], key?: string, accessor?: (row)=>any }>
 *     date?: { id: string, label: string, key?: string, accessor?: (row)=>string|Date }
 *     daterange?: { id: string, label: string, key?: string, accessor?: (row)=>string|Date }
 *     doubleDateRange?: { id: string, labelLeft: string, labelRight: string, leftKey?: string, rightKey?: string, leftAccessor?: (row)=>string|Date, rightAccessor?: (row)=>string|Date }
 *   }
 * - pagination?: { pageSize?: number, pageSizeOptions?: number[] }
 */

// ---------- THEME ----------
const defaultColors = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  background: "#ffffff",
  surface: "#f8fafc",
  border: "#e2e8f0",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  textLight: "#94a3b8",
  hover: "#f1f5f9"
};

const useTheme = (theme) => useMemo(() => ({ ...defaultColors, ...(theme || {}) }), [theme]);

// ---------- STYLES ----------
const TableContainer = styled.div(({ $c }) => `
  background: ${$c.background};
  border-radius: 8px;
  border: 1px solid ${$c.border};
  overflow: visible;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`);

const Toolbar = styled.div(({ $c }) => `
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid ${$c.border};
  background: ${$c.surface};
`);

const SearchInput = styled.input(({ $c }) => `
  flex: 1 1 260px;
  min-width: 200px;
  padding: 10px 12px;
  border: 1px solid ${$c.border};
  border-radius: 6px;
  color: ${$c.textPrimary};
  background: ${$c.background};
`);

const Select = styled.select(({ $c }) => `
  padding: 10px 12px;
  border: 1px solid ${$c.border};
  border-radius: 6px;
  background: ${$c.background};
  color: ${$c.textPrimary};
`);

const DateInput = styled.input(({ $c }) => `
  padding: 10px 12px;
  border: 1px solid ${$c.border};
  border-radius: 6px;
  background: ${$c.background};
  color: ${$c.textPrimary};
`);

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
`;

const Thead = styled.thead(({ $c }) => `
  background: ${$c.surface};
  border-bottom: 2px solid ${$c.border};
`);

const Th = styled.th(({ $c }) => `
  padding: 14px 12px;
  text-align: left;
  color: ${$c.textPrimary};
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: .5px;
`);

const Tr = styled.tr(({ $c, $selected }) => `
  transition: all .2s ease;
  border-bottom: 1px solid ${$c.border};
  ${$selected ? `background: ${$c.primary}15; border-left: 3px solid ${$c.primary};` : ""}
  &:hover{ background: ${$c.hover}; }
`);

const Td = styled.td(({ $c }) => `
  padding: 14px 12px;
  color: ${$c.textPrimary};
  font-size: 14px;
`);

const Image = styled.img(({ $c }) => `
  width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid ${$c.border};
`);

const StatusBadge = styled.span(({ $c, $status }) => {
  let bg = $c.secondary, color = $c.secondary;
  if ($status === 'active') { bg = $c.success; color = $c.success; }
  if ($status === 'inactive') { bg = $c.error; color = $c.error; }
  if ($status === 'pending') { bg = $c.warning; color = $c.warning; }
  return `
    padding: 4px 10px; border-radius: 14px; font-size: 12px; font-weight: 600; text-transform: uppercase;
    background: ${bg}15; color: ${color}; border: 1px solid ${color}30;
  `;
});

const ActionButton = styled.button(({ $c }) => `
  background: ${$c.primary}; border: none; color: white; padding: 8px 10px; border-radius: 6px; cursor: pointer;
  font-size: 12px; font-weight: 600; margin: 0 4px; display: inline-flex; align-items: center; gap: 6px;
  transition: .2s ease; 
  &:hover{ background: ${$c.primaryDark}; transform: translateY(-1px); }
  &:disabled{ background: ${$c.textLight}; cursor: not-allowed; transform:none; }
`);

const ActionContainer = styled.div`
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
`;

const MenuContainer = styled.div`
  position: relative; display: inline-flex; align-items: center; justify-content: center; min-width: 36px;
`;

const MenuButton = styled.button(({ $c }) => `
  background: transparent; border: 1px solid ${$c.border}; color: ${$c.textSecondary}; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px;
  &:hover{ background: ${$c.hover}; border-color: ${$c.primary}; }
`);

const DropdownMenu = styled(motion.div)(({ $c }) => `
  position: absolute; right: 0; top: calc(100% + 6px); background: ${$c.background}; border: 1px solid ${$c.border}; border-radius: 8px; padding: 6px 0; min-width: 200px; z-index: 6000;
  box-shadow: 0 8px 20px rgba(0,0,0,.15);
`);

const MenuItem = styled.button(({ $c }) => `
  width: 100%; background: none; border:none; padding: 10px 12px; text-align: left; cursor: pointer; color: ${$c.textPrimary}; font-size: 14px; display:flex; align-items:center; gap: 10px;
  &:hover{ background: ${$c.primary}; color: white; }
  &:disabled{ color: ${$c.textLight}; cursor: not-allowed; &:hover{ background: transparent; color: ${$c.textLight}; } }
`);

const Footer = styled.div(({ $c }) => `
  display:flex; align-items:center; justify-content: space-between; padding: 12px; border-top: 1px solid ${$c.border};
`);

const PageBtn = styled.button(({ $c, $active }) => `
  width: 32px; height: 32px; border-radius: 16px; border: 1px solid ${$c.border}; background: ${$active ? $c.primary : $c.background}; color: ${$active ? '#fff' : $c.textPrimary};
`);

// ---------- UTILS ----------
const getVal = (row, key, accessor) => {
  if (typeof accessor === 'function') return accessor(row);
  if (!key) return undefined;
  return key.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), row);
};

const ensureDate = (v) => (v instanceof Date ? v : v ? new Date(v) : null);

// ---------- MAIN COMPONENT ----------
const SellerDataTable = ({
  columns = [],
  data = [],
  selectable = false,
  onSelectionChange,
  rowId,
  className,
  theme,
  filters,
  pagination
}) => {
  const $c = useTheme(theme);

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [openMenu, setOpenMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [selectValues, setSelectValues] = useState({});
  const [multiValues, setMultiValues] = useState({});
  const [dateValue, setDateValue] = useState("");
  const [rangeValue, setRangeValue] = useState({ from: "", to: "" });
  const [doubleRange, setDoubleRange] = useState({ leftFrom: "", leftTo: "", rightFrom: "", rightTo: "" });
  const [page, setPage] = useState(1);
  const pageSize = pagination?.pageSize || 10;
  const pageSizeOptions = pagination?.pageSizeOptions || [10, 20, 50];

  // preprocess rows with ids
  const processed = useMemo(() => {
    return data.map((row, idx) => ({
      ...row,
      _tableId: rowId ? rowId(row, idx) : row._tableId || `row-${idx}-${Math.random().toString(36).slice(2)}`
    }));
  }, [data, rowId]);

  // selection handlers
  const toggleRowSelection = (rowIdVal) => {
    const ns = new Set(selectedRows);
    if (ns.has(rowIdVal)) ns.delete(rowIdVal); else ns.add(rowIdVal);
    setSelectedRows(ns);
    onSelectionChange?.(Array.from(ns));
  };

  const toggleAll = () => {
    if (selectedRows.size === processed.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const all = processed.map(r => r._tableId);
      setSelectedRows(new Set(all));
      onSelectionChange?.(all);
    }
  };

  const closeOnOutside = () => setOpenMenu(null);
  useEffect(() => {
    document.addEventListener('click', closeOnOutside);
    return () => document.removeEventListener('click', closeOnOutside);
  }, []);

  // ------ FILTERING ------
  const filtered = useMemo(() => {
    let rows = [...processed];

    // search
    if (filters?.search && search.trim()) {
      const keys = typeof filters.search.keys === 'function'
        ? filters.search.keys
        : () => filters.search.keys || columns.filter(c => c.type !== 'actions').map(c => c.key);
      const keysArr = keys(rows[0] || {});
      const q = search.toLowerCase();
      rows = rows.filter(r => keysArr.some(k => (String(getVal(r, k)).toLowerCase()).includes(q)));
    }

    // selects
    if (filters?.selects?.length) {
      rows = rows.filter(r => filters.selects.every(s => {
        const v = selectValues[s.id];
        if (v === undefined || v === "" || v === null || v === 'ALL') return true;
        const rv = s.accessor ? s.accessor(r) : getVal(r, s.key);
        return String(rv) === String(v);
      }));
    }

    // multiselects
    if (filters?.multiselects?.length) {
      rows = rows.filter(r => filters.multiselects.every(m => {
        const sel = multiValues[m.id] || [];
        if (!sel.length) return true;
        const rv = m.accessor ? m.accessor(r) : getVal(r, m.key);
        if (Array.isArray(rv)) return sel.every(v => rv.includes(v));
        return sel.includes(rv);
      }));
    }

    // single date
    if (filters?.date && dateValue) {
      const acc = filters.date.accessor || ((row) => getVal(row, filters.date.key));
      rows = rows.filter(r => {
        const d = ensureDate(acc(r));
        if (!d) return false;
        return d.toDateString() === new Date(dateValue).toDateString();
      });
    }

    // date range
    if (filters?.daterange && (rangeValue.from || rangeValue.to)) {
      const acc = filters.daterange.accessor || ((row) => getVal(row, filters.daterange.key));
      rows = rows.filter(r => {
        const d = ensureDate(acc(r));
        if (!d) return false;
        const fromOk = rangeValue.from ? d >= new Date(rangeValue.from) : true;
        const toOk = rangeValue.to ? d <= new Date(rangeValue.to) : true;
        return fromOk && toOk;
      });
    }

    // double date range (left & right ranges independently)
    if (filters?.doubleDateRange && (doubleRange.leftFrom || doubleRange.leftTo || doubleRange.rightFrom || doubleRange.rightTo)) {
      const leftAcc = filters.doubleDateRange.leftAccessor || ((row) => getVal(row, filters.doubleDateRange.leftKey));
      const rightAcc = filters.doubleDateRange.rightAccessor || ((row) => getVal(row, filters.doubleDateRange.rightKey));
      rows = rows.filter(r => {
        const ld = ensureDate(leftAcc(r));
        const rd = ensureDate(rightAcc(r));
        const leftPass = (() => {
          if (!doubleRange.leftFrom && !doubleRange.leftTo) return true;
          if (!ld) return false;
          const fromOk = doubleRange.leftFrom ? ld >= new Date(doubleRange.leftFrom) : true;
          const toOk = doubleRange.leftTo ? ld <= new Date(doubleRange.leftTo) : true;
          return fromOk && toOk;
        })();
        const rightPass = (() => {
          if (!doubleRange.rightFrom && !doubleRange.rightTo) return true;
          if (!rd) return false;
          const fromOk = doubleRange.rightFrom ? rd >= new Date(doubleRange.rightFrom) : true;
          const toOk = doubleRange.rightTo ? rd <= new Date(doubleRange.rightTo) : true;
          return fromOk && toOk;
        })();
        return leftPass && rightPass;
      });
    }

    return rows;
  }, [processed, filters, search, selectValues, multiValues, dateValue, rangeValue, doubleRange, columns]);

  // ------ PAGINATION ------
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);

  // ------ CELL RENDER ------
  // ✅ Universal Action Button Component
  const TableActionButton = ({
    label,
    icon: Icon,
    variant = "primary",   // "primary" | "outline"
    size = "md",           // "sm" | "md" | "lg"
    onlyIcon = false,      // icon only
    onlyLabel = false,     // label only
    onClick,
    disabled,
    $c,
  }) => {
    return (
      <motion.button
        whileHover={!disabled ? { scale: 1.08, boxShadow: variant === "primary" ? "0 4px 10px rgba(0,0,0,0.2)" : "none" } : {}}
        whileTap={!disabled ? { scale: 0.94 } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        onClick={onClick}
        disabled={disabled}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: onlyIcon || onlyLabel ? 0 : 6,
          background:
            variant === "outline"
              ? "transparent"
              : disabled
              ? $c.textLight
              : $c.primary,
          color:
            variant === "outline"
              ? $c.primary
              : "#ffffff",
          border:
            variant === "outline"
              ? `1px solid ${$c.primary}`
              : "none",
          padding:
            size === "sm"
              ? "4px 7px"
              : size === "lg"
              ? "10px 16px"
              : "8px 12px",
          borderRadius: "6px",
          fontSize:
            size === "sm"
              ? "12px"
              : size === "lg"
              ? "15px"
              : "13px",
          fontWeight: 500,
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          minWidth: onlyIcon ? "30px" : "unset",
        }}
      >
        {!onlyLabel && Icon && <Icon size={14} />}
        {!onlyIcon && label}
      </motion.button>
    );
  };

  const renderCell = (row, col) => {
    const raw = col.accessor ? col.accessor(row) : row[col.key];
    const value = raw === undefined ? '' : raw;

    switch (col.type) {
      case 'image':
        return <Image $c={$c} src={value} alt={col.alt || ''} />;
      case 'status':
        return <StatusBadge $c={$c} $status={value}>{String(value)}</StatusBadge>;
      case 'custom':
        return col.render ? col.render(row) : value;
      case 'actions': {
        const menuItems = (col.menuItems || []).filter(mi => !asBool(mi.hidden, row));
        return (
          <ActionContainer>
                    {col.buttons?.map((btn, i) => {
          if (btn.hidden?.(row)) return null;
          return (
            <TableActionButton
              key={i}
              label={typeof btn.label === "function" ? btn.label(row) : btn.label}
              icon={btn.icon}
              variant={btn.variant || "primary"}     // new
              size={btn.size || "md"}                // new
              onlyIcon={btn.onlyIcon}                // new
              onlyLabel={btn.onlyLabel}              // new
              disabled={btn.disabled?.(row)}
              onClick={(e) => {
                e.stopPropagation();
                btn.onClick(row);
              }}
              $c={$c}
            />
          );
        })}


            {menuItems.length > 0 && (
              <MenuContainer>
                <MenuButton $c={$c} onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === row._tableId ? null : row._tableId); }}>
                  <CiMenuKebab />
                </MenuButton>
                {openMenu === row._tableId && (
                  <DropdownMenu
                    $c={$c}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: .2 }}
                  >
                    {menuItems.map((mi, idx) => (
                      <MenuItem
                        key={idx}
                        $c={$c}
                        onClick={(e) => { e.stopPropagation(); mi.onClick?.(row); setOpenMenu(null); }}
                        disabled={asBool(mi.disabled, row)}
                      >
                        {renderIcon(mi.icon, row)}
                        {getLabel(mi.label, row)}
                      </MenuItem>
                    ))}
                  </DropdownMenu>
                )}
              </MenuContainer>
            )}
          </ActionContainer>
        );
      }
      default:
        // ✅ FIX: Prevent React from crashing when value is an object
        if (typeof value === 'object' && value !== null) {
          try { return JSON.stringify(value); } catch { return '[object]'; }
        }
        return String(value);
    }
  };

  return (
    <TableContainer className={className} $c={$c}>
      {/* FILTER TOOLBAR */}
      {(filters?.search || filters?.selects?.length || filters?.multiselects?.length || filters?.date || filters?.daterange || filters?.doubleDateRange) && (
        <Toolbar $c={$c}>
          {filters?.search && (
            <SearchInput
              $c={$c}
              placeholder={filters.search.placeholder || 'Search...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {filters?.selects?.map(sel => (
            <Select key={sel.id} $c={$c} value={selectValues[sel.id] ?? ''} onChange={(e) => setSelectValues(v => ({ ...v, [sel.id]: e.target.value }))}>
              <option value="">{sel.label}</option>
              <option value="ALL">All</option>
              {sel.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          ))}

          {filters?.multiselects?.map(ms => (
            <Select key={ms.id} $c={$c} multiple value={multiValues[ms.id] || []} onChange={(e) => {
              const opts = Array.from(e.target.selectedOptions).map(o => o.value);
              setMultiValues(v => ({ ...v, [ms.id]: opts }));
            }}>
              <option disabled>{ms.label}</option>
              {ms.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          ))}

          {filters?.date && (
            <DateInput $c={$c} type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
          )}

          {filters?.daterange && (
            <>
              <DateInput $c={$c} type="date" value={rangeValue.from} onChange={(e) => setRangeValue(v => ({ ...v, from: e.target.value }))} />
              <DateInput $c={$c} type="date" value={rangeValue.to} onChange={(e) => setRangeValue(v => ({ ...v, to: e.target.value }))} />
            </>
          )}

          {filters?.doubleDateRange && (
            <>
              <DateInput $c={$c} type="date" value={doubleRange.leftFrom} onChange={(e) => setDoubleRange(v => ({ ...v, leftFrom: e.target.value }))} />
              <DateInput $c={$c} type="date" value={doubleRange.leftTo} onChange={(e) => setDoubleRange(v => ({ ...v, leftTo: e.target.value }))} />
              <DateInput $c={$c} type="date" value={doubleRange.rightFrom} onChange={(e) => setDoubleRange(v => ({ ...v, rightFrom: e.target.value }))} />
              <DateInput $c={$c} type="date" value={doubleRange.rightTo} onChange={(e) => setDoubleRange(v => ({ ...v, rightTo: e.target.value }))} />
            </>
          )}
        
          {/* <Select $c={$c} value={pageSize} onChange={() => {  }}>
            {pageSizeOptions.map(ps => <option key={ps} value={ps}>{ps} / page</option>)}
          </Select> */}
        
        </Toolbar>
      )}

      {/* TABLE */}
      <Table>
        <Thead $c={$c}>
          <tr>
            {selectable && (
              <Th $c={$c}>
                <input type="checkbox" checked={processed.length>0 && selectedRows.size===processed.length} onChange={toggleAll} />
              </Th>
            )}
            {columns.map(col => (
              <Th key={col.key} $c={$c}>{col.title}</Th>
            ))}
          </tr>
        </Thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr><Td $c={$c} colSpan={columns.length + (selectable?1:0)} style={{ textAlign:'center', padding:'28px' }}>No data</Td></tr>
          ) : pageData.map((row, rIdx) => (
            <Tr key={row._tableId} $c={$c} $selected={selectedRows.has(row._tableId)} onClick={() => selectable && toggleRowSelection(row._tableId)} style={{ cursor: selectable? 'pointer':'default' }}>
              {selectable && (
                <Td $c={$c}>
                  <input type="checkbox" checked={selectedRows.has(row._tableId)} onChange={(e)=>{ e.stopPropagation(); toggleRowSelection(row._tableId); }} onClick={(e)=> e.stopPropagation()} />
                </Td>
              )}
              {columns.map(col => (
                <Td key={col.key} $c={$c}>{renderCell(row, col)}</Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>

      {/* FOOTER / PAGINATION */}
      <Footer $c={$c}>
        <div style={{ color: $c.textSecondary, fontSize: 12 }}>
          Showing {(page-1)*pageSize + 1}-{Math.min(page*pageSize, filtered.length)} of {filtered.length}
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <PageBtn $c={$c} onClick={()=> setPage(p => Math.max(1, p-1))}>&lt;</PageBtn>
          {Array.from({ length: totalPages }).slice(0, 7).map((_,i)=>{
            const n = i+1;
            return <PageBtn key={n} $c={$c} $active={n===page} onClick={()=> setPage(n)}>{n}</PageBtn>;
          })}
          {totalPages>7 && <span style={{ color:$c.textSecondary }}>…</span>}
          {totalPages>7 && <PageBtn $c={$c} $active={page===totalPages} onClick={()=> setPage(totalPages)}>{totalPages}</PageBtn>}
          <PageBtn $c={$c} onClick={()=> setPage(p => Math.min(totalPages, p+1))}>&gt;</PageBtn>
        </div>
      </Footer>
    </TableContainer>
  );
};

// ---- helpers for actions ----
function getLabel(label, row){
  return typeof label === 'function' ? label(row) : label;
}
function asBool(v, row){
  return typeof v === 'function' ? !!v(row) : !!v;
}
function renderIcon(icon, row){
  if (!icon) return null;
  if (typeof icon === 'function' && !isReactComponent(icon)) {
    // treat as dynamic renderer
    return icon(row);
  }
  const Icon = icon;
  try { return <Icon size={16} />; } catch { return null; }
}
function isReactComponent(fn){
  // heuristic: component functions have capitalized name or displayName
  const name = fn.displayName || fn.name || '';
  return /^[A-Z]/.test(name);
}

export default SellerDataTable;
