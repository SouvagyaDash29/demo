import { Upload, X } from "lucide-react";
import { useEffect, useRef } from "react";
import styled from "styled-components";

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

const ThumbnailGrid = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

// Helper function to normalize different input types to a consistent format
const normalizeImage = (image) => {
  if (!image) return null;
  
  // If it's already in our preferred format { file, url }
  if (typeof image === 'object' && image.url && (image.file || image.src)) {
    return image;
  }
  
  // If it's a File object
  if (image instanceof File) {
    return {
      file: image,
      url: URL.createObjectURL(image)
    };
  }
  
  // If it's a string (URL or base64)
  if (typeof image === 'string') {
    return {
      url: image,
      // For external URLs, we don't have the original file
      file: null
    };
  }
  
  // If it's an object with src property
  if (typeof image === 'object' && image.src) {
    return {
      url: image.src,
      file: image.file || null
    };
  }
  
  return null;
};

// Helper to normalize the images array
const normalizeImages = (images) => {
  if (!images) return [];
  
  if (Array.isArray(images)) {
    return images.map(normalizeImage).filter(Boolean);
  }
  
  // If it's a single image
  const normalized = normalizeImage(images);
  return normalized ? [normalized] : [];
};

export const ImageUploader = ({ 
  images, 
  onChange, 
  max = 6, 
  activeImage, 
  setActiveImage 
}) => {
  const fileInputRef = useRef(null);

  const normalizedImages = normalizeImages(images);

  const handleFileChange = (e, replaceIndex = null) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));

    onChange((prev) => {
      const previousImages = normalizeImages(prev);
      let updated = [...previousImages];
      
      if (replaceIndex !== null) {
        // Replace specific image
        if (newImages[0]) {
          updated[replaceIndex] = newImages[0];
        }
      } else {
        // Add new images
        updated = [...updated, ...newImages].slice(0, max);
      }
      
      return updated;
    });

    // Reset file input
    e.target.value = '';
  };

  const removeImage = (index) => {
    onChange((prev) => {
      const previousImages = normalizeImages(prev);
      const updated = previousImages.filter((_, i) => i !== index);
      
      // Revoke object URL to avoid memory leaks
      if (previousImages[index]?.url && previousImages[index]?.file) {
        URL.revokeObjectURL(previousImages[index].url);
      }
      
      // Update active image if needed
      if (activeImage === previousImages[index]?.url) {
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
      const previousImages = normalizeImages(prev);
      const updated = [...previousImages];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, dragged);
      return updated;
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      normalizedImages.forEach(img => {
        if (img?.file && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

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
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        style={{ width: "100%", marginBottom: "12px" }}
      >
        <Upload size={16} /> Upload Images ({(normalizedImages || []).length}/{max})
      </Button>

      {normalizedImages?.length > 0 && (
        <ThumbnailGrid>
          {normalizedImages.map((img, i) => (
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