import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Printer, 
  Mail, 
  Edit2, 
  Package, 
  Clock, 
  CreditCard, 
  ShoppingCart 
} from 'lucide-react';

// Theme
const theme = {
  colors: {
    primary: '#1976D2',
    success: '#4CAF50',
    warning: '#FF9800',
    text: '#212121',
    textSecondary: '#666',
    border: '#E0E0E0',
    background: '#F5F5F5',
    white: '#FFFFFF',
    paid: '#E8F5E9'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: ${theme.colors.background};
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 15px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 0 0 5px 0;
  color: ${theme.colors.text};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$primary ? theme.colors.primary : theme.colors.white};
  color: ${props => props.$primary ? theme.colors.white : theme.colors.text};
  border: ${props => props.$primary ? 'none' : `1px solid ${theme.colors.border}`};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex: 1;
    justify-content: center;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr 350px;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  margin: 0;
  color: ${theme.colors.text};
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const OrderItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  background: ${theme.colors.background};
  border-radius: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 16px;
  margin: 0 0 5px 0;
  color: ${theme.colors.text};
`;

const ItemSku = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

const ItemPrice = styled.div`
  text-align: right;
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const Quantity = styled.div`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin-top: 5px;
`;

const Summary = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${theme.colors.border};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${props => props.$total ? theme.colors.text : theme.colors.textSecondary};
  font-weight: ${props => props.$total ? '600' : '400'};
  font-size: ${props => props.$total ? '18px' : '14px'};
`;

const PaymentBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: ${theme.colors.paid};
  color: ${theme.colors.success};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
  background: ${theme.colors.white};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 10px;
  background: ${props => props.$primary ? theme.colors.primary : 'transparent'};
  color: ${props => props.$primary ? theme.colors.white : props.$danger ? '#F44336' : theme.colors.text};
  border: ${props => props.$primary ? 'none' : `1px solid ${theme.colors.border}`};

  &:hover {
    opacity: 0.9;
  }
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 40px;
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  padding-bottom: 25px;

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: -29px;
    top: 0;
    bottom: -25px;
    width: 2px;
    background: ${theme.colors.border};
  }

  &:last-child::before {
    display: none;
  }
`;

const TimelineIcon = styled.div`
  position: absolute;
  left: -40px;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$color || theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
`;

const TimelineContent = styled.div`
  h4 {
    margin: 0 0 5px 0;
    font-size: 14px;
    color: ${theme.colors.text};
  }

  p {
    margin: 0;
    font-size: 12px;
    color: ${theme.colors.textSecondary};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-size: 12px;
    display: inline-block;
    margin-top: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const InfoSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    font-size: 14px;
    margin: 0 0 10px 0;
    color: ${theme.colors.textSecondary};
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: ${theme.colors.text};
    line-height: 1.6;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Main Component
const OrderDetailsPage = () => {
  const [status, setStatus] = useState('Processing');

  const orderData = {
    orderNumber: '#10542',
    date: 'October 26, 2023 at 3:30 PM',
    items: [
      {
        id: 1,
        name: 'Ergonomic Office Chair',
        sku: 'CH-452-BLK',
        price: 250.00,
        qty: 1,
        icon: '🪑'
      },
      {
        id: 2,
        name: 'Wireless Mechanical Keyboard',
        sku: 'KB-789-WRL',
        price: 120.00,
        qty: 2,
        icon: '⌨️'
      }
    ],
    subtotal: 370.00,
    shipping: 15.00,
    taxes: 29.60,
    total: 414.60,
    payment: 'Visa **** 4242',
    customer: {
      name: 'Alex Johnson',
      address: '123 Maple Street',
      city: 'Anytown, CA 90210',
      country: 'United States',
      email: 'alex.j@example.com',
      phone: '(555) 123-4567'
    },
    history: [
      {
        status: 'Order Shipped',
        date: 'October 27, 2023 at 11:00 AM',
        tracking: '129999999999999999',
        icon: <Package size={14} />,
        color: theme.colors.primary
      },
      {
        status: 'Order in Processing',
        date: 'October 26, 2023 at 4:15 PM',
        icon: <Clock size={14} />,
        color: theme.colors.warning
      },
      {
        status: 'Payment Confirmed',
        date: 'October 26, 2023 at 3:31 PM',
        icon: <CreditCard size={14} />,
        color: theme.colors.success
      },
      {
        status: 'Order Placed',
        date: 'October 26, 2023 at 3:30 PM',
        icon: <ShoppingCart size={14} />,
        color: theme.colors.textSecondary
      }
    ]
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>{orderData.orderNumber}</Title>
          <Subtitle>{orderData.date}</Subtitle>
        </div>
        <ButtonGroup>
          <Button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Printer size={18} />
            Print Invoice
          </Button>
          <Button $primary whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Mail size={18} />
            Contact Customer
          </Button>
        </ButtonGroup>
      </Header>

      <Grid>
        <div>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle>Order Items ({orderData.items.length})</CardTitle>
            </CardHeader>
            
            {orderData.items.map(item => (
              <OrderItem key={item.id}>
                <ItemImage>{item.icon}</ItemImage>
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemSku>SKU: {item.sku}</ItemSku>
                </ItemDetails>
                <ItemPrice>
                  <Price>${item.price.toFixed(2)}</Price>
                  <Quantity>Qty: {item.qty}</Quantity>
                </ItemPrice>
              </OrderItem>
            ))}

            <Summary>
              <SummaryRow>
                <span>Subtotal</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Shipping (Standard)</span>
                <span>${orderData.shipping.toFixed(2)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Taxes</span>
                <span>${orderData.taxes.toFixed(2)}</span>
              </SummaryRow>
              <SummaryRow $total>
                <span>Total</span>
                <span>${orderData.total.toFixed(2)}</span>
              </SummaryRow>
              <PaymentBadge>Paid</PaymentBadge>
              <div style={{ marginTop: '10px', fontSize: '14px', color: theme.colors.textSecondary }}>
                Payment via {orderData.payment}
              </div>
            </Summary>
          </Card>

          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ marginTop: '20px' }}
          >
            <CardHeader>
              <CardTitle>Customer & Shipping</CardTitle>
              <IconButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Edit2 size={18} />
              </IconButton>
            </CardHeader>
            <InfoSection>
              <h3>{orderData.customer.name}</h3>
              <p>
                {orderData.customer.address}<br />
                {orderData.customer.city}<br />
                {orderData.customer.country}
              </p>
              <p style={{ marginTop: '10px' }}>
                <a href={`mailto:${orderData.customer.email}`}>{orderData.customer.email}</a><br />
                <a href={`tel:${orderData.customer.phone}`}>{orderData.customer.phone}</a>
              </p>
            </InfoSection>
          </Card>

          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ marginTop: '20px' }}
          >
            <CardHeader>
              <CardTitle>Billing Details</CardTitle>
              <IconButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Edit2 size={18} />
              </IconButton>
            </CardHeader>
            <InfoSection>
              <h3>{orderData.customer.name}</h3>
              <p>
                {orderData.customer.address}<br />
                {orderData.customer.city}<br />
                {orderData.customer.country}
              </p>
              <p style={{ marginTop: '15px' }}>
                <strong>Payment Method</strong><br />
                {orderData.payment}
              </p>
            </InfoSection>
          </Card>
        </div>

        <div>
          <Card
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardTitle>Order Status</CardTitle>
            <InfoSection>
              <h3>Current Status</h3>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </Select>
            </InfoSection>
            <ActionButton
              $primary
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Update Status
            </ActionButton>
            {/* <ActionButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Add Tracking Number
            </ActionButton> */}
            <ActionButton
              $danger
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Issue Refund
            </ActionButton>
          </Card>

          <Card
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ marginTop: '20px' }}
          >
            <CardTitle>Order History</CardTitle>
            <Timeline style={{ marginTop: '20px' }}>
              {orderData.history.map((item, index) => (
                <TimelineItem
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TimelineIcon $color={item.color}>
                    {item.icon}
                  </TimelineIcon>
                  <TimelineContent>
                    <h4>{item.status}</h4>
                    <p>{item.date}</p>
                    {item.tracking && (
                      <a href="#">Tracking number: {item.tracking}</a>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Card>
        </div>
      </Grid>
    </Container>
  );
};

export default OrderDetailsPage;