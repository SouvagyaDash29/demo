import React, { useState } from 'react';
import { X, Plus, Upload, Copy, ChevronDown, Save, Eye, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLayout from '../Customer/CustomerLayout';
import styled from 'styled-components';

const DocumentSection = styled.div`
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h4`
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const DocumentItem = styled.div`
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  color: #334155;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const RequiredIndicator = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
  font-weight: 600;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 2px dashed #cbd5e1;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  color: #64748b;

  &:hover {
    border-color: #667eea;
    background: #f8fafc;
  }

  &::file-selector-button {
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    margin-right: 1rem;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
  }
`;


const AddProduct = () => {
  const [productType, setProductType] = useState('single');
  const [showVariations, setShowVariations] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [uploads, setUploads] = useState({})
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    price: "",
    stock: "",
    description: "",
    images: [], // up to 6 images
    activeImage: null, // currently shown in preview
  });

  const categories = ['Pooja Items', 'Flowers', 'Prasad', 'Lamps'];
  const units = ['Piece', 'Packet', 'Kg', 'Litre'];

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', values: [] }]);
  };

  const updateAttribute = (index, field, value) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = value;
    setAttributes(newAttrs);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const generateVariations = () => {
    if (attributes.length === 0 || attributes.some(attr => attr.values.length === 0)) return;

    const combinations = attributes.reduce((acc, attr) => {
      if (acc.length === 0) {
        return attr.values.map(val => ({ [attr.name]: val }));
      }
      const newCombos = [];
      acc.forEach(combo => {
        attr.values.forEach(val => {
          newCombos.push({ ...combo, [attr.name]: val });
        });
      });
      return newCombos;
    }, []);

    const newVariations = combinations.map((combo, idx) => ({
      id: idx,
      ...combo,
      price: '',
      stock: '',
      sku: '',
      description: '',
      image: null
    }));

    setVariations(newVariations);
    setShowVariations(true);
  };

  const updateVariation = (id, field, value) => {
    setVariations(variations.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const toggleVariationSelect = (id) => {
    setSelectedVariations(prev =>
      prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]
    );
  };

  const applyBulkUpdate = () => {
    if (!bulkAction || !bulkValue) return;
    
    setVariations(variations.map(v =>
      selectedVariations.includes(v.id) ? { ...v, [bulkAction]: bulkValue } : v
    ));
    setShowBulkModal(false);
    setSelectedVariations([]);
    setBulkValue('');
  };

    const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e, replaceIndex = null) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => {
      let updated = [...prev.images];

      if (replaceIndex !== null) {
        // Replace the specific image
        updated[replaceIndex] = newImages[0];
      } else {
        updated = [...updated, ...newImages].slice(0, 6);
      }

      return {
        ...prev,
        images: updated,
        activeImage: prev.activeImage || updated[0]?.url || null,
      };
    });
  };

  const handleImageClick = (imgUrl) => {
    setFormData((prev) => ({ ...prev, activeImage: imgUrl }));
  };

    // ❌ Remove image
  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        activeImage:
          prev.activeImage === prev.images[index]?.url
            ? updated[0]?.url || null
            : prev.activeImage,
      };
    });
  };

  // ↕️ Reorder images
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("dragIndex", index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("dragIndex");
    if (dragIndex === null) return;
    e.preventDefault();

    setFormData((prev) => {
      const updated = [...prev.images];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, dragged);
      return { ...prev, images: updated };
    });
  };

  const handleDragOver = (e) => e.preventDefault();


    const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#05124bff",
    marginBottom: "8px",
  };

  return (
    <CustomerLayout>
    <div style={{
      minHeight: '100vh',
      background: '#f3f6ffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #b4baffff',
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
            Dashboard → Products → Add Product
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#2B2B2B', margin: 0 }}>
              Add New Product
            </h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '10px 20px',
                border: '1px solid #b4bcffff',
                background: '#FFFFFF',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#05124bff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Save size={16} /> Save as Draft
              </button>
              <button style={{
                padding: '10px 20px',
                border: 'none',
                background: '#0055ffff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(255,122,0,0.25)'
              }}>
                <Eye size={16} /> Publish Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        {/* Product Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2B2B2B', marginBottom: '16px' }}>
            Product Type
          </h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['single', 'variations'].map(type => (
              <motion.div
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProductType(type)}
                style={{
                  flex: 1,
                  padding: '20px',
                  border: `2px solid ${productType === type ? '#0044ffff' : '#b4d8ffff'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: productType === type ? '#ebf5ffff' : '#FFFFFF',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${productType === type ? '#0062ffff' : '#DDD'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: productType === type ? '#0044ffff' : '#FFFFFF'
                  }}>
                    {productType === type && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFF' }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2B2B2B', fontSize: '15px' }}>
                      {type === 'single' ? 'Single Product' : 'Product with Variations'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      {type === 'single' ? 'One price, one stock level' : 'Multiple sizes, colors, or options'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
          {/* Main Form */}
          <div>
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2B2B2B', marginBottom: '20px' }}>
                Basic Information
              </h3>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05304bff', marginBottom: '8px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Premium Incense Sticks"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b4c9ffff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box'
                    }}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onFocus={(e) => e.target.style.border = '1px solid #0077ffff'}
                    onBlur={(e) => e.target.style.border = '1px solid #b4daffff'}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05234bff', marginBottom: '8px' }}>
                      Category *
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b4d3ffff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}>
                      <option>Select category</option>
                      {categories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05114bff', marginBottom: '8px' }}>
                      Unit *
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b4ccffff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    >
                      <option>Select unit</option>
                      {units.map(unit => <option key={unit}>{unit}</option>)}
                    </select>
                  </div>
                </div>

                {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05304bff', marginBottom: '8px' }}>
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b4c9ffff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box'
                    }}
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    onFocus={(e) => e.target.style.border = '1px solid #0077ffff'}
                    onBlur={(e) => e.target.style.border = '1px solid #b4daffff'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05304bff', marginBottom: '8px' }}>
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b4c9ffff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box'
                    }}
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    onFocus={(e) => e.target.style.border = '1px solid #0077ffff'}
                    onBlur={(e) => e.target.style.border = '1px solid #b4daffff'}
                  />
                </div>
                </div> */}

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05124bff', marginBottom: '8px' }}>
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your product..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #b4c9ffff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      minHeight: '100px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    onFocus={(e) => e.target.style.border = '1px solid #0059ffff'}
                    onBlur={(e) => e.target.style.border = '1px solid #b4c4ffff'}
                  />
                </div>

                <div>
                    <label style={labelStyle}>Upload Images (up to 6)</label>
                    <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "block" }}
                    />
                    </div>
              </div>
            </motion.div>

            {/* Variations Section */}
            <AnimatePresence>
              {productType === 'variations' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    overflow: 'hidden'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2B2B2B', marginBottom: '16px' }}>
                    Variation Attributes
                  </h3>

                  {attributes.map((attr, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        padding: '16px',
                        border: '1px solid #b4d2ffff',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        background: '#f6f3ffff'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                        <input
                          type="text"
                          placeholder="Attribute name (e.g., Size)"
                          value={attr.name}
                          onChange={(e) => updateAttribute(idx, 'name', e.target.value)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #b4ccffff',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <button
                          onClick={() => removeAttribute(idx)}
                          style={{
                            padding: '10px',
                            border: 'none',
                            background: '#b4d1ffff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#12054bff'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Values (comma separated, e.g., Small, Medium, Large)"
                        onChange={(e) => updateAttribute(idx, 'values', e.target.value.split(',').map(v => v.trim()))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #b4c6ffff',
                          borderRadius: '6px',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </motion.div>
                  ))}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button
                      onClick={addAttribute}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px dashed #000dffff',
                        background: '#ebf3ffff',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#003cffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Plus size={16} /> Add Attribute
                    </button>
                    {attributes.length > 0 && (
                      <button
                        onClick={generateVariations}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: 'none',
                          background: '#0008ffff',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#FFFFFF',
                          boxShadow: '0 4px 12px rgba(255,122,0,0.25)'
                        }}
                      >
                        Generate Variations
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Single Product Pricing */}
            <AnimatePresence>
              {productType === 'single' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2B2B2B', marginBottom: '20px' }}>
                    Pricing & Inventory
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#07054bff', marginBottom: '8px' }}>
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #b4bfffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0d054bff', marginBottom: '8px' }}>
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #b4beffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05054bff', marginBottom: '8px' }}>
                        SKU
                      </label>
                      <input
                        type="text"
                        placeholder="Auto-generated"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #b4c2ffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05064bff', marginBottom: '8px' }}>
                        Low Stock Alert
                      </label>
                      <input
                        type="number"
                        placeholder="10"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #b4c2ffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                position: 'sticky',
                top: '100px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2B2B2B', marginBottom: '16px' }}>
                Product Preview
              </h3>

              <div style={{
                border: '2px dashed #b4d1ffff',
                borderRadius: '12px',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                background: '#f6f3ffff',
                // cursor: 'pointer',
                overflow: "hidden",
                }}
                onClick={() => document.getElementById("imageInput").click()}
            >
                {formData.activeImage ? (
                <img
                    src={formData.activeImage}
                    alt="Preview"
                    style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    }}
                />
                ) : (
                <div style={{ textAlign: "center", color: "#999" }}>
                    <Upload size={32} style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: "13px" }}>Upload Image</div>
                </div>
                )}
            </div>

                {/* Small thumbnails */}
      {formData.images.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            justifyContent: "center",
          }}
        >
          {formData.images.map((img, i) => (
             <div
              key={i}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onDragOver={handleDragOver}
              style={{
                position: "relative",
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                overflow: "hidden",
                border:
                  formData.activeImage === img.url
                    ? "2px solid #0059ff"
                    : "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={img.url}
                alt={`thumb-${i}`}
                onClick={() => handleImageClick(img.url)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(i);
                }}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "#fff",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} color="#d33" />
              </button>

              {/* Replace Button */}
              <label
                htmlFor={`replace-${i}`}
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  background: "#0059ff",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Replace Image"
              >
                +
              </label>
              <input
                type="file"
                id={`replace-${i}`}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, i)}
              />
            </div>
          ))}
        </div>
      )}

              <div style={{ padding: '16px', background: '#f3f7ffff', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#2B2B2B', marginBottom: '8px' }}>
                  {formData.name || "Product Name"}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                  {formData.category || "Category"} • {formData.unit || "Unit"}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#0022ffff' }}>
                  ₹{formData.price || "0.00"}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  Stock: {formData.stock || "0"} units
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '16px', background: '#ebf2ffff', borderRadius: '8px', border: '1px solid #b4cdffff' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#050e4bff', marginBottom: '8px' }}>
                  💡 Quick Tips
                </div>
                <ul style={{ fontSize: '12px', color: '#666', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}>
                  <li>Use high-quality images (min 800x800px)</li>
                  <li>Write clear, descriptive titles</li>
                  <li>Add relevant keywords for search</li>
                  <li>Set competitive prices</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

                  {/* Variations Grid */}
            <AnimatePresence>
              {showVariations && variations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2B2B2B' }}>
                      Variations ({variations.length})
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setBulkAction('price');
                          setShowBulkModal(true);
                        }}
                        disabled={selectedVariations.length === 0}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #b4d2ffff',
                          background: selectedVariations.length === 0 ? '#F5F5F5' : '#FFFFFF',
                          borderRadius: '6px',
                          cursor: selectedVariations.length === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '13px',
                          color: '#05134bff',
                          opacity: selectedVariations.length === 0 ? 0.5 : 1
                        }}
                      >
                        Bulk Update
                      </button>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #b4d5ffff' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#05064bff' }}>
                            <input
                              type="checkbox"
                              onChange={(e) => setSelectedVariations(e.target.checked ? variations.map(v => v.id) : [])}
                              style={{ cursor: 'pointer' }}
                            />
                          </th>
                          {attributes.map(attr => (
                            <th key={attr.name} style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#07054bff' }}>
                              {attr.name}
                            </th>
                          ))}
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#0e054bff' }}>Price (₹)</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#0a054bff' }}>Stock</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#07054bff' }}>SKU</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#07054bff' }}>Image</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variations.map((variation) => (
                          <tr key={variation.id} style={{ borderBottom: '1px solid #b4b5ffff' }}>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="checkbox"
                                checked={selectedVariations.includes(variation.id)}
                                onChange={() => toggleVariationSelect(variation.id)}
                                style={{ cursor: 'pointer' }}
                              />
                            </td>
                            {attributes.map(attr => (
                              <td key={attr.name} style={{ padding: '12px', fontSize: '14px', color: '#2B2B2B' }}>
                                {variation[attr.name]}
                              </td>
                            ))}
                            <td style={{ padding: '12px' }}>
                              <input
                                type="number"
                                value={variation.price}
                                onChange={(e) => updateVariation(variation.id, 'price', e.target.value)}
                                placeholder="0"
                                style={{
                                  width: '80px',
                                  padding: '8px',
                                  border: '1px solid #b4bcffff',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="number"
                                value={variation.stock}
                                onChange={(e) => updateVariation(variation.id, 'stock', e.target.value)}
                                placeholder="0"
                                style={{
                                  width: '80px',
                                  padding: '8px',
                                  border: '1px solid #b4beffff',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="text"
                                value={variation.sku}
                                onChange={(e) => updateVariation(variation.id, 'sku', e.target.value)}
                                placeholder="AUTO"
                                style={{
                                  width: '100px',
                                  padding: '8px',
                                  border: '1px solid #b4c9ffff',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <input
                                type="File"
                                value={variation.sku}
                                onChange={(e) => updateVariation(variation.id, 'sku', e.target.value)}
                                placeholder="AUTO"
                                style={{
                                  width: '100px',
                                  padding: '8px',
                                  border: '1px solid #b4c9ffff',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

      {/* Bulk Update Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowBulkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '32px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2B2B2B', margin: 0 }}>
                  Bulk Update Variations
                </h3>
                <button
                  onClick={() => setShowBulkModal(false)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: '#b4c7ffff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#05174bff',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05104bff', marginBottom: '8px' }}>
                  Field to Update
                </label>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #b4c4ffff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="sku">SKU</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#05134bff', marginBottom: '8px' }}>
                  New Value
                </label>
                <input
                  type={bulkAction === 'sku' ? 'text' : 'number'}
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  placeholder={`Enter ${bulkAction}`}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #b4c6ffff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ padding: '12px', background: '#ebf1ffff', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  <strong>{selectedVariations.length}</strong> variations selected
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowBulkModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #b4c7ffff',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#05104bff'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={applyBulkUpdate}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    background: '#0048ffff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(255,122,0,0.25)'
                  }}
                >
                  Apply to Selected
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </CustomerLayout>
  );
};

export default AddProduct;