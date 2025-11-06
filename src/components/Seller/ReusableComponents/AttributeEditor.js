// ReusableComponents/AttributeEditor.js
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import styled from "styled-components";

const AttributeCard = styled(motion.div)`
  padding: 20px;
  border: 2px solid ${props => props.$isPrimary ? '#0008ff' : '#b4d2ff'};
  border-radius: 12px;
  margin-bottom: 12px;
  background: ${props => props.$isPrimary ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : '#f9f9f9'};
  position: relative;
`;

const PrimaryBadge = styled.div`
  position: absolute; top: 12px; right: 12px;
  background: #0008ff; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
`;

const ValueCheckbox = styled.label`
  display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px;
  background: ${props => props.$checked ? '#dbeafe' : 'white'};
  border: 2px solid ${props => props.$checked ? '#0008ff' : '#e2e8f0'};
  cursor: pointer; user-select: none; font-size: 13px;
`;

const PriceInputGroup = styled.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px;
  background: white; border-radius: 8px;
`;

export const AttributeEditor = ({
  attr, idx, updateAttribute, variationList, toggleValue,
  togglePriceSettings, toggleDiscountSettings,
  updateValuePrice, updateValueDiscount,
  attributes, isPrimary, onPrimaryChange
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleVariationChange = (e) => {
    const name = e.target.value;
    const selected = variationList.find(v => v.name === name);
    updateAttribute(idx, "name", name);
    updateAttribute(idx, "allValues", selected ? selected.v_list.map(v => v[1]).filter(v => v && v !== "Not Selected") : []);
  };

  const handleAddCustom = () => {
    if (customValue && !attr.allValues.includes(customValue)) {
      updateAttribute(idx, "allValues", [...attr.allValues, customValue]);
      toggleValue(idx, customValue);
    }
    setCustomValue(""); setShowCustomInput(false);
  };

  return (
    <AttributeCard $isPrimary={isPrimary}>
      {/* {isPrimary && <PrimaryBadge>Primary (Images)</PrimaryBadge>} */}

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select
          value={attr.name}
          onChange={handleVariationChange}
          style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #b4c9ff' }}
        >
          <option value="">Select Variation Type</option>
          {variationList.map(v => (
            <option key={v.id} value={v.name} disabled={attributes.some((a, i) => i !== idx && a.name === v.name)}>
              {v.name}
            </option>
          ))}
        </select>

        <button onClick={() => updateAttribute(idx, "remove")} style={{ padding: '10px 16px', background: '#fee', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8 }}>
          <Trash2 size={16} />
        </button>
      </div>

      {attr.name && (
        <>
          <strong>Select values for {attr.name.toLowerCase()}</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginTop: 8 }}>
            {attr.allValues.map(val => (
              <ValueCheckbox key={val} $checked={attr.selectedValues.includes(val)}>
                <input type="checkbox" checked={attr.selectedValues.includes(val)} onChange={() => toggleValue(idx, val)} />
                {val}
              </ValueCheckbox>
            ))}
          </div>
            
          <div style={{display: "flex",  alignItems: "center", gap: 10, marginTop: 12}}>
            <button onClick={() => setShowCustomInput(true)} style={{ padding: '8px 12px', borderRadius: 8, background: '#f0f4ff', border: '1px solid #b4c9ff' }}>
              <Plus size={16} /> Add Custom {attr.name}
            </button>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: isPrimary ? '#0008ff' : '#05124b' }}>
              <input type="checkbox" checked={isPrimary} onChange={e => onPrimaryChange(idx, e.target.checked)} disabled={!attr.name} />
              Primary Variation
            </label>
          </div>

          <AnimatePresence>
            {showCustomInput && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={customValue} onChange={e => setCustomValue(e.target.value)} placeholder={`Custom ${attr.name.toLowerCase()}`} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #b4c9ff' }} />
                  <button onClick={handleAddCustom} style={{ background: '#0008ff', color: 'white', padding: '0 16px', borderRadius: 8 }}>Add</button>
                  <button onClick={() => { setShowCustomInput(false); setCustomValue(""); }} style={{ padding: '0 16px', borderRadius: 8, border: '1px solid #ccc' }}>Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {attr.selectedValues.length > 0 && (
            <>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <input type="checkbox" checked={attr.enabled} onChange={() => togglePriceSettings(idx)} />
                Set additional price per value
              </label>
              <AnimatePresence>
                {attr.enabled && attr.selectedValues.map(val => (
                  <PriceInputGroup key={val}>
                    <span style={{ minWidth: 80, fontSize: 13 }}>{val}</span>
                    <input type="number" placeholder="0" value={attr.valuePrices[val] || ""} onChange={e => updateValuePrice(idx, val, e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                    <span>₹</span>
                  </PriceInputGroup>
                ))}
              </AnimatePresence>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <input type="checkbox" checked={attr.enabledDiscount} onChange={() => toggleDiscountSettings(idx)} />
                Set discount per value
              </label>
              <AnimatePresence>
                {attr.enabledDiscount && attr.selectedValues.map(val => (
                  <PriceInputGroup key={val}>
                    <span style={{ minWidth: 80, fontSize: 13 }}>{val}</span>
                    <input type="number" placeholder="0" value={attr.valueDiscounts[val] || ""} onChange={e => updateValueDiscount(idx, val, e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                    <span>%</span>
                  </PriceInputGroup>
                ))}
              </AnimatePresence>
            </>
          )}
        </>
      )}
    </AttributeCard>
  );
};