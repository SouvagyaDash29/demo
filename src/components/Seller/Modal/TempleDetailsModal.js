import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled(motion.div)`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
  z-index: 10;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const CarouselContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
`;

const CarouselImage = styled(motion.img)`
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  background: ${props => props.active ? 'white' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    transform: scale(1.2);
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const InfoLabel = styled.div`
  color: #64748b;
  font-size: 0.813rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  color: #1e293b;
  font-size: 0.938rem;
  font-weight: 500;
`;

const TimingCard = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const TimingTitle = styled.div`
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.938rem;
`;

const TimingDetails = styled.div`
  color: #334155;
  font-size: 0.875rem;
`;

const ContentCard = styled.div`
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

const ContentTitle = styled.h4`
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ContentParagraph = styled.p`
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
`;

const DocumentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.mandatory ? '#fef2f2' : '#f0fdf4'};
  color: ${props => props.mandatory ? '#dc2626' : '#16a34a'};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.mandatory ? '#fecaca' : '#bbf7d0'};
`;

const TempleDetailsModal = ({ temple, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !temple) return null;

  // Extract images from temple data
  const images = [
    temple.image,
    temple.image_1,
    temple.image_2,
    temple.image_3,
    temple.image_4,
    temple.image_5,
    temple.image_6,
    temple.image_7,
    temple.image_8,
    temple.image_9,
  ].filter(Boolean); // Remove null/undefined values

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const timings = temple.additional_field_list?.temple_timings?.selected_time_slots || [];
  const templeData = temple.additional_field_list?.temple_data_list || [];
  const documents = temple.additional_field_list?.supplier_document_name_list || [];

  return (
    <AnimatePresence>
      {isOpen && temple && (
        <ModalOverlay
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ModalContainer
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
          >
            <ModalHeader>
              <ModalTitle>{temple.name}</ModalTitle>
              <CloseButton onClick={onClose}>×</CloseButton>
            </ModalHeader>

            <ModalBody>
              {/* Image Carousel */}
              {images.length > 0 && (
                <CarouselContainer>
                  <AnimatePresence mode="wait">
                    <CarouselImage
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={temple.name}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                  {images.length > 1 && (
                    <>
                      <CarouselButton direction="left" onClick={handlePrevImage}>
                        ‹
                      </CarouselButton>
                      <CarouselButton direction="right" onClick={handleNextImage}>
                        ›
                      </CarouselButton>
                      <CarouselDots>
                        {images.map((_, index) => (
                          <Dot
                            key={index}
                            active={index === currentImageIndex}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </CarouselDots>
                    </>
                  )}
                </CarouselContainer>
              )}

          {/* Basic Information */}
          <Section>
            <SectionTitle>📍 Basic Information</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Temple ID</InfoLabel>
                <InfoValue>{temple.temple_id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>{temple.location}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Temple Group</InfoLabel>
                <InfoValue>{temple.temple_group}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Sub Group</InfoLabel>
                <InfoValue>{temple.temple_sub_group}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* Contact Information */}
          <Section>
            <SectionTitle>📞 Contact Information</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Contact Person</InfoLabel>
                <InfoValue>{temple.contact_name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{temple.email_id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Mobile</InfoLabel>
                <InfoValue>{temple.mobile_number}</InfoValue>
              </InfoItem>
              {temple.alternate_contact_number && (
                <InfoItem>
                  <InfoLabel>Alternate Contact</InfoLabel>
                  <InfoValue>{temple.alternate_contact_number}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>

          {/* Address */}
          <Section>
            <SectionTitle>🏛️ Address</SectionTitle>
            <InfoItem>
              <InfoValue>
                {temple.address_line_1}
                {temple.address_line_2 && `, ${temple.address_line_2}`}
                {temple.address_line_3 && `, ${temple.address_line_3}`}
                <br />
                {temple.pin_code} - {temple.state_code}
              </InfoValue>
            </InfoItem>
          </Section>

          {/* Temple Timings */}
          {timings.length > 0 && (
            <Section>
              <SectionTitle>🕐 Temple Timings</SectionTitle>
              {timings.map((timing, index) => (
                <TimingCard key={index}>
                  <TimingTitle>{timing.name}</TimingTitle>
                  <TimingDetails>
                    {timing.start} - {timing.end}
                  </TimingDetails>
                </TimingCard>
              ))}
            </Section>
          )}

          {/* Temple Information */}
          {templeData.length > 0 && (
            <Section>
              <SectionTitle>📖 About Temple</SectionTitle>
              {templeData.map((data, index) => (
                <ContentCard key={index}>
                  <ContentTitle>{data.title}</ContentTitle>
                  <ContentParagraph>{data.paragraph}</ContentParagraph>
                </ContentCard>
              ))}
            </Section>
          )}

          {/* Required Documents */}
          {documents.length > 0 && (
            <Section>
              <SectionTitle>📄 Required Documents for Suppliers</SectionTitle>
              <div>
                {documents.map((doc, index) => (
                  <DocumentBadge key={index} mandatory={doc.is_mandatory === "True"}>
                    {doc.name}
                    {doc.is_mandatory === "True" ? " (Required)" : " (Optional)"}
                  </DocumentBadge>
                ))}
              </div>
            </Section>
          )}

          {/* Additional Information */}
          {(temple.web_page || temple.remarks) && (
            <Section>
              <SectionTitle>ℹ️ Additional Information</SectionTitle>
              <InfoGrid>
                {temple.web_page && (
                  <InfoItem>
                    <InfoLabel>Website</InfoLabel>
                    <InfoValue>
                      <a
                        href={temple.web_page}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#667eea', textDecoration: 'none' }}
                      >
                        {temple.web_page}
                      </a>
                    </InfoValue>
                  </InfoItem>
                )}
                {temple.remarks && (
                  <InfoItem>
                    <InfoLabel>Remarks</InfoLabel>
                    <InfoValue>{temple.remarks}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </Section>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default TempleDetailsModal;