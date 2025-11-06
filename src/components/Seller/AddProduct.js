import React, { useEffect, useState, useMemo } from 'react'
import CustomerLayout from '../Customer/CustomerLayout'
import styled from 'styled-components';
import { Eye, Plus, Save, Upload } from 'lucide-react';
import { ImageUploader } from './ReusableComponents/ImageUploader';
import { getSellerCategory, processProductData, ProcessProductImages } from '../../services/customerServices';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

// Responsive Layout
const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 400px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
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

const AddProduct = () => {
    const location = useLocation();
  const productData = location.state?.productData || null;
  const isEditMode = !!productData;
  const [formData, setFormData] = useState({
    product_name: productData?.product_name || "",
    category_id: "",
    product_id: productData?.id || "",
    base_unit: productData?.base_unit || "",
    selling_price: productData?.selling_price || "",
    stock: productData?.stock || "",
    description: productData?.description || "",
    images: productData?.c_images || [],
    price_inclusive_tax: productData?.price_inclusive_tax ?? false,
    activeImage: productData?.image || null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState([]);
  
  // ✅ State for additional images (excluding primary image)
  const [additionalImages, setAdditionalImages] = useState([]);
  const [originalAdditionalImages, setOriginalAdditionalImages] = useState([]);

  // const categories = ["Pooja Items", "Flowers", "Prasad", "Lamps"];
  const base_unit = ["Piece", "Packet", "Kg", "Litre"];

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Load existing additional images (excluding primary image)
  useEffect(() => {
    if (productData?.c_images && Array.isArray(productData.c_images)) {
      const primaryImageUrl = productData.image;
      // Filter out primary image from additional images
      const additional = productData.c_images
        .filter(imgUrl => imgUrl !== primaryImageUrl)
        .map(url => ({
          url,
          type: "EXISTING",
          file: null
        }));
      setAdditionalImages(additional);
      setOriginalAdditionalImages(additional);
    }
  }, [productData]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await getSellerCategory();
           // ✅ If editing and product has category name, match it with list
        if (productData?.category && response?.length > 0) {
          const matched = response.find(
            (cat) => cat.name.toLowerCase() === productData.category.toLowerCase()
          );
          if (matched) {
            setFormData((prev) => ({
              ...prev,
              category_id: matched.id, // use id for dropdown
            }));
          }
        }
          setCategory(response);
        } catch (err) {
          setError("Failed to fetch data. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    
        try {
          const sellerRefCode = localStorage.getItem("customerRefCode");
          if (!sellerRefCode) {
            throw new Error("Seller reference code not found. Please login again.");
          }
    
          const formDatas = new FormData();
          formDatas.append("product_name", formData.product_name);
          formDatas.append("category_id", parseInt(formData.category_id));
          formDatas.append("call_mode", isEditMode ? "UPDATE" : "ADD");
          if(isEditMode){
            formDatas.append("product_id", formData.product_id);
          }
          formDatas.append("selling_price", isEditMode ? productData?.selling_price : parseInt(formData.selling_price));
          formDatas.append("description", isEditMode? productData?.description : formData.description);
          formDatas.append("price_inclusive_tax", formData.price_inclusive_tax ? "True" : "False");
          formDatas.append("seller_ref_code", sellerRefCode);
          // Fix: Handle both File object and string URL
          if (formData.activeImage) {
            if (formData.activeImage.file instanceof File) {
              // If it's a new file upload
              formDatas.append("primary_image", formData.activeImage.file);
            } else if (typeof formData.activeImage === 'string') {
              // If it's a URL string (existing image)
              formDatas.append("primary_image", formData.activeImage);
            } else if (formData.activeImage.url && typeof formData.activeImage.url === 'string') {
              // If it's an object with url property
              formDatas.append("primary_image", formData.activeImage.url);
            }
          }

    //           for (const [key, value] of formDatas.entries()) {
    //   console.log(key, value);
    // }
    
          const response = await processProductData(formDatas);
          // console.log("response",response);
          toast.success(isEditMode ? "Product Updated Successfully!" : "Product Added Successfully!");
          
          // ✅ Store product_id after successful creation/update
          if (response?.data?.product_id || response?.data?.id) {
            const productId = response.data.product_id || response.data.id;
            setFormData((prev) => ({
              ...prev,
              product_id: productId
            }));
          }
          
          // if (onSuccess) onSuccess();
          if (response.status !== 200) {
            throw new Error("Registration failed. Please try again.");
          }
        } catch (err) {
          setError(err.message);
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      };

  /**
   * ✅ Build FormData for additional product images
   * Maintains positional indices: image_file (0), image_file_1 (1), ..., image_file_9 (9)
   * Only sends File objects for updated images, URL strings for unchanged ones
   */
  const buildFormDataForProductImages = ({ call_mode, image_id, images = [], originalImages = [] }) => {
    const fd = new FormData();
    fd.append("call_mode", call_mode);
    if (image_id) fd.append("image_id", image_id);
    
    // Process up to 10 images maintaining their positional index
    images.slice(0, 10).forEach((img, index) => {
      if (!img) return;
      
      const key = index === 0 ? "image_file" : `image_file_${index}`;
      
      // Extract current image URL
      const imgUrl = typeof img === 'string' ? img : img?.url;
      
      // Extract original image URL (for comparison)
      const originalImg = originalImages[index];
      const originalUrl = typeof originalImg === 'string' ? originalImg : originalImg?.url;
      
      // ✅ RULE: If image has a File object → it was updated → send File only
      if (img.file instanceof File) {
        fd.append(key, img.file);
      }
      // ✅ RULE: If image is unchanged (has URL, no File, matches original) → send URL string
      else if (imgUrl && typeof imgUrl === 'string' && imgUrl === originalUrl) {
        fd.append(key, imgUrl);
      }
      // ✅ RULE: If it's a new image (has URL but no original at this position) → send URL string
      else if (imgUrl && typeof imgUrl === 'string' && !originalUrl) {
        fd.append(key, imgUrl);
      }
      // ✅ Fallback: Handle direct string URLs
      else if (typeof img === 'string') {
        fd.append(key, img);
      }
    });
    
    return fd;
  };

  /**
   * ✅ Save additional product images
   */
  const handleSaveAdditionalImages = async () => {
    if (!formData.product_id) {
      toast.error("Please save the product first before adding additional images.");
      return;
    }

    try {
      setLoading(true);

      // Check if there are any changes
      const hasNewFiles = additionalImages.some(img => img?.file instanceof File);
      const hasRemovedImages = additionalImages.length < originalAdditionalImages.length;
      const hasReordered = additionalImages.length === originalAdditionalImages.length && 
        additionalImages.some((img, idx) => {
          const imgUrl = img?.url || img;
          const origUrl = originalAdditionalImages[idx]?.url;
          return imgUrl !== origUrl;
        });

      if (!hasNewFiles && !hasRemovedImages && !hasReordered && 
          additionalImages.length === originalAdditionalImages.length) {
        toast.info("No image changes detected.");
        return;
      }

      const call_mode = isEditMode && originalAdditionalImages.length > 0 
        ? "UPDATE" 
        : "ADD";

      const formDataForImages = buildFormDataForProductImages({
        call_mode,
        image_id: formData.product_id,
        images: additionalImages,
        originalImages: originalAdditionalImages,
      });

      await ProcessProductImages(formDataForImages);
      
      toast.success("Additional images saved successfully!");
      
      // Update original images to current state
      setOriginalAdditionalImages([...additionalImages]);
      
    } catch (error) {
      console.error("Failed to save additional images:", error);
      toast.error(error?.message || "Failed to save additional images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Check if there are any changes in additional images
   */
  const hasAdditionalImageChanges = useMemo(() => {
    if (!formData.product_id) return false;

    // In ADD mode (new product): Show if any images uploaded
    if (!isEditMode || originalAdditionalImages.length === 0) {
      return additionalImages.some(img => img?.file instanceof File);
    }

    // In EDIT mode: Compare with original
    const hasNewFiles = additionalImages.some(img => img?.file instanceof File);
    const hasRemovedImages = additionalImages.length < originalAdditionalImages.length;
    const hasReordered = additionalImages.length === originalAdditionalImages.length && 
      additionalImages.some((img, idx) => {
        const imgUrl = img?.url || img;
        const origUrl = originalAdditionalImages[idx]?.url;
        return imgUrl !== origUrl;
      });

    return hasNewFiles || hasRemovedImages || hasReordered;
  }, [additionalImages, originalAdditionalImages, formData.product_id, isEditMode]);

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
                <Button primary onClick={handleSubmit}>
                  <Plus size={16} /> Add Product
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
                      value={formData.product_name}
                      onChange={(e) => handleInputChange("product_name", e.target.value)}
                    />
                  </div>
                  <Grid>
                    <div>
                      <Label>Category *</Label>
                      <Select
                        value={formData.category_id}
                        onChange={(e) => handleInputChange("category_id", e.target.value)}
                      >
                        <option value="">Select</option>
                        {category.map((value, index) => (
                          <option key={index} value={value.id}>{value.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label>Unit *</Label>
                      <Select
                        value={formData.base_unit}
                        onChange={(e) => handleInputChange("base_unit", e.target.value)}
                      >
                        <option value="">Select</option>
                        {base_unit.map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </Select>
                    </div>
                  </Grid>
                  <div>
                    <FormHeader>Pricing & Inventory</FormHeader>
                    <Grid>
                      <div>
                        <Label>Base Price (₹) *</Label>
                        <Input
                          type="number"
                          value={formData.selling_price}
                          onChange={(e) => handleInputChange("selling_price", e.target.value)}
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
                  <div>
                    <ToggleLabel>
                    <input
                      type="checkbox"
                      checked={formData.price_inclusive_tax}
                      onChange={(e) => handleInputChange("price_inclusive_tax", e.target.checked)}
                    />
                    Price inclusive tax ?
                  </ToggleLabel>
                  </div>
                  <div>
                    <Label>Primary Image *</Label>
                    <ImageUploader
                      images={formData.activeImage ? [formData.activeImage] : []}
                      onChange={(updater) =>
                        setFormData((prev) => {
                          const images = updater(prev.activeImage ? [prev.activeImage] : []);
                          const newActiveImage = images[0] || null;
                          return {
                            ...prev,
                            activeImage: newActiveImage,
                            // Keep images array separate for additional images
                            images: prev.images || []
                          };
                        })
                      }
                      max={1}
                      activeImage={formData.activeImage?.url || formData.activeImage}
                      setActiveImage={(url) => handleInputChange("activeImage", url)}
                      uniqueId="primary"
                    />
                  </div>

                  {/* ✅ Additional Images Section */}
                  {formData.product_id && (
                    <div>
                      <FormHeader>Additional Images</FormHeader>
                      <Label style={{ marginBottom: 12 }}>
                        Upload up to 10 additional images for this product
                      </Label>
                      <ImageUploader
                        images={additionalImages}
                        onChange={(updater) => {
                          const updated = typeof updater === 'function' ? updater(additionalImages) : updater;
                          setAdditionalImages(updated);
                        }}
                        max={10}
                        uniqueId="additional"
                      />
                      
                      {/* ✅ Show save button only if there are changes */}
                      {hasAdditionalImageChanges && (
                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                          <Button primary onClick={handleSaveAdditionalImages} disabled={loading}>
                            {isEditMode ? "Update Additional Images" : "Save Additional Images"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <Label>*Note :- If this product have Variation then you can add it product list </Label>
                </div>
              </Card>
            </div>

            {/* Right: Preview */}
            <div>
              <Card>
                <Label>Product Preview</Label>
                <ImagePreview>
                  {formData.activeImage ? (
                    <img 
                      src={typeof formData.activeImage === 'string' 
                        ? formData.activeImage 
                        : formData.activeImage?.url || formData.activeImage} 
                      alt="Preview" 
                    />
                  ) : (
                    <div style={{ textAlign: "center", color: "#999" }}>
                      <Upload size={32} />
                      <div style={{ fontSize: 13 }}>No Image</div>
                    </div>
                  )}
                </ImagePreview>
                <div style={{ padding: 12, background: "#f3f7ff", borderRadius: 8, marginTop: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{formData.product_name || "Product Name"}</div>
                  <div style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>
                    {formData.category_id || "Category"} • {formData.unit || "Unit"}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#0022ff" }}>
                    ₹{formData.selling_price || "0.00"}
                  </div>
                  <div style={{ fontSize: 14, color: "#666", margin: "4px 0" }}>
                    {formData.description || "Product Description"}
                  </div>
                </div>
              </Card>
            </div>
          </ResponsiveGrid>
        </main>
      </div>

    </CustomerLayout>
  )
}

export default AddProduct