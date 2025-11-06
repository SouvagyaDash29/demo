import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Image, X } from 'lucide-react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const Card = styled(motion.div)`
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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.primary ? '#dbeafe' : '#f3f4f6'};
  color: ${props => props.primary ? '#1e40af' : '#6b7280'};
`;

const Button = styled.button`
  padding: 10px 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant }) => {
    if ($variant === 'primary') return `
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
      }
    `;
    if ($variant === 'danger') return `
      background: #fee;
      color: #dc2626;
      border-color: #fecaca;
      
      &:hover {
        background: #fecaca;
      }
    `;
    if ($variant === 'success') return `
      background: #d1fae5;
      color: #065f46;
      border-color: #a7f3d0;
      
      &:hover {
        background: #a7f3d0;
      }
    `;
  }}
`;

const AttributeCard = styled(motion.div)`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid ${props => props.$isPrimary ? '#3b82f6' : '#e2e8f0'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  position: relative;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const AttributeHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  background: white;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$primary ? '#1e40af' : '#475569'};
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.05);
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const ValueChip = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: ${props => props.$selected ? '#3b82f6' : 'white'};
  color: ${props => props.$selected ? 'white' : '#475569'};
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#e2e8f0'};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-1px);
  }
`;

const ValueGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const ImageUploadSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  border: 2px dashed #cbd5e1;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  background: #f8fafc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

const UploadButton = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  input {
    display: none;
  }
`;

const VariationsTable = styled.div`
  overflow-x: auto;
  margin-top: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 600px;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
  }

  tbody tr:hover {
    background: #f8fafc;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: ${props => props.$active ? '#3b82f6' : 'white'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  font-weight: 500;
  font-size: 14px;
  border: 2px solid ${props => props.$active ? '#3b82f6' : '#e2e8f0'};
`;

// Reusable Components
const AttributeInput = ({ attribute, index, onChange, onRemove, isPrimary, onPrimaryChange }) => {
  const [customValue, setCustomValue] = useState('');

  const addCustomValue = () => {
    if (customValue.trim() && !attribute.values.includes(customValue.trim())) {
      onChange(index, 'values', [...attribute.values, customValue.trim()]);
      setCustomValue('');
    }
  };

  return (
    <AttributeCard
      $isPrimary={isPrimary}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {isPrimary && (
        <Badge primary style={{ position: 'absolute', top: 12, right: 12 }}>
          Primary (Image Source)
        </Badge>
      )}
      
      <AttributeHeader>
        <Input
          placeholder="Attribute name (e.g., Color, Size)"
          value={attribute.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          style={{ flex: 1 }}
        />
        
        <CheckboxLabel $primary={isPrimary}>
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => onPrimaryChange(index, e.target.checked)}
          />
          Primary Variation
        </CheckboxLabel>
        
        <Button $variant="danger" onClick={() => onRemove(index)}>
          <Trash2 size={16} />
        </Button>
      </AttributeHeader>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Input
          placeholder="Add value (e.g., Red, Blue)"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomValue()}
        />
        <Button onClick={addCustomValue}>
          <Plus size={16} /> Add
        </Button>
      </div>

      <ValueGrid>
        <AnimatePresence>
          {attribute.values.map((value) => (
            <ValueChip
              key={value}
              $selected={attribute.selectedValues.includes(value)}
              onClick={() => {
                const isSelected = attribute.selectedValues.includes(value);
                onChange(
                  index,
                  'selectedValues',
                  isSelected
                    ? attribute.selectedValues.filter((v) => v !== value)
                    : [...attribute.selectedValues, value]
                );
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {value}
              {attribute.selectedValues.includes(value) && <Check size={14} />}
            </ValueChip>
          ))}
        </AnimatePresence>
      </ValueGrid>
    </AttributeCard>
  );
};

const ImageUploadZone = ({ value, images, onChange }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));
    onChange([...images, ...newImages]);
  };

  const removeImage = (id) => {
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <ImageUploadSection>
      <div style={{ marginBottom: 12 }}>
        <strong style={{ color: '#1e293b' }}>{value}</strong>
        <span style={{ marginLeft: 8, fontSize: 13, color: '#64748b' }}>
          ({images.length} {images.length === 1 ? 'image' : 'images'})
        </span>
      </div>
      
      <ImageGrid>
        {images.map((img) => (
          <ImagePreview key={img.id}>
            <img src={img.url} alt={value} />
            <RemoveImageButton onClick={() => removeImage(img.id)}>
              <X size={14} />
            </RemoveImageButton>
          </ImagePreview>
        ))}
        
        {images.length < 6 && (
          <UploadButton>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <Image size={24} color="#94a3b8" />
            <span style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              Upload
            </span>
          </UploadButton>
        )}
      </ImageGrid>
    </ImageUploadSection>
  );
};

// Main Component
const AddVariation = () => {
  const [step, setStep] = useState(1);
  const [attributes, setAttributes] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [variations, setVariations] = useState([]);
  const [imagesByValue, setImagesByValue] = useState({});

  const mockProduct = {
    name: "Premium Cotton T-Shirt",
    code: "TSH-001",
    basePrice: 499,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
  };

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        name: '',
        values: [],
        selectedValues: []
      }
    ]);
  };

  const updateAttribute = (index, field, value) => {
    setAttributes(attrs =>
      attrs.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const removeAttribute = (index) => {
    if (primaryIndex === index) setPrimaryIndex(null);
    setAttributes(attrs => attrs.filter((_, i) => i !== index));
  };

  const setPrimaryAttribute = (index, isPrimary) => {
    setPrimaryIndex(isPrimary ? index : null);
  };

  const generateVariations = () => {
    const validAttrs = attributes.filter(
      (attr) => attr.name && attr.selectedValues.length > 0
    );

    if (validAttrs.length === 0) return;

    const combos = validAttrs.reduce((acc, attr) => {
      if (acc.length === 0) {
        return attr.selectedValues.map((v) => ({ [attr.name]: v }));
      }
      return acc.flatMap((combo) =>
        attr.selectedValues.map((v) => ({ ...combo, [attr.name]: v }))
      );
    }, []);

    const newVars = combos.map((combo, i) => ({
      id: Date.now() + i,
      ...combo,
      price: mockProduct.basePrice,
      stock: 0,
      sku: `${mockProduct.code}-${i + 1}`
    }));

    setVariations(newVars);
    setStep(2);
  };

  const handleImageUpload = (value, images) => {
    setImagesByValue(prev => ({ ...prev, [value]: images }));
  };

  const primaryAttribute = primaryIndex !== null ? attributes[primaryIndex] : null;

  return (
    <Container>
      <StepIndicator>
        <Step $active={step === 1}>
          <span style={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            background: step === 1 ? 'white' : '#e2e8f0',
            color: step === 1 ? '#3b82f6' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600
          }}>1</span>
          Define Variations
        </Step>
        <Step $active={step === 2}>
          <span style={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            background: step === 2 ? 'white' : '#e2e8f0',
            color: step === 2 ? '#3b82f6' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600
          }}>2</span>
          Upload Images
        </Step>
      </StepIndicator>

      {/* Step 1: Define Variations */}
      {step === 1 && (
        <>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SectionHeader>
              <Title>Product Variations</Title>
              <Button $variant="primary" onClick={addAttribute}>
                <Plus size={16} /> Add Attribute
              </Button>
            </SectionHeader>

            <AnimatePresence>
              {attributes.map((attr, index) => (
                <AttributeInput
                  key={index}
                  attribute={attr}
                  index={index}
                  onChange={updateAttribute}
                  onRemove={removeAttribute}
                  isPrimary={primaryIndex === index}
                  onPrimaryChange={setPrimaryAttribute}
                />
              ))}
            </AnimatePresence>

            {attributes.length > 0 && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Button
                  $variant="success"
                  onClick={generateVariations}
                  disabled={!attributes.some(a => a.name && a.selectedValues.length > 0)}
                  style={{ padding: '14px 32px', fontSize: 16 }}
                >
                  <Check size={18} /> Generate Variations
                </Button>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Step 2: Upload Images */}
      {step === 2 && (
        <>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SectionHeader>
              <Title>
                <Image size={20} />
                Upload Variation Images
              </Title>
              <Button onClick={() => setStep(1)}>
                ← Back to Edit
              </Button>
            </SectionHeader>

            {primaryAttribute ? (
              <div>
                <p style={{ color: '#64748b', marginBottom: 20 }}>
                  Upload images for each <strong>{primaryAttribute.name}</strong> variation. 
                  These images will apply to all size/quantity combinations.
                </p>

                <AnimatePresence>
                  {primaryAttribute.selectedValues.map((value) => (
                    <motion.div
                      key={value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <ImageUploadZone
                        value={value}
                        images={imagesByValue[value] || []}
                        onChange={(imgs) => handleImageUpload(value, imgs)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ 
                padding: 40, 
                textAlign: 'center', 
                color: '#64748b',
                background: '#f8fafc',
                borderRadius: 12 
              }}>
                <p>No primary variation selected. Images will be assigned to each variation individually later.</p>
              </div>
            )}
          </Card>

          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SectionHeader>
              <Title>Generated Variations ({variations.length})</Title>
            </SectionHeader>

            <VariationsTable>
              <Table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    {attributes.filter(a => a.selectedValues.length > 0).map((attr) => (
                      <th key={attr.name}>{attr.name}</th>
                    ))}
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    <th>Images</th>
                  </tr>
                </thead>
                <tbody>
                  {variations.map((variation) => {
                    const primaryValue = primaryAttribute ? variation[primaryAttribute.name] : null;
                    const imageCount = primaryValue ? (imagesByValue[primaryValue] || []).length : 0;
                    
                    return (
                      <tr key={variation.id}>
                        <td style={{ fontWeight: 500, color: '#64748b' }}>{variation.sku}</td>
                        {attributes.filter(a => a.selectedValues.length > 0).map((attr) => (
                          <td key={attr.name}>{variation[attr.name]}</td>
                        ))}
                        <td>
                          <Input
                            type="number"
                            value={variation.price}
                            onChange={(e) => {
                              setVariations(vars =>
                                vars.map(v =>
                                  v.id === variation.id ? { ...v, price: e.target.value } : v
                                )
                              );
                            }}
                            style={{ width: 100 }}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            value={variation.stock}
                            onChange={(e) => {
                              setVariations(vars =>
                                vars.map(v =>
                                  v.id === variation.id ? { ...v, stock: e.target.value } : v
                                )
                              );
                            }}
                            style={{ width: 80 }}
                          />
                        </td>
                        <td>
                          <Badge>{imageCount} images</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </VariationsTable>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Button
                $variant="primary"
                style={{ padding: '14px 32px', fontSize: 16 }}
                onClick={() => {
                  console.log('Variations:', variations);
                  console.log('Images by value:', imagesByValue);
                  alert('Variations saved! Check console for data structure.');
                }}
              >
                Save Variations
              </Button>
            </div>
          </Card>
        </>
      )}
    </Container>
  );
};

export default AddVariation;