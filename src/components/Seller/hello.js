// AddVariation.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CustomerLayout from '../Customer/CustomerLayout';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Plus, Check, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { getProductDetailList, getVariationList, processProductVariations } from '../../services/customerServices';
import { useLocation } from 'react-router-dom';
import { AttributeEditor } from './ReusableComponents/AttributeEditor';
import { ImageUploader } from './ReusableComponents/ImageUploader';
import { BulkUpdateModal, ConfirmationModal } from './Modal/Modal2';
import { toast } from 'react-toastify';

// Styled Components (same as before, only new ones added)
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

  @media (min-width: 768px) {
    font-size: 18px;
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

  &:hover { background: #f0f4ff; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  ${({ primary }) => primary && `
    background: #0008ff; color: white; border: none;
    box-shadow: 0 4px 12px rgba(0, 136, 255, 0.25);
    &:hover { background: #0046dd; }
  `}

  ${({ success }) => success && `
    background: #10b981; color: white; border: none;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    &:hover { background: #059669; }
  `}
`;

const WarningBox = styled.div`
  background: #fef3c7;
  border: 1px solid #fbbf24;
  color: #92400e;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
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
    if (variant === 'primary') return `background: #dbeafe; color: #1e40af;`;
    return `background: #f3f4f6; color: #6b7280;`;
  }}
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1e40af;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const InfoIconWrapper = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`;

const InfoContent = styled.div`
  flex: 1;
`;

// Reusable Variation Row
const VariationRow = ({ v, attributes, selectedVariations, toggleVariationSelect, updateVariation, calculateAdditionalPrice, primaryAttribute, imagesByValue }) => {
  const add = calculateAdditionalPrice(v);
  const primaryValue = primaryAttribute ? v[primaryAttribute.name] : null;
  const imageCount = primaryValue && imagesByValue[primaryValue] ? imagesByValue[primaryValue].length : 0;

  return (
    <tr key={v.id} style={{ borderBottom: "1px solid #eee" }}>
      <td style={{ padding: "8px 4px" }}>
        <input type="checkbox" checked={selectedVariations.includes(v.id)} onChange={() => toggleVariationSelect(v.id)} />
      </td>
      {attributes.map((a) => (
        <td key={a.name} style={{ padding: "8px 4px" }}>{v[a.name]}</td>
      ))}
      <td style={{ padding: "8px 4px" }}>
        <input
          type="number"
          value={v.price}
          onChange={(e) => updateVariation(v.id, "price", e.target.value)}
          style={{ width: 90, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </td>
      <td style={{ padding: "8px 4px", color: "#059669" }}>
        {add > 0 ? `+${add}` : '—'}
      </td>
      <td style={{ padding: "8px 4px", fontWeight: 600 }}>₹{v.totalPrice || 0}</td>
      <td style={{ padding: "8px 4px" }}>
        <input
          type="number"
          value={v.stock}
          onChange={(e) => updateVariation(v.id, "stock", e.target.value)}
          style={{ width: 70, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </td>
      <td style={{ padding: "8px 4px" }}>
        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>
          {imageCount} {imageCount === 1 ? 'image' : 'images'}
        </span>
      </td>
    </tr>
  );
};

  // 1. helper: append files to FormData with image_file, image_file_1...image_file_9
const appendImagesToFormData = (fd, files) => {
  files.slice(0, 10).forEach((file, i) => {
    const key = i === 0 ? "image_file" : `image_file_${i}`;
    fd.append(key, file);
  });
};

// 2. helper: build FormData for each variation value
const buildFormDataForValue = ({ call_mode, v_val_id, files = [] }) => {
  const fd = new FormData();
  fd.append("call_mode", call_mode);
  if (v_val_id) fd.append("v_val_id", v_val_id);
  appendImagesToFormData(fd, files);
  return fd;
};

// 3. Dummy API (Replace with real API)
const uploadVariationImagesAPI = async (formData) => {
  console.log("FORM DATA SENT TO SERVER:");
  for (let p of formData.entries()) console.log(p[0], " => ", p[1]);
  return Promise.resolve({ status: 200 });
};

const AddVariation = () => {
const location = useLocation();
const productData = useMemo(() => location.state?.productData || {}, [location.state?.productData]);
const [currentProductData, setCurrentProductData] = useState(productData);
const variationMode = (productData?.variations?.length ?? 0) > 0 ? "edit" : "add";
  const basePrice = parseFloat(productData.selling_price) || 0;

  const [step, setStep] = useState(1);
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [variationList, setVariationList] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("price");
  const [bulkValue, setBulkValue] = useState("");
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [imagesByValue, setImagesByValue] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vValIdByValue, setVValIdByValue] = useState({});
  // console.log(JSON.stringify(productData))
  // console.log(variationMode)

  useEffect(() => {
    const fetchVariations = async () => {
      const response = await getVariationList();
      setVariationList(response || []);
    };
    fetchVariations();
  }, []);



useEffect(() => {
  if (variationMode !== "edit" || !productData?.variations || variationList.length === 0) return;

  const vValMap = {};
  const formattedAttributes = productData.variations.map(variation => {
    const meta = variationList.find(v => v.name === variation.name);

    const allValues = [
      ...(meta?.v_list?.map(v => v[1]).filter(v => v && v !== "Not Selected") || []),
      ...variation.product_variations.map(v => v.value),
    ];

    const selectedValues = variation.product_variations
      .filter(v => v.is_active !== false)
      .map(v => v.value);

    const valuePrices = {};
    variation.product_variations.forEach(v => {
      valuePrices[v.value] = parseFloat(v.additional_price) || 0;
      vValMap[v.value] = v.id; // ✅ store backend v_val_id mapping
    });

    return {
      name: variation.name,
      variation_name_id: meta?.id || null,
      allValues: [...new Set(allValues)],
      selectedValues,
      enabled: variation.product_variations.some(v => Number(v.additional_price) > 0),
      enabledDiscount: false,
      valuePrices,
      valueDiscounts: {},
      valueImages: {},
    };
  });

  setAttributes(formattedAttributes);
  setVValIdByValue(vValMap);          // ✅ assign v_val_id mapping
  setPrimaryIndex(0);                 // default first attr as primary

}, [variationMode, productData, variationList]);

  useEffect(() => {
    if (variationMode !== "edit" || !productData?.variations) return;

    const map = {};

    productData.variations.forEach(variation => {
      variation.product_variations.forEach(vv => {
        const value = vv.value;

        if (!map[value]) map[value] = [];

        if (Array.isArray(vv.c_images)) {
          vv.c_images.forEach(imgUrl => {
            map[value].push({
              url: imgUrl,
              type: "EXISTING",
              v_val_id: vv.id,
            });
          });
        }
      });
    });

    setImagesByValue(map);
  }, [variationMode, productData]);

const originalAttributesSnapshot = useMemo(() => {
  if (variationMode !== "edit") return null;

  return productData.variations?.map((v) => {
    const meta = variationList.find((m) => m.name === v.name);

    const selected = v.product_variations
      .filter((pv) => pv.is_active !== false)
      .map((pv) => pv.value);

    const prices = {};
    const discounts = {};
    const enabledDiscount = v.product_variations.some(
      (pv) => Number(pv.discount) > 0
    );

    v.product_variations.forEach((pv) => {
      prices[pv.value] = parseFloat(pv.additional_price) || 0;
      discounts[pv.value] = parseFloat(pv.discount) || 0;
    });

    return {
      name: v.name,
      variation_name_id: meta?.id,
      selectedValues: selected,
      valuePrices: prices,
      valueDiscounts: discounts,
      enabledDiscount,
      enabled: v.product_variations.some((pv) => Number(pv.additional_price) > 0),
    };
  });
}, [productData, variationList, variationMode]);


const hasAttributeChanges = useMemo(() => {
  if (variationMode !== "edit") {
    return attributes.some((a) => a.selectedValues.length > 0);
  }

  if (!originalAttributesSnapshot) return false;

  const simplifiedCurrent = attributes.map((a) => ({
    name: a.name,
    variation_name_id: a.variation_name_id,
    selectedValues: a.selectedValues,
    valuePrices: a.valuePrices,
    valueDiscounts: a.valueDiscounts,
    enabled: a.enabled,
    enabledDiscount: a.enabledDiscount,
  }));

  const simplifiedOriginal = originalAttributesSnapshot.map((a) => ({
    name: a.name,
    variation_name_id: a.variation_name_id,
    selectedValues: a.selectedValues,
    valuePrices: a.valuePrices,
    valueDiscounts: a.valueDiscounts,
    enabled: a.enabled,
    enabledDiscount: a.enabledDiscount,
  }));

  return JSON.stringify(simplifiedCurrent) !== JSON.stringify(simplifiedOriginal);
}, [attributes, originalAttributesSnapshot, variationMode]);




  // Update attribute
  const updateAttribute = useCallback((idx, field, value) => {
    setAttributes(attrs =>
      attrs.map((a, i) => {
        if (i !== idx) return a;
        if (field === "remove") return null;
        if (field === "name") {
          const selected = variationList.find(v => v.name === value);
          return {
            ...a,
            name: value,
            variation_name_id: selected?.id || null,
            allValues: [],
            selectedValues: [],
            valuePrices: {},
            valueDiscounts: {},
            // enabled: false,
            // enabledDiscount: false,
            // enabledImages: false,
            valueImages: {},
          };
        }
        if (field === "allValues") return { ...a, allValues: value };
        return { ...a, [field]: value };
})
        .filter(Boolean)
    );
  }, [variationList]);

  const toggleValue = useCallback((attrIdx, value) => {
    setAttributes(attrs =>
      attrs.map((a, i) => {
        if (i !== attrIdx) return a;
        const selected = a.selectedValues.includes(value)
          ? a.selectedValues.filter(v => v !== value)
          : [...a.selectedValues, value];

        const valuePrices = { ...a.valuePrices };
        const valueDiscounts = { ...a.valueDiscounts };
        const valueImages = { ...a.valueImages };

        if (!selected.includes(value)) {
          delete valuePrices[value];
          delete valueDiscounts[value];
          delete valueImages[value];
        }

        return { ...a, selectedValues: selected, valuePrices, valueDiscounts, valueImages };
})
    );
  }, []);

  const togglePriceSettings = (idx) => {
    setAttributes(attrs => attrs.map((a, i) => i === idx ? { ...a, enabled: !a.enabled } : a));
  };

  const toggleDiscountSettings = (idx) => {
    setAttributes(attrs => attrs.map((a, i) => i === idx ? { ...a, enabledDiscount: !a.enabledDiscount } : a));
  };

  const updateValuePrice = (attrIdx, value, price) => {
    setAttributes(attrs =>
      attrs.map((a, i) =>
        i === attrIdx  ? { ...a, valuePrices: { ...a.valuePrices, [value]: price } } : a
      )
    );
  };

  const updateValueDiscount = (attrIdx, value, discount) => {
    setAttributes(attrs =>
      attrs.map((a, i) =>
        i === attrIdx ? { ...a, valueDiscounts: { ...a.valueDiscounts, [value]: discount } } : a
      )
    );
  };

  const updateValueImages = (attrIdx, value, images) => {
    setAttributes(attrs =>
      attrs.map((a, i) =>
        i === attrIdx
          ? { ...a, valueImages: { ...a.valueImages, [value]: images } }
          : a
      )
    );
  };

  const setPrimaryAttribute = (index, isPrimary) => { setPrimaryIndex(isPrimary ? index : null);};

  const generateVariations = useCallback(() => {
    const validAttrs = attributes.filter(a => a.name && a.selectedValues.length > 0);
    if (validAttrs.length === 0) return;

    const combos = validAttrs.reduce((acc, attr) => {
      if (acc.length === 0) return attr.selectedValues.map(v => ({ [attr.name]: v }));
      return acc.flatMap(c => attr.selectedValues.map(v => ({ ...c, [attr.name]: v })));
    }, []);

    const newVars = combos.map((c, i) => ({
      id: Date.now() + i,
      ...c,
      price: basePrice,
      stock: "",
      sku: `${productData.product_code || 'PRD'}-${i + 1}`,
    }));

    setVariations(newVars);
    setStep(2);
}, [attributes, basePrice, productData]);

  const calculateAdditionalPrice = useCallback((variation) => {
    return attributes.reduce((sum, attr) => {
      if (!attr.enabled) return sum;
      const val = variation[attr.name];
      return sum + (parseFloat(attr.valuePrices[val]) || 0);
    }, 0);
}, [attributes]);

  const toggleVariationSelect = (id) => {
    setSelectedVariations(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const updateVariation = useCallback((id, field, value) => {
    setVariations(vars =>
      vars.map(v =>
        v.id === id
          ? {
              ...v,
              [field]: value,
              totalPrice: (parseFloat(field === "price" ? value : v.price) || 0) + calculateAdditionalPrice(v),
            }
          : v
      )
    );
}, [calculateAdditionalPrice]);

  const applyBulkUpdate = () => {
    if (!bulkValue) return;
    setVariations(vars =>
      vars.map(v =>
        selectedVariations.includes(v.id)
          ? {
              ...v,
              [bulkAction]: bulkValue,
              totalPrice: (parseFloat(bulkAction === "price" ? bulkValue : v.price) || 0) + calculateAdditionalPrice(v),
            }
          : v
      )
    );
    setShowBulkModal(false);
    setSelectedVariations([]);
    setBulkValue("");
  };

  const handleImageUpload = (value, images) => { setImagesByValue(prev => ({ ...prev, [value]: images }));};

  // Generate API Payload
// ✅ DRY function to build value list for ADD / UPDATE
// const buildValueList = (attr, originalValues, isEdit) =>
//   attr.selectedValues.map(value => ({
//     id: isEdit ? (originalValues[value] ?? null) : undefined,
//     value,
//     additional_price: Number(attr.valuePrices[value]) || 0,
//     is_discounted: attr.enabledDiscount && Number(attr.valueDiscounts[value]) > 0,
//     discount: Number(attr.valueDiscounts[value]) || 0,
//     ...(isEdit && originalValues[value] !== undefined && { is_active: true })
//   }));

// ✅ Main Payload Generator
const generatePayload = useCallback(() => {
  const isEdit = variationMode === "edit";

  const original = (currentProductData?.variations || []).reduce((acc, v) => {
    acc[v.name] = {
      id: v.id,
      values: Object.fromEntries((v.product_variations || []).map(pv => [pv.value, pv.id]))
    };
    return acc;
  }, {});

  const buildValueList = (attr, originalValues) =>
    attr.selectedValues.map(value => ({
      id: isEdit ? (originalValues?.[value] ?? null) : undefined,
      value,
      additional_price: Number(attr.valuePrices[value]) || 0,
      is_discounted: !!(
        attr.enabledDiscount &&
        Number(attr.valueDiscounts?.[value]) > 0
      ),
      discount: Number(attr.valueDiscounts?.[value]) || 0,
      ...(isEdit && originalValues?.[value] !== undefined && {
        is_active: true
      })
    }));

  return {
    variation_data: {
      call_mode: isEdit ? "UPDATE" : "ADD",
      product_code: currentProductData.product_code,
      product_variation_list: attributes
        .filter(a => a.selectedValues.length > 0)
        .map(attr => ({
          ...(isEdit && { id: original?.[attr.name]?.id ?? null }),
          variation_name_id: attr.variation_name_id,
          is_primary_one: attr.name === attributes[primaryIndex]?.name,
          ...(isEdit && original?.[attr.name]?.id && { is_active: true }),
          v_value_list: buildValueList(attr, original?.[attr.name]?.values)
        }))
    }
  };
}, [attributes, primaryIndex, variationMode, currentProductData]);



  const handleGenerateConfirm = () => setShowConfirmModal(true)

const confirmGenerate = async () => {
  const payload = generatePayload();
  console.log("PAYLOAD SENT:", JSON.stringify(payload));

  try {
    const res = await processProductVariations(payload); // ✅ Call your real API
     toast.success("Variation Add Successfully!");
              // if (onSuccess) onSuccess();
              if (res.status !== 200) {
                throw new Error("Registration failed. Please try again.");
              }
     const response = await getProductDetailList();


    setCurrentProductData(response);
    
    // Move to step 2 after updating variations
    setStep(2)
    generateVariations();
    setShowConfirmModal(false);

  } catch (e) {
    console.error("Variation update failed → ", e);
  }
};

    // === Upload Images (Uses v_val_id from productData) ===
  const handleSaveImages = async () => {
    const primary = attributes[primaryIndex];
    if (!primary) return;

    for (const value of primary.selectedValues) {
      const imgs = imagesByValue[value] || [];
      const newFiles = imgs.filter((img) => img?.file instanceof File).map((img) => img.file);
      if (newFiles.length === 0) continue;

      const v_val_id = vValIdByValue[value]; // From productData
      const formData = buildFormDataForValue({
        call_mode: variationMode === "edit" ? "UPDATE_VARIATION" : "ADD_VARIATION",
        v_val_id,
        files: newFiles,
      });

      await uploadVariationImagesAPI(formData); // TODO: Real API
    }
    alert("Images saved successfully");
  };

  const primaryAttribute = primaryIndex !== null ? attributes[primaryIndex] : null;
  const canProceed = attributes.some(a => a.selectedValues.length > 0);

  return (
    <CustomerLayout>
      {/* Product Info */}
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
                      <MetaLabel>Base Price</MetaLabel>
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
                  </ProductMetaRow>
                </ProductDetails>
              </ProductInfoContainer>
            </Card>
          </motion.div>
        </AnimatePresence>

      {/* Step Indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 16,
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: 12, marginBottom: 24
      }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '8px 16px', background: step === 1 ? '#0008ff' : 'white', color: step === 1 ? 'white' : '#64748b', borderRadius: 20, fontWeight: 500 }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: step === 1 ? 'white' : '#e2e8f0', color: step === 1 ? '#0008ff' : '#64748b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginRight: 8 }}>1</span>
          Define Variations
        </div>
        <ChevronRight size={20} color="#94a3b8" />
        <div style={{ flex: 1, textAlign: 'center', padding: '8px 16px', background: step === 2 ? '#0008ff' : 'white', color: step === 2 ? 'white' : '#64748b', borderRadius: 20, fontWeight: 500 }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: step === 2 ? 'white' : '#e2e8f0', color: step === 2 ? '#0008ff' : '#64748b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginRight: 8 }}>2</span>
          Upload Images & Review
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <FormHeader>{variationMode === "edit" ? "Edit" : "Manage" } Product Variations</FormHeader>
            {primaryAttribute && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>Primary: {primaryAttribute.name}</span>}
          </div>

          <InfoBox>
            <InfoIconWrapper>
              <Info size={20} />
            </InfoIconWrapper>
            <InfoContent>
              <strong>Configuration Guidelines</strong>
              <br />
              • Pricing and discount settings are optional for each variation.
              <br />
              • please checked the primary variation, if you want to add variation-specific images.
              {/* • Primary variation designation is mandatory for variation-specific image management */}
              <br />
              • Image assignment functionality becomes available after primary variation selection.
            </InfoContent>
          </InfoBox>

          {attributes.map((attr, idx) => (
            <AttributeEditor
              key={idx}
              attr={attr}
              idx={idx}
              updateAttribute={updateAttribute}
              variationList={variationList}
              toggleValue={toggleValue}
              togglePriceSettings={togglePriceSettings}
              toggleDiscountSettings={toggleDiscountSettings}
              updateValuePrice={updateValuePrice}
              updateValueDiscount={updateValueDiscount}
              updateValueImages={updateValueImages}
              attributes={attributes}
              isPrimary={primaryIndex === idx}
              onPrimaryChange={setPrimaryAttribute}
            />
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button onClick={() => setAttributes([...attributes, {
              name: "", variation_name_id: null, allValues: [], selectedValues: [], enabled: false, enabledDiscount: false, valuePrices: {}, valueDiscounts: {}, valueImages: {}
            }])}>
              <Plus size={16} /> Add Attribute
            </Button>
            {canProceed && (
              <Button
  success
  onClick={() => {
    if (variationMode === "add") return handleGenerateConfirm();     // ADD → always call API
    if (variationMode === "edit" && hasAttributeChanges) return handleGenerateConfirm(); // EDIT + changes → call API
    setStep(2);  // EDIT + no changes → skip API
  }}
>
  <Check size={16} />
  {variationMode === "add"
    ? "Generate Variations"
    : hasAttributeChanges
      ? "Generate Variations"
      : "Next Step"}
</Button>
            )}
          </div>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          {/* Image Upload */}
          {primaryAttribute ? (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FormHeader>Upload Variation Images</FormHeader>
                <Button onClick={() => setStep(1)}>← Back</Button>
              </div>
              <p style={{ color: '#64748b', marginBottom: 20 }}>
                Upload images for each <strong>{primaryAttribute.name}</strong> variation.
              </p>
              {primaryAttribute.selectedValues.map(value => (
                <div key={value} style={{ marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 12, border: '2px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <strong>{primaryAttribute.name}: {value}</strong>
                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>
                      {(imagesByValue[value] || []).length} images
                    </span>
                  </div>
                  <ImageUploader
                    images={imagesByValue[value] || []}
                    onChange={(updater) => {
                      const current = imagesByValue[value] || [];
                      const updated = typeof updater === 'function' ? updater(current) : updater;
                      handleImageUpload(value, updated);
                    }}
                    max={6}
                  />
                 <Button primary onClick={handleSaveImages} style={{ padding: "14px 32px", fontSize: 16 }}>
                    {variationMode === "edit" ? "Update Images" : "Add Images"}
                  </Button>
                </div>
              ))}
            </Card>
          ) : (
            <Card>
              <Button style={{marginLeft: "auto"}} onClick={() => setStep(1)}>← Back</Button>
              <WarningBox>
                <AlertCircle size={20} />
                <div>
                  <strong>No primary variation selected.</strong> Images will be assigned to each variation individually later.
                  <br />
                  <em>To upload images now, please select a Primary Variation in Step 1.</em>
                </div>
              </WarningBox>
            </Card>
          )}

          {/* Variations Table */}
          {variations.length > 0 && (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <FormHeader>Generated Variations ({variations.length})</FormHeader>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedVariations.length > 0 && (
                    <Button onClick={() => setShowBulkModal(true)}>
                      Bulk Update ({selectedVariations.length})
                    </Button>
                  )}
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #b4d5ff" }}>
                      <th style={{ padding: "8px 4px" }}><input type="checkbox" onChange={(e) => setSelectedVariations(e.target.checked ? variations.map(v => v.id) : [])} /></th>
                      {attributes.filter(a => a.selectedValues.length > 0).map(a => (
                        <th key={a.name} style={{ padding: "8px 4px", textAlign: "left" }}>{a.name}</th>
                      ))}
                      <th style={{ padding: "8px 4px" }}>Price</th>
                      <th style={{ padding: "8px 4px" }}>Add'l</th>
                      <th style={{ padding: "8px 4px" }}>Total</th>
                      <th style={{ padding: "8px 4px" }}>Stock</th>
                      <th style={{ padding: "8px 4px" }}>Images</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variations.map(v => (
                      <VariationRow
                        key={v.id}
                        v={v}
                        attributes={attributes.filter(a => a.selectedValues.length > 0)}
                        selectedVariations={selectedVariations}
                        toggleVariationSelect={toggleVariationSelect}
                        updateVariation={updateVariation}
                        calculateAdditionalPrice={calculateAdditionalPrice}
                        primaryAttribute={primaryAttribute}
                        imagesByValue={imagesByValue}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Button primary style={{ padding: '14px 32px', fontSize: 16 }}>
                  Save All Variations
                </Button>
              </div> */}
            </Card>
          )}
        </>
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmGenerate}
        title="Generate Variations"
        message="Are you sure you want to generate these variations? This will create all combinations."
      />

      <BulkUpdateModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onApply={applyBulkUpdate}
        action={bulkAction}
        setAction={setBulkAction}
        value={bulkValue}
        setValue={setBulkValue}
      />
    </CustomerLayout>
  );
};

export default AddVariation;