import React, { useState } from "react";
import Modal from "./Modal";
import styled from "styled-components";
import { processSellerApplication } from "../../../services/customerServices";
import { toast } from "react-toastify";

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const TempleDetailsSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #334155;
  min-width: 100px;
`;

const DetailValue = styled.span`
  color: #64748b;
`;

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

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  position: sticky;
  bottom: 0;
  background: #ffffff;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem 1.25rem;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #64748b;
  font-size: 1.125rem;
`;

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
`;

// const DocumentCard = styled.div`
//   background: #f9fafb;
//   border-radius: 10px;
//   padding: 0.75rem;
//   text-align: center;
//   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
// `;

const DocumentPreview = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;

const DownloadButton = styled.a`
  display: inline-block;
  padding: 8px 12px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  &:hover {
    background: #1d4ed8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 2rem 0;
`;

const RemoveIcon = styled.span`
  position: absolute;
  top: 6px;
  right: 8px;
  cursor: pointer;
  color: #ef4444;
  font-size: 18px;
  font-weight: bold;
  background: #fff;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  transition: 0.2s ease;
  &:hover {
    background: #fee2e2;
  }
`;

const AddIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    border-color: #2563eb;
  }
`;

const AddIcon = styled.span`
  font-size: 32px;
  color: #2563eb;
  user-select: none;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const DocumentCard = styled.div`
  position: relative;
  background: #f9fafb;
  border-radius: 10px;
  padding: 0.75rem;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SellerRegistrationFormModal = ({
  selectedTemple,
  setSelectedTemple,
  setShowModal,
  fetchData,
}) => {
  const [uploads, setUploads] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleFileChange = (e, idx) => {
  //   setUploads((prev) => ({
  //     ...prev,
  //     [`document_file_${idx + 1}`]: e.target.files[0],
  //   }));
  // };

  // const handleSubmitApplication = () => {
  //   console.log("Submit application for:", selectedTemple);
  //   console.log("Uploads:", uploads);
  //   setShowModal(false);
  // };

  const handleFileChange = (e, idx, docLabel, isMandatory) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a renamed file with label name (no spaces, lowercase)
    const cleanLabel = docLabel.replace(/\s+/g, "_");
    const ext = file.name.split(".").pop();
    const newFileName = `${cleanLabel}_${
      isMandatory === "True" ? "required" : "optional"
    }.${ext}`;

    const renamedFile = new File([file], newFileName, { type: file.type });

    setUploads((prev) => ({
      ...prev,
      [`document_file_${idx + 1}`]: renamedFile,
    }));
  };

  // Validate mandatory docs for update mode
  const hasAllMandatoryDocs = () => {
    if (!selectedTemple?.additional_field_list?.supplier_document_name_list)
      return true;

    const mandatoryDocs =
      selectedTemple.additional_field_list.supplier_document_name_list.filter(
        (doc) => doc.is_mandatory === "True"
      );

    // For each mandatory doc, check:
    // - If seller removed it → invalid
    // - If it's replaced → valid
    // - If it's unchanged → valid
    return mandatoryDocs.every((doc, idx) => {
      const key = `document_file_${idx + 1}`;
      const sellerApp = selectedTemple?.SellerApplication || {};
      const uploadState = uploads[key];

      if (uploadState === null) return false; // removed → invalid
      if (uploadState instanceof File) return true; // replaced → valid
      if (sellerApp[key]) return true; // unchanged → valid
      return false;
    });
  };

const handleSubmitApplication = async (e, mode) => {
  e.preventDefault();

  if (mode === "update" && !hasAllMandatoryDocs()) {
    toast.error("Please upload all mandatory documents before submitting.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const sellerRefCode = localStorage.getItem("customerRefCode");
    if (!sellerRefCode) {
      throw new Error("Seller reference code not found. Please login again.");
    }

    const formData = new FormData();
    formData.append("temple_id", selectedTemple.temple_id);
    formData.append(
      "call_mode",
      mode === "update" ? "UPDATE_SELLER_DOCUMENT" : "ADD_SELLER_DOCUMENT"
    );
    formData.append("seller_ref_code", sellerRefCode);

    Object.keys(selectedTemple.SellerApplication || {}).forEach((key) => {
      if (key.startsWith("document_file_")) {
        const newValue = uploads[key];

        if (newValue === null) {
          // User removed this doc
          formData.append(key, "");
        } else if (newValue instanceof File) {
          // User replaced or uploaded new doc
          formData.append(key, newValue);
        } else {
          // No change → send existing file URL (so backend keeps it)
          formData.append(key, selectedTemple.SellerApplication[key] || "");
        }
      }
    });

    // Debug: check what’s being sent
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // --- API CALL ---
    const response = await processSellerApplication(formData);
    if (response.status !== 200) {
      throw new Error("Registration failed. Please try again.");
    }

    toast.success(
      mode === "update" ? "Update successful!" : "Registration successful!"
    );

    fetchData();
    setSelectedTemple(null);
    setUploads({});
  } catch (err) {
    setError(err.message);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  // Check if all mandatory documents are uploaded
  const canProceedToStep2 = () => {
    if (!selectedTemple) return false;

    const mandatoryDocs =
      selectedTemple.additional_field_list.supplier_document_name_list.filter(
        (doc) => doc.is_mandatory === "True"
      );

    return mandatoryDocs.every(
      (doc, index) => uploads[`document_file_${index + 1}`]
    );
  };

  const canSubmitUpdate = () => {
    // Must have changed at least one file and all mandatory docs must be present
    const hasChange = Object.keys(uploads).some(
      (key) => uploads[key] !== undefined
    );
    return hasChange && hasAllMandatoryDocs();
  };

  return (
    <Modal
      modalHeader={`Apply to ${selectedTemple.name}`}
      onClose={() => setShowModal(false)}
    >
      <ModalBody>
        <TempleDetailsSection>
          <SectionTitle>Temple Details</SectionTitle>
          <DetailRow>
            <DetailLabel>Name:</DetailLabel>
            <DetailValue>{selectedTemple.name}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Location:</DetailLabel>
            <DetailValue>
              {selectedTemple.location || "Not specified"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Admin:</DetailLabel>
            <DetailValue>
              {selectedTemple.contact_name || "Not specified"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Email Id:</DetailLabel>
            <DetailValue>
              {selectedTemple.email_id || "Not specified"}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Mobile Number:</DetailLabel>
            <DetailValue>
              {selectedTemple.mobile_number || "Not specified"}
            </DetailValue>
          </DetailRow>
        </TempleDetailsSection>

        {selectedTemple.mode === "update" ? (
<DocumentSection>
  <SectionTitle>Uploaded Documents</SectionTitle>

  {(() => {
    const sellerApp = selectedTemple?.SellerApplication || {};
    const documentList =
      selectedTemple.additional_field_list?.supplier_document_name_list || [];

    if (!documentList.length)
      return <EmptyState>No documents defined for this temple.</EmptyState>;

    const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

    const handleReplaceFile = (e, key, docLabel, isMandatory) => {
      const file = e.target.files[0];
      if (!file) return;

      const cleanLabel = docLabel.replace(/\s+/g, "_");
      const ext = file.name.split(".").pop();
      const newFileName = `${cleanLabel}_${isMandatory ? "required" : "optional"}.${ext}`;
      const renamedFile = new File([file], newFileName, { type: file.type });

      setUploads((prev) => ({
        ...prev,
        [key]: renamedFile,
      }));
    };

    const handleRemoveFile = (key) => {
      setUploads((prev) => ({
        ...prev,
        [key]: null,
      }));
    };

    return (
      <DocumentGrid>
        {documentList.map((doc, idx) => {
          const key = `document_file_${idx + 1}`;
          const isMandatory = doc.is_mandatory === "True";
          const label = doc.name;

          // Check existing or uploaded state
          const fileState = uploads[key];
          const existingUrl = sellerApp[key];

          let previewContent;

          // Determine what to show
          if (fileState === null || (!fileState && !existingUrl)) {
            // No file → show + icon to upload
            previewContent = (
              <AddIconWrapper>
                <label>
                  <AddIcon>＋</AddIcon>
                  <HiddenFileInput
                    type="file"
                    onChange={(e) => handleReplaceFile(e, key, label, isMandatory)}
                  />
                </label>
              </AddIconWrapper>
            );
          } else if (fileState instanceof File) {
            // Replaced file
            const fileUrl = URL.createObjectURL(fileState);
            const ext = fileState.name.split(".").pop().toLowerCase();
            const isImage = imageExtensions.includes(ext);
            previewContent = (
              <>
                <RemoveIcon onClick={() => handleRemoveFile(key)}>✕</RemoveIcon>
                {isImage ? (
                  <DocumentPreview src={fileUrl} alt={fileState.name} />
                ) : (
                  <DownloadButton as="div">{fileState.name}</DownloadButton>
                )}
              </>
            );
          } else if (existingUrl) {
            // Existing backend file
            const fileName = existingUrl.split("/").pop();
            const ext = fileName?.split(".").pop()?.toLowerCase();
            const isImage = imageExtensions.includes(ext);
            previewContent = (
              <>
                <RemoveIcon onClick={() => handleRemoveFile(key)}>✕</RemoveIcon>
                {isImage ? (
                  <DocumentPreview src={existingUrl} alt={fileName} />
                ) : (
                  <DownloadButton
                    href={existingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fileName}
                  </DownloadButton>
                )}
              </>
            );
          }

          return (
            <DocumentCard key={key}>
              <Label>
                {label}{" "}
                {isMandatory && <RequiredIndicator>*</RequiredIndicator>}
              </Label>
              {previewContent}
            </DocumentCard>
          );
        })}
      </DocumentGrid>
    );
  })()}
</DocumentSection>

        ) : (
          // your existing Required Documents section
          <DocumentSection>
            <SectionTitle>Required Documents</SectionTitle>
            {selectedTemple.additional_field_list?.supplier_document_name_list?.map(
              (doc, idx) => (
                <DocumentItem key={idx}>
                  <Label>
                    {doc.name}
                    {doc.is_mandatory === "True" && (
                      <RequiredIndicator>*</RequiredIndicator>
                    )}
                  </Label>
                  <FileInput
                    type="file"
                    required={doc.is_mandatory === "True"}
                    onChange={(e) =>
                      handleFileChange(e, idx, doc.name, doc.is_mandatory)
                    }
                  />
                </DocumentItem>
              )
            )}
          </DocumentSection>
        )}
      </ModalBody>

      {(selectedTemple?.SellerApplication?.cancel_remarks ||
        selectedTemple?.SellerApplication?.approval_remarks) && (
        <ModalBody>
          <SectionTitle>
            {selectedTemple?.SellerApplication?.cancel_remarks
              ? "Cancel Remark"
              : "Approval Remark"}
          </SectionTitle>
          <DetailValue>
            {selectedTemple?.SellerApplication?.cancel_remarks ||
              selectedTemple?.SellerApplication?.approval_remarks}
          </DetailValue>
        </ModalBody>
      )}

      {selectedTemple?.SellerApplication?.status !== "A" && (
        <ModalFooter>
          <CancelButton onClick={() => setShowModal(false)}>
            Cancel
          </CancelButton>
          <SubmitButton
            onClick={(e) => handleSubmitApplication(e, selectedTemple.mode)}
            disabled={
              selectedTemple.mode === "update"
                ? !canSubmitUpdate() || loading
                : !canProceedToStep2() || loading
            }
          >
            {selectedTemple.mode === "update"
              ? " Update"
              : "Submit Application"}
          </SubmitButton>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default SellerRegistrationFormModal;
