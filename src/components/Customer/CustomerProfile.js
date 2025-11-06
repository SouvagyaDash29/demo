"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import SetNewPinPopup from "./CustomerModal/SetNewPin";
import { getSellerAllList } from "../../services/customerServices";

const seller_Color_palttels = {
  Primary: "#8B5CF6",
  Accent:	"#FACC15",
Background:	"#F9FAFB" ,
 white:	"#FFFFFF",
Text_Primary:	"#1F2937",
Text_Secondary:	"#6B7280",
Success:	"#10B981",
Warning:	"#F59E0B",
Error:	"#EF4444",
blue: "#667EEA",
purple: "#764BA2",
linear_gradient: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
backgroung_linear_gradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.14))",
menuItems_hover: "linear-gradient(145deg, #764ba2, #7c3aed)",
GLASS_BG_HOVER : "linear-gradient(135deg, rgb(255 255 255 / 24%), rgb(255 255 255 / 14%))",
}

const MaxWidthContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: ${(props) => props.isSeller ? seller_Color_palttels.linear_gradient : "linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54))"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  h1 {
    font-size: 32px;
    font-weight: bold;
    color: #1f2937;
    margin: 0 0 4px 0;
  }

  .email {
    color: #6b7280;
    margin: 0 0 4px 0;
  }

  .member-since {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }
`;

const EditButton = styled.button`
  padding: 12px 24px;
  background: ${(props) => props.isSeller? seller_Color_palttels.linear_gradient : "linear-gradient(145deg, rgb(212, 175, 55), rgb(196, 69, 54))"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px ${(props) => props.isSeller? "" :"rgba(249, 115, 22, 0.3)"};

  &:hover {
    background: ${(props) => props.isSeller ? "red" : "linear-gradient(145deg,rgba(212, 120, 55, 1),rgba(135, 46, 36, 1))"}
    transform: translateY(-1px);
    box-shadow: 0 6px 16px ${(props) => props.isSeller? "" :" rgba(249, 115, 22, 0.4)"};
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: ${(props) => props.isSeller ? "1fr" : "2fr 1fr"};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 24px 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormGroup = styled.div`
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

const StaticText = styled.p`
  color: #1f2937;
  padding: 12px 0;
  margin: 0;
`;

const NotificationSection = styled.div`
  margin-top: 32px;
`;

const NotificationTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #f97316;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const SaveButton = styled.button`
  margin-top: 32px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  float: right;

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
`;

const SidebarCard = styled(Card)`
  height: fit-content;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const StatLabel = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: #1f2937;

  &.green {
    color: #059669;
  }
  &.blue {
    color: #2563eb;
  }
  &.red {
    color: #dc2626;
  }
  &.orange {
    color: #ea580c;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e5e7eb;
  margin: 12px 0;
`;

const BookingItem = styled.div`
  border-left: 4px solid #fb923c;
  padding: 12px 0 12px 16px;
  margin-bottom: 16px;
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const BookingInfo = styled.div`
  flex: 1;

  h4 {
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
    font-size: 16px;
  }

  .temple {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 4px 0;
  }

  .date {
    font-size: 12px;
    color: #9ca3af;
    margin: 0;
  }
`;

const BookingMeta = styled.div`
  text-align: right;

  .amount {
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }
`;

const StatusBadge = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;

  &.completed {
    color: #059669;
    background-color: #d1fae5;
  }

  &.upcoming {
    color: #2563eb;
    background-color: #dbeafe;
  }

  &.cancelled {
    color: #dc2626;
    background-color: #fee2e2;
  }
`;

const ViewAllButton = styled.button`
  width: 100%;
  text-align: center;
  color: #ea580c;
  background: none;
  border: none;
  font-weight: 500;
  font-size: 14px;
  padding: 12px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #c2410c;
  }
`;

const QuickActionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
    color: white;
    border: none;

    &:hover {
      background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: white;
    color: #ea580c;
    border: 2px solid #ea580c;

    &:hover {
      background: #fff7ed;
    }
  }

  &.tertiary {
    background: white;
    color: #6b7280;
    border: 2px solid #d1d5db;

    &:hover {
      background: #f9fafb;
    }
  }
`;

const CustomerProfile = () => {
  const { customer, sellerProfile } = useCustomerAuth();
  const currentCustomerId = localStorage.getItem("customerId");
  const [isEditing, setIsEditing] = useState(false);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "Rajesh Kumar",
    email_id: "rajesh.kumar@email.com",
    mobile_number: "+91 9876543210",
    address: "123 Temple Street, Bangalore, Karnataka 560001",
    address_line_1: "123 Temple Street, Bangalore, Karnataka 560001",
    address_line_2: "123 Temple Street, Bangalore, Karnataka 560001",
    address_line_3: "123 Temple Street, Bangalore, Karnataka 560001",
    dateOfBirth: "1985-06-15",
    alternate_contact_number: "+91 9876543211",
    preferredLanguage: "English",
    notifications: {
      email: true,
      sms: true,
      whatsapp: false,
    },
  });

  useEffect(() => {
  if (sellerProfile) {
    const profileData = sellerProfile;
    
    // Merge with default to ensure all fields exist
    setFormData(prevData => ({
      ...prevData, // Keep default values
      ...profileData, // Override with sellerProfile data
      notifications: {
        ...prevData.notifications, // Default notifications
        ...(profileData.notifications || {}) // Profile notifications if exist
      }
    }));
  }
}, [sellerProfile]);
  const customerCode = localStorage.getItem("customerRefCode");
  const isSeller = customerCode?.startsWith("S");

  // Hardcoded booking statistics
  const bookingStats = {
    totalBookings: 24,
    completedBookings: 20,
    upcomingBookings: 2,
    cancelledBookings: 2,
    totalAmountSpent: 15750,
    favoriteTemple: "Sri Krishna Temple",
  };

  // Hardcoded recent bookings
  const recentBookings = [
    {
      id: "BK001",
      templeName: "Sri Krishna Temple",
      serviceName: "Abhishekam",
      date: "2024-01-15",
      amount: 500,
      status: "Completed",
    },
    {
      id: "BK002",
      templeName: "Ganesha Temple",
      serviceName: "Special Puja",
      date: "2024-01-20",
      amount: 750,
      status: "Upcoming",
    },
    {
      id: "BK003",
      templeName: "Hanuman Temple",
      serviceName: "Aarti",
      date: "2024-01-10",
      amount: 200,
      status: "Completed",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <CustomerLayout>
      <MaxWidthContainer>
        {/* Header */}
        <HeaderCard>
          <HeaderContent>
            <ProfileSection>
              <Avatar isSeller={isSeller}>{getInitials(formData.name)}</Avatar>
              <ProfileInfo>
                <h1>{formData.name}</h1>
                <p className="email">{formData.email}</p>
                <p className="member-since">Member since January 2023</p>
              </ProfileInfo>
            </ProfileSection>
            <div style={{ display: "flex", gap: "12px" }}>
              <EditButton onClick={() => setIsEditing(!isEditing)} isSeller={isSeller}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </EditButton>
              <EditButton onClick={() => setShowPinPopup(true)} isSeller={isSeller}>
                Update PIN
              </EditButton>
            </div>
          </HeaderContent>
        </HeaderCard>

        <GridContainer isSeller={isSeller}>
          {/* Profile Information */}
          <Card>
            <CardTitle>Profile Information</CardTitle>

            <FormGrid>
              <FormGroup>
                <Label>Full Name</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <StaticText>{formData.name}</StaticText>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    name="email"
                    value={formData.email_id}
                    onChange={handleInputChange}
                  />
                ) : (
                  <StaticText>{formData.email_id}</StaticText>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                  />
                ) : (
                  <StaticText>{formData.mobile_number}</StaticText>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Date of Birth</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                ) : (
                  <StaticText>
                    {new Date(formData.dateOfBirth).toLocaleDateString()}
                  </StaticText>
                )}
              </FormGroup>

              <FormGroup className="full-width">
                <Label>Address</Label>
                {isEditing ? (
                  <TextArea
                    name="address"
                    value={formData.address || formData.address_line_1 || formData.address_line_2 || formData.address_line_3}
                    onChange={handleInputChange}
                    rows="3"
                  />
                ) : (
                  <StaticText>{formData.address || formData.address_line_1 || formData.address_line_2 || formData.address_line_3}</StaticText>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Emergency Contact</Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    name="emergencyContact"
                    value={formData.alternate_contact_number}
                    onChange={handleInputChange}
                  />
                ) : (
                  <StaticText>{formData.alternate_contact_number}</StaticText>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Preferred Language</Label>
                {isEditing ? (
                  <Select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                  </Select>
                ) : (
                  <StaticText>{formData.preferredLanguage}</StaticText>
                )}
              </FormGroup>
            </FormGrid>

            {/* Notification Preferences */}
            <NotificationSection>
              <NotificationTitle>Notification Preferences</NotificationTitle>
              <CheckboxGroup>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    name="notifications.email"
                    checked={formData.notifications.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <CheckboxLabel>Email notifications</CheckboxLabel>
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    name="notifications.sms"
                    checked={formData.notifications.sms}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <CheckboxLabel>SMS notifications</CheckboxLabel>
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    name="notifications.whatsapp"
                    checked={formData.notifications.whatsapp}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <CheckboxLabel>WhatsApp notifications</CheckboxLabel>
                </CheckboxItem>
              </CheckboxGroup>
            </NotificationSection>

            {isEditing && (
              <SaveButton onClick={handleSave}>Save Changes</SaveButton>
            )}
          </Card>

          {/* Statistics and Recent Activity */}
         {!isSeller && <div>
            {/* Booking Statistics */}
            <SidebarCard style={{ marginBottom: "24px" }}>
              <CardTitle>Booking Statistics</CardTitle>
              <div>
                <StatItem>
                  <StatLabel>Total Bookings</StatLabel>
                  <StatValue>{bookingStats.totalBookings}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Completed</StatLabel>
                  <StatValue className="green">
                    {bookingStats.completedBookings}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Upcoming</StatLabel>
                  <StatValue className="blue">
                    {bookingStats.upcomingBookings}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Cancelled</StatLabel>
                  <StatValue className="red">
                    {bookingStats.cancelledBookings}
                  </StatValue>
                </StatItem>
                <Divider />
                <StatItem>
                  <StatLabel>Total Spent</StatLabel>
                  <StatValue className="orange">
                    ₹{bookingStats.totalAmountSpent.toLocaleString()}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Favorite Temple</StatLabel>
                  <StatValue style={{ fontSize: "14px" }}>
                    {bookingStats.favoriteTemple}
                  </StatValue>
                </StatItem>
              </div>
            </SidebarCard>

            {/* Recent Bookings */}
            <SidebarCard style={{ marginBottom: "24px" }}>
              <CardTitle>Recent Bookings</CardTitle>
              <div>
                {recentBookings.map((booking) => (
                  <BookingItem key={booking.id}>
                    <BookingHeader>
                      <BookingInfo>
                        <h4>{booking.serviceName}</h4>
                        <p className="temple">{booking.templeName}</p>
                        <p className="date">
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </BookingInfo>
                      <BookingMeta>
                        <p className="amount">₹{booking.amount}</p>
                        <StatusBadge className={booking.status.toLowerCase()}>
                          {booking.status}
                        </StatusBadge>
                      </BookingMeta>
                    </BookingHeader>
                  </BookingItem>
                ))}
              </div>
              <ViewAllButton>View All Bookings →</ViewAllButton>
            </SidebarCard>

            {/* Quick Actions */}
            <SidebarCard>
              <CardTitle>Quick Actions</CardTitle>
              <QuickActionsGrid>
                <ActionButton className="primary">Book New Seva</ActionButton>
                <ActionButton className="secondary">
                  View Booking History
                </ActionButton>
                <ActionButton className="tertiary">
                  Download Receipts
                </ActionButton>
              </QuickActionsGrid>
            </SidebarCard>
          </div>}
        </GridContainer>
      </MaxWidthContainer>
      {showPinPopup && (
        <SetNewPinPopup
          onClose={() => setShowPinPopup(false)}
          customerId={currentCustomerId}
        />
      )}
    </CustomerLayout>
  );
};

export default CustomerProfile;
