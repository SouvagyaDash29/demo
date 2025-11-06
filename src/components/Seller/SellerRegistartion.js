import React, { useEffect, useState } from "react";
import CustomerLayout from "../Customer/CustomerLayout";
import styled from "styled-components";
import { gettemplist } from "../../services/productServices";
import { getmyApplication } from "../../services/customerServices";
import SellerDataTable from "./ReusableComponents/SellerDataTable";
import SellerRegistrationFormModal from "./Modal/SellerRegistrationFormModal";
import TempleDetailsModal from "./Modal/TempleDetailsModal";

const PageContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const PageHeader = styled.h2`
  color: #1e293b;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '';
    width: 4px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
`;

const Tab = styled.button`
  padding: 0.875rem 1.5rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#64748b'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'transparent' : 'transparent'};
  font-weight: 600;
  font-size: 0.938rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px 8px 0 0;
  position: relative;
  bottom: -2px;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : '#f1f5f9'};
    color: ${props => props.active ? '#ffffff' : '#334155'};
  }
`;

const TempleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TempleCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
    border-color: #667eea;
  }
`;

const TempleImage = styled.div`
  width: 100%;
  height: 180px;
  background: ${props => props.src ? `url(${props.src})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const TempleContent = styled.div`
  padding: 1.25rem;
`;

const TempleName = styled.h3`
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const TempleLocation = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 0.625rem;
  background: #ffffff;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 0.625rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    transform: translateY(-1px);
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

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 2rem 0;
`;



const SellerRegistration = () => {
  const [temples, setTemples] = useState([]);
  const [allTemples, setAllTemples] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("temples");
  const [showModal, setShowModal] = useState(false);
  const [selectedTemple, setSelectedTemple] = useState({});
  const [templeDetailViewModal, setTempleDetailViewModal] = useState(false);
  const [uploads, setUploads] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [templeData, applicationData] = await Promise.all([
        gettemplist(),
        getmyApplication(),
      ]);
      const is_document_required_temple = templeData.data.filter((temple) => 
        temple.additional_field_list && 
        Object.keys(temple.additional_field_list).length > 0 && 
        temple.additional_field_list.supplier_document_name_list && 
        Array.isArray(temple.additional_field_list.supplier_document_name_list) &&
        temple.additional_field_list.supplier_document_name_list.length > 0
      );
      setTemples(is_document_required_temple);
      setAllTemples(templeData.data)
      setMyApplications(applicationData || []);
      console.log(applicationData)
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyClick = (templeId, mode, SellerApplication) => {
    const temple = allTemples.find((t) => t.temple_id === templeId);
    if (!temple) {
      console.warn("Temple not found:", templeId);
      return;
    }
    setSelectedTemple({ ...temple, mode, SellerApplication });
    // console.log({ ...temple, mode, SellerApplication  });
    setShowModal(true);
    setUploads({});
  };

  const handleViewDetails = (temple) => {
    setTempleDetailViewModal(true);
    setSelectedTemple(temple)
  };

  const columns = [
    {
      key: 'temple_name',
      title: 'Temple Name',
      type: 'text'
    },
    {
      key: 'status_display',
      title: 'Status',
      type: 'status'
    },
    {
      key: 'approved_by',
      title: 'Approved By',
      type: 'text'
    },
    // {
    //   key: 'document_file_1',
    //   title: 'Document',
    //   type: 'text'
    // },
    {
      key: 'actions',
      title: 'Actions',
      type: 'actions',
      buttons: [
        {
          label: 'Edit',
          onClick:  (temple) => handleApplyClick( temple.temple_id, "update", temple),
          hidden: (row) => row.is_approve === true
        }
      ],
      menuItems: [
        {
          label: 'View Details',
          onClick: (row) => console.log('View:', row)
        },
        {
          label: 'Duplicate',
          onClick: (row) => console.log('Duplicate:', row)
        },
        {
          label: 'Delete',
          onClick: (row) => console.log('Delete:', row)
        }
      ]
    }
  ];

  if (loading) {
    return (
      <CustomerLayout>
        <PageContainer>
          <LoadingSpinner>Loading...</LoadingSpinner>
        </PageContainer>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <PageContainer>
        <PageHeader>Temple Association</PageHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TabContainer>
          <Tab active={activeTab === "temples"} onClick={() => setActiveTab("temples")}>
            All Temples
          </Tab>
          <Tab active={activeTab === "applications"} onClick={() => setActiveTab("applications")}>
            My Applications
          </Tab>
        </TabContainer>

        {activeTab === "temples" && (
          <TempleGrid>
            {temples.length > 0 ? (
              temples.map((temple, index) => (
                <TempleCard key={index}>
                  <TempleImage src={temple.image}>
                    {!temple.image && "🛕"}
                  </TempleImage>
                  <TempleContent>
                    <TempleName>{temple.name}</TempleName>
                    <TempleLocation>
                      <span>📍</span>
                      {temple.location || "Location not specified"}
                    </TempleLocation>
                    <ButtonGroup>
                      <ViewButton onClick={() => handleViewDetails(temple)}>
                        View Details
                      </ViewButton>

                      <ApplyButton onClick={() => handleApplyClick(temple.temple_id, "apply")}>
                        Apply
                      </ApplyButton>
                    </ButtonGroup>
                  </TempleContent>
                </TempleCard>
              ))
            ) : (
              <EmptyState>No temples available</EmptyState>
            )}
          </TempleGrid>
        )}

        {activeTab === "applications" && (
          <SellerDataTable
            columns={columns}
            data={myApplications}
            onSelectionChange={(ids) => console.log('Selected:', ids)}
          />
          // <DataTable
          // columns={columns}
          // data={myApplications}
          // onEdit={() => handleApplyClick(selectedTemple)}
          
          // />
        )}

        {showModal && selectedTemple && (
          <SellerRegistrationFormModal selectedTemple={selectedTemple} setSelectedTemple={setSelectedTemple} setShowModal={setShowModal} fetchData={fetchData} />
        )}
        {templeDetailViewModal && 
        <TempleDetailsModal temple={selectedTemple} isOpen={templeDetailViewModal} onClose={() => setTempleDetailViewModal(false)} />
        }
      </PageContainer>
    </CustomerLayout>
  );
};

export default SellerRegistration;