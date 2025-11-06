import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Plus,
  Upload,
  Save,
  Eye,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomerLayout from "../Customer/CustomerLayout";
import styled from "styled-components";

// Responsive Layout
const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 400px;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;

  @media (min-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

const FormHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2b2b2b;
  margin: 0 0 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #05304b;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #b4c9ff;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #0077ff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #b4c9ff;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: #0077ff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #b4c9ff;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    border-color: #0059ff;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  border: 1px solid #b4bcff;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #05124b;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;

  &:hover {
    background: #f0f4ff;
  }

  ${({ primary }) =>
    primary &&
    `
    background: #0008ff;
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 136, 255, 0.25);
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #05124b;
  cursor: pointer;
`;

const ImagePreview = styled.div`
  border: 2px dashed #b4d1ff;
  border-radius: 12px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f3ff;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Predefined Attributes
const PREDEFINED_ATTRIBUTES = {
  Size: ["S", "M", "L", "XL", "XXL"],
  Color: ["Red", "Blue", "Green", "Black", "White", "Yellow"],
  Material: ["Cotton", "Polyester", "Wool", "Silk"],
  Weight: ["100g", "250g", "500g", "1kg"],
};

// Reusable Image Uploader
const ImageUploader = ({ images, onChange, max = 6, activeImage, setActiveImage }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e, replaceIndex = null) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));

    onChange((prev) => {
      let updated = [...(prev || [])];
      if (replaceIndex !== null) {
        updated[replaceIndex] = newImages[0];
      } else {
        updated = [...updated, ...newImages].slice(0, max);
      }
      return updated;
    });
  };

  const removeImage = (index) => {
    onChange((prev) => {
      const updated = (prev || []).filter((_, i) => i !== index);
      if (activeImage === (prev || [])[index]?.url) {
        setActiveImage(updated[0]?.url || null);
      }
      return updated;
    });
  };

  const handleDragStart = (e, i) => e.dataTransfer.setData("index", i);
  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("index");
    if (dragIndex == dropIndex) return;
    e.preventDefault();
    onChange((prev) => {
      const updated = [...(prev || [])];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, dragged);
      return updated;
    });
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", marginBottom: "12px" }}>
        <Upload size={16} /> Upload Images ({(images || []).length}/{max})
      </Button>

      {images?.length > 0 && (
        <ThumbnailGrid>
          {images.map((img, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onDragOver={(e) => e.preventDefault()}
              style={{
                position: "relative",
                width: 60,
                height: 60,
                borderRadius: 8,
                overflow: "hidden",
                border: activeImage === img.url ? "2px solid #0059ff" : "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <img
                src={img.url}
                alt=""
                onClick={() => setActiveImage(img.url)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "50%",
                  padding: 2,
                }}
              >
                <X size={12} color="#d33" />
              </button>
              <label
                htmlFor={`replace-${i}`}
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  background: "#0059ff",
                  color: "white",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                +
              </label>
              <input
                id={`replace-${i}`}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, i)}
              />
            </div>
          ))}
        </ThumbnailGrid>
      )}
    </div>
  );
};

// Attribute Editor Component
const AttributeEditor = ({ attr, idx, updateAttribute, toggleValue, togglePriceSettings, updateValuePrice, toggleImageSettings, updateValueImages, addCustomValue, attributes, }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleAddCustom = () => {
    if (customValue && !attr.allValues.includes(customValue)) {
      updateAttribute(idx, "allValues", [...attr.allValues, customValue]);
      toggleValue(idx, customValue); // Auto-select new custom value
    }
    setCustomValue("");
    setShowCustomInput(false);
  };

  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        padding: 16,
        border: "1px solid #b4d2ff",
        borderRadius: 8,
        marginBottom: 12,
        background: "#f6f3ff",
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Select
          value={attr.name}
          onChange={(e) => updateAttribute(idx, "name", e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">Select Attribute</option>
          {Object.keys(PREDEFINED_ATTRIBUTES).map((key) => (
            <option
              key={key}
              disabled={attributes.some((a, i) => i !== idx && a.name === key)}
            >
              {key}
            </option>
          ))}
        </Select>
        <button
          onClick={() => updateAttribute(idx, "remove")}
          style={{ padding: 8, background: "#b4d1ff", border: "none", borderRadius: 6 }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {attr.name && (
        <>
          <Label>Select Values</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {attr.allValues.map((val) => (
              <label
                key={val}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={attr.selectedValues.includes(val)}
                  onChange={() => toggleValue(idx, val)}
                />
                {val}
              </label>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Button onClick={() => setShowCustomInput(true)}>
              <Plus size={16} /> Add Custom {attr.name}
            </Button>
            <ToggleLabel>
              <input
                type="checkbox"
                checked={attr.enabledImages}
                onChange={() => toggleImageSettings(idx)}
              />
              Enable image upload for this attribute
            </ToggleLabel>
          </div>

          <AnimatePresence>
            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: 12 }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <Input
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder={`Enter custom ${attr.name.toLowerCase()}`}
                  />
                  <Button onClick={handleAddCustom}>Add</Button>
                  <Button onClick={() => setShowCustomInput(false)}>Cancel</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {attr.selectedValues.length > 0 && (
            <>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={attr.enabled}
                  onChange={() => togglePriceSettings(idx)}
                />
                Set additional price per value
              </label>

              <AnimatePresence>
                {attr.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: 12 }}
                  >
                    {attr.selectedValues.map((val) => (
                      <div key={val} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <span style={{ width: 60, fontSize: 12, fontWeight: 500 }}>{val}</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={attr.valuePrices[val] || ""}
                          onChange={(e) => updateValuePrice(idx, val, e.target.value)}
                          style={{ flex: 1, fontSize: 12 }}
                        />
                        <span style={{ fontSize: 12, color: "#666" }}>₹</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {attr.enabledImages && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: 12 }}
                  >
                    {attr.selectedValues.map((val) => (
                      <div key={val} style={{ marginBottom: 16 }}>
                        <Label>Images for {val}</Label>
                        <ImageUploader
                          images={attr.valueImages[val] || []}
                          onChange={(updater) => updateValueImages(idx, val, updater(attr.valueImages[val] || []))}
                          max={6}
                          activeImage={attr.valueActiveImages?.[val] || null}
                          setActiveImage={(url) => {
                            // Optional: track active per value if needed
                          }}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

// Variation Row Component
const VariationRow = ({ v, attributes, selectedVariations, toggleVariationSelect, updateVariation, calculateAdditionalPrice }) => {
  const add = calculateAdditionalPrice(v);
  return (
    <tr key={v.id} style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ padding: "8px 4px" }}>
        <input
          type="checkbox"
          checked={selectedVariations.includes(v.id)}
          onChange={() => toggleVariationSelect(v.id)}
        />
      </td>
      {attributes.map((a) => (
        <td key={a.name} style={{ padding: "8px 4px" }}>
          {v[a.name]}
        </td>
      ))}
      <td style={{ padding: "8px 4px" }}>
        <Input
          type="number"
          value={v.price}
          onChange={(e) => updateVariation(v.id, "price", e.target.value)}
          style={{ width: 70 }}
        />
      </td>
      <td style={{ padding: "8px 4px", color: "#090" }}>+{add}</td>
      <td style={{ padding: "8px 4px", fontWeight: 600 }}>
        ₹{v.totalPrice || 0}
      </td>
      <td style={{ padding: "8px 4px" }}>
        <Input
          type="number"
          value={v.stock}
          onChange={(e) => updateVariation(v.id, "stock", e.target.value)}
          style={{ width: 60 }}
        />
      </td>
      <td style={{ padding: "8px 4px" }}>
        <ImageUploader
          images={v.images}
          onChange={(updater) => updateVariation(v.id, "images", updater(v.images))}
          activeImage={v.activeImage}
          setActiveImage={(url) => updateVariation(v.id, "activeImage", url)}
          max={6}
        />
      </td>
    </tr>
  );
};

const AddProduct = () => {
  const [hasVariations, setHasVariations] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("price");
  const [bulkValue, setBulkValue] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    price: "",
    stock: "",
    description: "",
    images: [],
    activeImage: null,
  });

  const categories = ["Pooja Items", "Flowers", "Prasad", "Lamps"];
  const units = ["Piece", "Packet", "Kg", "Litre"];

  // Re-calculate total price when attributes change
  useEffect(() => {
    if (variations.length > 0) {
      setVariations((vars) =>
        vars.map((v) => ({
          ...v,
          totalPrice: (parseFloat(v.price) || 0) + calculateAdditionalPrice(v),
        }))
      );
    }
  }, [attributes]);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        name: "",
        allValues: [],
        selectedValues: [],
        enabled: false,
        valuePrices: {},
        enabledImages: false,
        valueImages: {},
        valueActiveImages: {},
      },
    ]);
  };

  const updateAttribute = (idx, field, value) => {
    setAttributes((attrs) =>
      attrs.map((a, i) => {
        if (i !== idx) return a;
        if (field === "remove") return null; // For removal
        if (field === "name") {
          const allValues = PREDEFINED_ATTRIBUTES[value] || [];
          return {
            ...a,
            name: value,
            allValues,
            selectedValues: [],
            valuePrices: {},
            enabled: false,
            valueImages: {},
            enabledImages: false,
          };
        }
        if (field === "allValues") {
          return { ...a, allValues: value };
        }
        return { ...a, [field]: value };
      }).filter(Boolean)
    );
  };

  const toggleValue = (attrIdx, value) => {
    setAttributes((attrs) =>
      attrs.map((a, i) => {
        if (i !== attrIdx) return a;
        const selected = a.selectedValues.includes(value)
          ? a.selectedValues.filter((v) => v !== value)
          : [...a.selectedValues, value];
        const valuePrices = { ...a.valuePrices };
        const valueImages = { ...a.valueImages };
        if (!selected.includes(value)) {
          delete valuePrices[value];
          delete valueImages[value];
        }
        return { ...a, selectedValues: selected, valuePrices, valueImages };
      })
    );
  };

  const togglePriceSettings = (idx) => {
    setAttributes((attrs) =>
      attrs.map((a, i) =>
        i === idx ? { ...a, enabled: !a.enabled } : a
      )
    );
  };

  const updateValuePrice = (attrIdx, value, price) => {
    setAttributes((attrs) =>
      attrs.map((a, i) =>
        i === attrIdx
          ? { ...a, valuePrices: { ...a.valuePrices, [value]: price } }
          : a
      )
    );
  };

  const toggleImageSettings = (idx) => {
    setAttributes((attrs) =>
      attrs.map((a, i) =>
        i === idx ? { ...a, enabledImages: !a.enabledImages } : a
      )
    );
  };

  const updateValueImages = (attrIdx, value, images) => {
    setAttributes((attrs) =>
      attrs.map((a, i) =>
        i === attrIdx
          ? { ...a, valueImages: { ...a.valueImages, [value]: images } }
          : a
      )
    );
  };

  const calculateAdditionalPrice = (variation) => {
    return attributes.reduce((sum, attr) => {
      if (!attr.enabled) return sum;
      const val = variation[attr.name];
      return sum + (parseFloat(attr.valuePrices[val]) || 0);
    }, 0);
  };

  const generateVariations = () => {
    const validAttrs = attributes.filter(
      (a) => a.name && a.selectedValues.length > 0
    );
    if (validAttrs.length === 0) return;

    const combos = validAttrs.reduce((acc, attr) => {
      if (acc.length === 0)
        return attr.selectedValues.map((v) => ({ [attr.name]: v }));
      return acc.flatMap((c) =>
        attr.selectedValues.map((v) => ({ ...c, [attr.name]: v }))
      );
    }, []);

    const newVars = combos.map((c, i) => {
      let images = [];
      attributes.forEach((attr) => {
        if (attr.enabledImages) {
          const val = c[attr.name];
          images = [...images, ...(attr.valueImages[val] || [])];
        }
      });
      return {
        id: Date.now() + i,
        ...c,
        price: "",
        stock: "",
        sku: "",
        images,
        activeImage: images[0]?.url || null,
      };
    });

    setVariations(newVars);
  };

  const updateVariation = (id, field, value) => {
    setVariations((vars) =>
      vars.map((v) =>
        v.id === id
          ? {
              ...v,
              [field]: value,
              totalPrice:
                (parseFloat(field === "price" ? value : v.price) || 0) +
                calculateAdditionalPrice(v),
            }
          : v
      )
    );
  };

  const toggleVariationSelect = (id) => {
    setSelectedVariations((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const applyBulkUpdate = () => {
    if (!bulkValue) return;
    setVariations((vars) =>
      vars.map((v) =>
        selectedVariations.includes(v.id)
          ? {
              ...v,
              [bulkAction]: bulkValue,
              totalPrice:
                (parseFloat(bulkAction === "price" ? bulkValue : v.price) || 0) +
                calculateAdditionalPrice(v),
            }
          : v
      )
    );
    setShowBulkModal(false);
    setSelectedVariations([]);
    setBulkValue("");
  };

  const hasVariationsToShow = variations.length > 0;

  return (
    <CustomerLayout>
      <div style={{ minHeight: "100vh", background: "#f3f6ff", fontFamily: "-apple-system, sans-serif" }}>
        {/* Header */}
        <header
          style={{
            background: "#fff",
            borderBottom: "1px solid #b4baff",
            padding: "12px 16px",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
              Dashboard → Products → Add Product
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Add New Product</h1>
              <div style={{ display: "flex", gap: 8 }}>
                <Button>
                  <Save size={16} /> Draft
                </Button>
                <Button primary>
                  <Eye size={16} /> Publish
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1400, margin: "0 auto", padding: "16px" }}>
          <ResponsiveGrid>
            {/* Left: Form */}
            <div>
              {/* Basic Info */}
              <Card>
                <FormHeader>Basic Information</FormHeader>
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <Label>Product Name *</Label>
                    <Input
                      placeholder="e.g., Premium Incense Sticks"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <Grid>
                    <div>
                      <Label>Category *</Label>
                      <Select
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                      >
                        <option value="">Select</option>
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label>Unit *</Label>
                      <Select
                        value={formData.unit}
                        onChange={(e) => handleInputChange("unit", e.target.value)}
                      >
                        <option value="">Select</option>
                        {units.map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </Select>
                    </div>
                  </Grid>
                  <div>
                    <FormHeader>Pricing & Inventory</FormHeader>
                    <Grid>
                      <div>
                        <Label>Price (₹) *</Label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Stock *</Label>
                        <Input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => handleInputChange("stock", e.target.value)}
                        />
                      </div>
                    </Grid>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <TextArea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>
                  <ImageUploader
                    images={formData.images}
                    onChange={(updater) =>
                      setFormData((prev) => {
                        const images = updater(prev.images);
                        return {
                          ...prev,
                          images,
                          activeImage: prev.activeImage || images[0]?.url || null,
                        };
                      })
                    }
                    activeImage={formData.activeImage}
                    setActiveImage={(url) => handleInputChange("activeImage", url)}
                  />
                </div>

                {/* Toggle: Has Variations */}
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
                  <ToggleLabel>
                    <input
                      type="checkbox"
                      checked={hasVariations}
                      onChange={(e) => {
                        setHasVariations(e.target.checked);
                        if (!e.target.checked) {
                          setVariations([]);
                          setAttributes([]);
                        }
                      }}
                    />
                    Product has variations?
                  </ToggleLabel>
                </div>
              </Card>

              {/* Variation Attributes */}
              <AnimatePresence>
                {hasVariations && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card>
                      <FormHeader>Variation Attributes</FormHeader>
                      {attributes.map((attr, idx) => (
                        <AttributeEditor
                          key={idx}
                          attr={attr}
                          idx={idx}
                          updateAttribute={updateAttribute}
                          toggleValue={toggleValue}
                          togglePriceSettings={togglePriceSettings}
                          updateValuePrice={updateValuePrice}
                          toggleImageSettings={toggleImageSettings}
                          updateValueImages={updateValueImages}
                          // addCustomValue={() => {}}
                          attributes={attributes}
                        />
                      ))}

                      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                        <Button onClick={addAttribute} style={{ flex: 1 }}>
                          <Plus size={16} /> Add Attribute
                        </Button>
                        {attributes.some((a) => a.selectedValues.length > 0) && (
                          <Button primary onClick={generateVariations} style={{ flex: 1 }}>
                            Generate Variations
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Preview */}
            <div>
              <Card>
                <Label>Product Preview</Label>
                <ImagePreview>
                  {formData.activeImage ? (
                    <img src={formData.activeImage} alt="Preview" />
                  ) : (
                    <div style={{ textAlign: "center", color: "#999" }}>
                      <Upload size={32} />
                      <div style={{ fontSize: 13 }}>No Image</div>
                    </div>
                  )}
                </ImagePreview>
                <div style={{ padding: 12, background: "#f3f7ff", borderRadius: 8, marginTop: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{formData.name || "Product Name"}</div>
                  <div style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>
                    {formData.category || "Category"} • {formData.unit || "Unit"}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#0022ff" }}>
                    ₹{formData.price || "0.00"}
                  </div>
                </div>
              </Card>
            </div>
          </ResponsiveGrid>

          {/* Variations Grid - Only show if has variations */}
          <AnimatePresence>
            {hasVariationsToShow && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <FormHeader>Variations ({variations.length})</FormHeader>
                    {selectedVariations.length > 0 && (
                      <Button onClick={() => setShowBulkModal(true)}>
                        Bulk Update ({selectedVariations.length})
                      </Button>
                    )}
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #b4d5ff" }}>
                          <th style={{ padding: "8px 4px", textAlign: "left" }}>
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                setSelectedVariations(e.target.checked ? variations.map((v) => v.id) : [])
                              }
                            />
                          </th>
                          {attributes.map((a) => (
                            <th key={a.name} style={{ padding: "8px 4px", textAlign: "left" }}>
                              {a.name}
                            </th>
                          ))}
                          <th style={{ padding: "8px 4px" }}>Price</th>
                          <th style={{ padding: "8px 4px" }}>Add'l</th>
                          <th style={{ padding: "8px 4px" }}>Total</th>
                          <th style={{ padding: "8px 4px" }}>Stock</th>
                          <th style={{ padding: "8px 4px" }}>Images</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variations.map((v) => (
                          <VariationRow
                            key={v.id}
                            v={v}
                            attributes={attributes}
                            selectedVariations={selectedVariations}
                            toggleVariationSelect={toggleVariationSelect}
                            updateVariation={updateVariation}
                            calculateAdditionalPrice={calculateAdditionalPrice}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Update Modal */}
          <AnimatePresence>
            {showBulkModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                  padding: 16,
                }}
                onClick={() => setShowBulkModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 24,
                    width: "100%",
                    maxWidth: 400,
                  }}
                >
                  <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Bulk Update</h3>
                  <Select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    style={{ marginBottom: 12 }}
                  >
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                  </Select>
                  <Input
                    type="number"
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    placeholder={`Enter ${bulkAction}`}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <Button onClick={() => setShowBulkModal(false)} style={{ flex: 1 }}>
                      Cancel
                    </Button>
                    <Button primary onClick={applyBulkUpdate} style={{ flex: 1 }}>
                      Apply
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </CustomerLayout>
  );
};

export default AddProduct;