"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { FaMinus, FaMoneyBillWave, FaTimes, FaUpload, FaUserMinus } from "react-icons/fa";
import { CgRemove } from "react-icons/cg";
import { IoRemoveCircle } from "react-icons/io5";
import { MdClear } from "react-icons/md";
import { toast } from "react-toastify";
import { MultiSelectDropdown } from "../ReusableComponents/MultiSelectDropdown";
import { getSellerCategory, processProductData } from "../../../services/customerServices";

// ================== Styled Components (same as your style) ==================

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
`;

const ModalHeader = styled.div`
  background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
  color: white;
  padding: 1.5rem;
  border-radius: 1rem 1rem 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  flex: 2;
`;

const SidePanel = styled.div`
  padding: 2rem;
  border-left: 1px solid #e5e7eb;
  flex: 1;
  background: #fafafa;
`;

const SwitchTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .active {
    background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
    color: white;
  }

  .inactive {
    background: #f3f4f6;
    color: #374151;
  }
`;

const UploadBox = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  background: #f9fafb;
  margin-bottom: 2rem;

  input {
    display: none;
  }

  button {
    margin-top: 1rem;
    background: #fff7ed;
    border: 1px solid #fcd34d;
    color: #b45309;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  label {
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  input,
  select,
  textarea {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .item {
    background: white;
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-weight: 500;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: #0056d6;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;

  &.primary {
    background: linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54));
    color: white;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #e5e7eb;
    }
  }
`;
const AssignedUsersSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border-left: 4px solid ${({ theme }) => theme.colors.success};
`
const SectionTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  font-size: 1rem;
  
  svg {
    margin-right: 0.5rem;
    color: ${({ theme }) => theme.colors.success};
  }
`
const AssignedUserList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const AssignedUserPill = styled.div`
  display: flex;
  align-items: center;
  background: white;
  color: black;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.85rem;
`

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.errorDark};
  }
`
const FileUploadContainer = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight}22;
  }
`

const FileUploadIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`

const FileUploadText = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`

const FileInput = styled.input`
  display: none;
`

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}22;
  }
`
const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`
const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}22;
  }
`
const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}22;
  }
`
const UploadedFile = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  
  span {
    flex: 1;
    margin-left: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  button {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.error};
    cursor: pointer;
  }
`

// ================== Main Component ==================

const AddProductModalSeller = ({ onSuccess,onClose, product, selectedProduct }) => {
  const [activeTab, setActiveTab] = useState("product");
  const [selectedProducts,setSelectedProducts] = useState([]);
  // const bundleProducts = [{id: product.id,  name: product.product_name, price: product.selling_price}]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [category, setCategory] = useState([])
    const [formData, setFormData] = useState({
      product_name: "",
      category_id: "",
      product_id: "",
      selling_price: 0,
      description: "",
      price_inclusive_tax: true ? "False" : "true",
      primary_image : null,
    })

    // console.log(selectedProduct)

  const bundleTotal = selectedProducts.reduce((sum, p) => sum + parseFloat(p.selling_price), 0);

  useEffect(() => {
  if (selectedProduct) {
    setFormData({
      product_name: selectedProduct.product_name || "",
      category_id: selectedProduct.category_id || "",
      product_id: selectedProduct.id || "",
      selling_price: selectedProduct.selling_price || 0,
      description: selectedProduct.description || "",
      price_inclusive_tax: selectedProduct.price_inclusive_tax ? "true" : "false",
      primary_image: null, // keep file input empty
    });
  }
}, [selectedProduct]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSellerCategory();
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
        formDatas.append("call_mode", "ADD");
        formDatas.append("selling_price", parseInt(formData.selling_price));
        formDatas.append("description", formData.description);
        formDatas.append("price_inclusive_tax", formData.price_inclusive_tax);
        formDatas.append("seller_ref_code", sellerRefCode);
        formDatas.append("primary_image", formData.primary_image);
  
        const response = await processProductData(formDatas);
        console.log("response",response);
        toast.success("Product Add Successfully!");
        if (onSuccess) onSuccess();
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
  }))
}

  const handleFileChange = (e) => {
      setFormData((prev) => ({
        ...prev,
        primary_image: (e.target.files[0]),
      }))
  }

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      files: null,
    }))
  }
  

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalContent
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div style={{ flex: "1 1 100%" }}>
          <ModalHeader>
            <h2>{selectedProduct? "Update Product" : activeTab === "product" ? "Add Product" : "Create Bundle"}</h2>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            {/* <SwitchTabs>
              <button
                className={activeTab === "product" ? "active" : "inactive"}
                onClick={() => setActiveTab("product")}
              >
                Add Product
              </button>
              <button
                className={activeTab === "bundle" ? "active" : "inactive"}
                onClick={() => setActiveTab("bundle")}
              >
                Create Bundle
              </button>
            </SwitchTabs> */}

            {activeTab === "product" && (
              <>
                {/* <UploadBox>
                  <input id="file-upload" name="file-upload" type="file">Drag and drop to upload</input>
                  <button>Browse Files</button>
                </UploadBox> */}
                <FileUploadContainer onClick={() => document.getElementById("primary_image").click()}>
                <FileInput id="primary_image" name="primary_image" type="file" onChange={handleFileChange} />
                <FileUploadIcon>
                  <FaUpload />
                </FileUploadIcon>
                <FileUploadText>Click to upload or drag and drop files here</FileUploadText>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>Supported formats: JPG, PNG, PDF (Max 5MB)</div>
              </FileUploadContainer>
              {formData.primary_image && (
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ fontWeight: "500", marginBottom: "0.5rem" }}>
                    Uploaded Files (1)
                  </div>
                    <UploadedFile >
                      <FaUpload />
                      <span>{formData?.primary_image.name}</span>
                      <button type="button" onClick={() => removeFile(1)}>
                        <FaTimes />
                      </button>
                    </UploadedFile>
                </div>
              )}


                <FormGroup>
                  <label>Product Name</label>
                  <FormInput
                  id="product_name"
                  name="product_name"
                  type="text"
                  placeholder="Enter product name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: "2rem" }}
                />
                  {/* <input type="text" placeholder="Enter product name" /> */}
                </FormGroup>
                <FormGroup>
                <FormLabel htmlFor="category_id">Category</FormLabel>
                <FormSelect id="category_id" name="category_id" value={formData.category_id} onChange={handleChange}>
                  <option value="">Select category</option>
                  {category.map((value, index) => (
                    <option key={index} value={value.id}>
                      {value.name}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>

                {/* <FormGroup>
                  <label>Price</label>
                  <input type="number" placeholder="₹ 0.00" />
                </FormGroup> */}

                 <FormGroup>
              <FormLabel htmlFor="selling_price">Amount</FormLabel>
              {/* <div style={{ position: "relative" }}> */}
                <FormInput
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  placeholder="0.00"
                  value={formData.selling_price}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: "2rem" }}
                />
              {/* </div> */}
            </FormGroup>

                {/* <FormGroup>
                  <label>Description</label>
                  <textarea rows="3" placeholder="Enter product description" />
                </FormGroup> */}
                <FormGroup>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormTextarea
                id="description"
                name="description"
                placeholder="Provide details about your product"
                value={formData.description}
                onChange={e => {
                  if (e.target.value.length <= 500) {
                    handleChange(e)
                  }
                }}
                required
                maxLength={500}
              />
              <div style={{ fontSize: "0.8rem", color: "#888", textAlign: "right" }}>
                {formData.description.length}/500
              </div>
            </FormGroup>
              </>
            )}

            {activeTab === "bundle" && (
              <>
                <FormGroup>
                  <label>Bundle Name</label>
                  <input type="text" placeholder="e.g., Diwali Puja Kit" />
                </FormGroup>

                {/* <FormGroup>
                  <label>Search Products</label>
                  <input type="text" placeholder="Search for products..." />
                </FormGroup> */}

                {/* <ProductList>
                  {bundleProducts.map((p) => (
                    <div className="item" key={p.id}>
                      <span>
                        {p.name} – ₹{p.price}
                      </span>
                      <button>
                        <FiPlus />
                      </button>
                    </div>
                  ))}
                </ProductList> */}

{/* const [selectedUsers, setSelectedUsers] = useState([]);
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
]; */}

                {/* <MultiSelectDropdown
                  options={bundleProducts}
                  selectedOptions={selectedProduct}
                  setSelectedOptions={setSelectedProduct}
                  labelKey="name"
                  placeholder="Select Products"
                  width="100%"
                  /> */}
                <MultiSelectDropdown
                  options={product}
                  selectedOptions={selectedProducts}
                  setSelectedOptions={setSelectedProducts}
                  keyMap={{ label: "product_name", value: "id" }}  // 👈 mapping
                  displayFn={(p) => `${p.product_name} - ₹${p.selling_price}`}  // optional
                  placeholder="Select Products"
                  width="100%"
                />



              {selectedProducts.length !== 0 && (
                <AssignedUsersSection>
                  <SectionTitle>
                    Currently Selected Products
                  </SectionTitle>
                  <AssignedUserList>
                    {selectedProducts.map((product, index) => (
                      <AssignedUserPill key={index}>
                        {product.product_name} {/* Render the property instead of the object */}
                        <RemoveButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev.filter((c) => c.id !== product.id) // filter by id
                            );
                          }}
                          title="Remove"
                        >
                          <MdClear size={16} />
                        </RemoveButton>
                      </AssignedUserPill>
                    ))}
                  </AssignedUserList>
                </AssignedUsersSection>
              )}


                <div style={{ marginTop: "1.5rem", fontWeight: "600" }}>
                  Selected Product Total: ₹{bundleTotal}
                </div>

                <FormGroup style={{ marginTop: "1rem" }}>
                  <label>Set Bundle Price</label>
                  <input type="number" placeholder="₹ 0.00" />
                </FormGroup>
              </>
            )}
          </ModalBody>
         <ModalActions>
          <Button
            type="button"
            className="secondary"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="primary"
            disabled={false}
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* {loading ? "Saving..." : policy ? "Update Policy" : "Create Policy"} */}
            {selectedProduct ? "Update Product" : activeTab === "product" ? "Add Product" : "Create Bundle" }
          </Button>
        </ModalActions>
        </div>


        {/* Right Side Panel (optional future use) */}
        {/* <SidePanel>
          <h3 style={{ marginBottom: "1rem" }}>Preview</h3>
          {activeTab === "product" ? (
            <p>Fill product details to preview here.</p>
          ) : (
            <p>Bundle details preview will appear here.</p>
          )}
        </SidePanel> */}
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddProductModalSeller;
