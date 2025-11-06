import React, { useEffect, useState } from 'react'
import CustomerLayout from '../Customer/CustomerLayout'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components';
import { Plus } from 'lucide-react';
import { getVariationList } from '../../services/customerServices';
import { AttributeEditor } from './ReusableComponents/AttributeEditor.js';
import { useLocation } from 'react-router-dom';
import { ImageUploader } from './ReusableComponents/ImageUploader.js';

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

const ProductInfoContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px;
`;

const ProductCode = styled.span`
  display: inline-block;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 16px;
`;

const ProductMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const MetaValue = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 600;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  
  ${({ variant }) => {
    if (variant === 'active') return `background: #d1fae5; color: #065f46;`;
    if (variant === 'category') return `background: #dbeafe; color: #1e40af;`;
    return `background: #f3f4f6; color: #6b7280;`;
  }}
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

const AddVariation = () => {
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [variationList, setVariationList] = useState([]);
  // const [hasVariationsToShow, setHasVariationsToShow] = useState(false);
  // const [variations, setVariations] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("price");
  const [bulkValue, setBulkValue] = useState("");


  const location = useLocation();
  const productData = location.state?.productData || null;
  // console.log(productData)

  useEffect(() => {
    const fetchVariations = async () => {
      const response = await getVariationList();
      setVariationList(response || []);
    };
    fetchVariations();
  }, []);

  const updateAttribute = (idx, field, value) => {
    setAttributes((attrs) =>
      attrs.map((a, i) => {
        if (i !== idx) return a;
        if (field === "remove") return null;
        if (field === "name") {
          return {
            ...a,
            name: value,
            allValues: [],
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

    const calculateAdditionalPrice = (variation) => {
    return attributes.reduce((sum, attr) => {
      if (!attr.enabled) return sum;
      const val = variation[attr.name];
      return sum + (parseFloat(attr.valuePrices[val]) || 0);
    }, 0);
  };

    const toggleVariationSelect = (id) => {
    setSelectedVariations((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
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
      {/* Product Information Card */}
      {productData && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <FormHeader>Product Information</FormHeader>
              <ProductInfoContainer>
                <ProductImage 
                  src={productData.image} 
                  alt={productData.product_name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                  }}
                />
                <ProductDetails>
                  <ProductTitle>{productData.product_name}</ProductTitle>
                  <ProductCode>{productData.product_code}</ProductCode>
                  <ProductDescription>{productData.description}</ProductDescription>
                  
                  <ProductMetaRow>
                    <MetaItem>
                      <MetaLabel>Price</MetaLabel>
                      <MetaValue>₹{productData.selling_price}</MetaValue>
                    </MetaItem>
                    
                    <MetaItem>
                      <MetaLabel>Category</MetaLabel>
                      <Badge variant="category">{productData.category}</Badge>
                    </MetaItem>
                    
                    <MetaItem>
                      <MetaLabel>Status</MetaLabel>
                      <Badge variant={productData.is_active ? 'active' : ''}>
                        {productData.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </MetaItem>

                    {productData.discount > 0 && (
                      <MetaItem>
                        <MetaLabel>Discount</MetaLabel>
                        <MetaValue>{productData.discount}%</MetaValue>
                      </MetaItem>
                    )}

                    {productData.deal_type !== 'NA' && (
                      <MetaItem>
                        <MetaLabel>Deal Type</MetaLabel>
                        <Badge>{productData.deal_type}</Badge>
                      </MetaItem>
                    )}
                  </ProductMetaRow>
                </ProductDetails>
              </ProductInfoContainer>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Variation Attributes */}
      <AnimatePresence>
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
                variationList={variationList} 
                toggleValue={toggleValue}
                togglePriceSettings={togglePriceSettings}
                updateValuePrice={updateValuePrice}
                toggleImageSettings={toggleImageSettings}
                updateValueImages={updateValueImages}
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
      </AnimatePresence>

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
      
    </CustomerLayout>
  )
}

export default AddVariation