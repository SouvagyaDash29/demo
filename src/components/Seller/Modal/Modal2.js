// ReusableComponents/Modals.jsx
import { motion } from "framer-motion";

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <motion.div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <motion.div style={{ background: 'white', padding: 24, borderRadius: 16, maxWidth: 400, width: '100%' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px' }}>{title}</h3>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: 10, borderRadius: 8, background: '#0008ff', color: 'white' }}>Confirm</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const BulkUpdateModal = ({ isOpen, onClose, onApply, action, setAction, value, setValue }) => {
  if (!isOpen) return null;
  return (
    <motion.div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <motion.div style={{ background: 'white', padding: 24, borderRadius: 16, maxWidth: 400, width: '100%' }} onClick={e => e.stopPropagation()}>
        <h3>Bulk Update</h3>
        <select value={action} onChange={e => setAction(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid #b4c9ff' }}>
          <option value="price">Price</option>
          <option value="stock">Stock</option>
        </select>
        <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder={`Enter ${action}`} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #b4c9ff' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}>Cancel</button>
          <button onClick={onApply} style={{ flex: 1, padding: 10, borderRadius: 8, background: '#0008ff', color: 'white' }}>Apply</button>
        </div>
      </motion.div>
    </motion.div>
  );
};