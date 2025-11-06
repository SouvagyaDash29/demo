"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { MdClear} from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import { toast } from "react-toastify";
import { MultiSelectDropdown } from "../ReusableComponents/MultiSelectDropdown";

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
    background: #0056d6;
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
const ToggleContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
`;

const ToggleLabel = styled.label`
  font-weight: 500;
  margin-right: 0.5rem;
`;

const ToggleSwitch = styled.input`
  width: 40px;
  height: 20px;
  appearance: none;
  background: #e5e7eb;
  outline: none;
  border-radius: 20px;
  position: relative;
  transition: background 0.2s;
  cursor: pointer;

  &:checked {
    background: #0056d6;
  }

  &::before {
    content: "";
    position: absolute;
    left: 3px;
    top: 3px;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    transition: 0.2s;
  }

  &:checked::before {
    left: 23px;
  }
`;

// ================== Main Component ==================

const AddDicountProductModal = ({ product,onSuccess,onClose }) => {
//   const [activeTab, setActiveTab] = useState("product");
  const [selectedProduct,setSelectedProduct] = useState([]);
//   const [bundleProducts, setBundleProducts] = useState([
//     { id: 1, name: "Small Ganesh Idol", price: 250 },
//     { id: 2, name: "Sandalwood Agarbatti", price: 120 },
//     { id: 3, name: "Brass Puja Thali", price: 450 },
//   ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
//     const [category, setCategory] = useState([])
    const [formData, setFormData] = useState({
      name: "",
      start_date: "",
      end_date: "",
	  discount_price: 0,
	  selectedProduct
    })

    // console.log(formData)

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");
  
      try {
        // const sellerRefCode = localStorage.getItem("customerRefCode");
        // if (!sellerRefCode) {
        //   throw new Error("Seller reference code not found. Please login again.");
        // }
  
        // const formDatas = new FormData();
        // formDatas.append("name", formData.name);
        // formDatas.append("call_mode", "ADD");
        // formDatas.append("gst_applicable", formData.gst_applicable);
        // formDatas.append("discount_applicable", formData.discount_applicable);
        // formDatas.append("is_active", formData.is_active);
        // formDatas.append("HSN_SAC_code", formData.HSN_SAC_code);
        // formDatas.append("tax_rate", formData.tax_rate);
        // formDatas.append("category_alias", formData.category_alias);
        // formDatas.append("image", formData.primary_image);
  
        // const response = await processCategoryData(formDatas);
        // console.log("response",response);
        // if (response.status !== 200) {
        //   throw new Error("Registration failed. Please try again.");
        // }
        // Registration successful
		console.log(formData)
        toast.success("Product Add Successfully!");
        // if (onSuccess) onSuccess()
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

//   const handleFileChange = (e) => {
//       setFormData((prev) => ({
//         ...prev,
//         primary_image: (e.target.files[0]),
//       }))
//   }

//   const removeFile = () => {
//     setFormData((prev) => ({
//       ...prev,
//       files: null,
//     }))
//   }
  

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
						<h2>Add Discount rate on your Product</h2>
						<CloseButton onClick={onClose}>
						  <FiX />
						</CloseButton>
					  </ModalHeader>
			
					  <ModalBody>

                <FormGroup>
                  <label>Discount package Name</label>
                  <div style={{ position: "relative" }}>
                  <FormInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Discount package name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: "2rem" }}
                />
                  <HiPencil style={{ position: "absolute", left: "0.75rem", top: "0.90rem", color: "#666", fontSize: 20 }} />
                  </div>
                </FormGroup>

                <FormGroup>
                  <label>Select Products</label>
                  <MultiSelectDropdown
                  options={product}
                  selectedOptions={selectedProduct}
                  setSelectedOptions={setSelectedProduct}
                  keyMap={{ label: "product_name", value: "id" }}  // 👈 mapping
                  displayFn={(p) => `${p.product_name} - ₹${p.selling_price}`}  // optional
                  placeholder="Select Products"
                  width="100%"
                />
                  {/* <input type="text" placeholder="Enter product name" /> */}

				  {selectedProduct.length !== 0 && (
								  <AssignedUsersSection>
                    <div style={{display: "flex",justifyContent: "space-between" }}>
									<SectionTitle>
									  Currently Selected Products
									</SectionTitle>
									{selectedProduct.length > 5 &&
                   <SectionTitle style={{cursor: "pointer"}} onClick={() => setSelectedProduct([])} >
									  Clear All
									</SectionTitle>}

                    </div>
									<AssignedUserList>
									  {selectedProduct.map((product, index) => (
										<AssignedUserPill key={index}>
										  {product.product_name} {/* Render the property instead of the object */}
										  <RemoveButton
											onClick={(e) => {
											  e.stopPropagation();
											  setSelectedProduct((prev) =>
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
                </FormGroup>

				<FormGroup>
              <FormLabel htmlFor="startDate">Start Date</FormLabel>
              <div style={{ position: "relative" }}>
                <FormInput
                  id="startDate"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                //   onBlur={handleBlur}
                  required
                  style={{ paddingLeft: "2rem" }}
                />
                <FaCalendarAlt style={{ position: "absolute", left: "0.75rem", top: "0.90rem", color: "#666" }} />
              </div>
              {/* <ErrorMessage show={!!errors.start_date}>{errors.start_date}</ErrorMessage> */}
            </FormGroup>

			<FormGroup>
              <FormLabel htmlFor="endDate">End Date</FormLabel>
              <div style={{ position: "relative" }}>
                <FormInput
                  id="endDate"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                //   onBlur={handleBlur}
                  required
                  style={{ paddingLeft: "2rem" }}
                />
                <FaCalendarAlt style={{ position: "absolute", left: "0.75rem", top: "0.90rem", color: "#666" }} />
              </div>
              {/* <ErrorMessage show={!!errors.start_date}>{errors.start_date}</ErrorMessage> */}
            </FormGroup>

                 <FormGroup>
              <FormLabel htmlFor="discount_price">Add Discount Price</FormLabel>
              <div style={{ position: "relative" }}>
                <FormInput
                  id="discount_price"
                  name="discount_price"
                  type="number"
                  placeholder="0.00"
                  value={formData.discount_price}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: "2rem" }}
                />
                <BiRupee style={{ position: "absolute", left: "0.75rem", top: "0.90rem", color: "#666", fontSize: 18 }} />
              </div>
            </FormGroup>

                {/* <FormGroup>
                  <label>Description</label>
                  <textarea rows="3" placeholder="Enter product description" />
                </FormGroup> */}
             
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
            Apply Discount
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

export default AddDicountProductModal;
