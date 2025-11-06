"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiPhone, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import {
  loginCustomer,
  saveCustomerAuth,
} from "../../services/customerServices";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";

const LoginContainer = styled.div`
  min-height: 100vh;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("https://i.pinimg.com/236x/92/72/be/9272bec9a4977ba0f128b7fe8179bd9d.jpg");
    background-size: cover;
    background-position: center;
    filter: blur(5px);
    z-index: 0;
  }
`;

const LoginCard = styled(motion.div)`
  background: rgba(245, 248, 231, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  box-shadow: 0 25px 50px rgba(225, 80, 32, 0.2);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  border: 3px solid rgba(227, 98, 24, 0.2);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  .om-symbol {
    font-size: 4rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
  }

  .title {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1f2937, #374151);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 500;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: #374151;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .icon {
    color: #e16417ff;
    font-size: 1.2rem;
  }
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const LoginButton = styled(motion.button)`
  background: linear-gradient(135deg, #dfea66ff 0%, #dd3320ff 100%);
  color: white;
  font-weight: 700;
  padding: 1.25rem 2rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  box-shadow: 0 10px 30px rgba(234, 221, 102, 0.4);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    box-shadow: 0 15px 40px rgba(216, 234, 102, 0.5);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  border: 1px solid #fca5a5;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "⚠️";
  }
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  a {
    color: #e16417ff;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      color: #a7b732ff;
      text-decoration: underline;
    }
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;

  .text {
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.05rem;
    transition: all 0.2s ease;

    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const TabContainer = styled.div`
  display: flex;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
  border: 1px solid rgba(212, 175, 55, 0.2);
`;

const Tab = styled(motion.button)`
  flex: 1;
  padding: 5px 2px;
  border: 2px solid rgba(212, 175, 55, 0.2);
  background: ${(props) =>
    props.active ? "linear-gradient(135deg, #d4af37, #c44536)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-weight: 600;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    background: ${(props) =>
      props.active
        ? "linear-gradient(135deg, #d4af37, #c44536)"
        : "rgba(212, 175, 55, 0.1)"};
  }
`;

const CustomerLogin = () => {
  const [credentials, setCredentials] = useState({
    mobile_number: "",
    pin: "",
  });

  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useCustomerAuth();
  const pathname = window.location.pathname;
  const adminId = localStorage.getItem("userToken");
  const userId = localStorage.getItem("customerToken");
  const customerRefCode = localStorage.getItem("customerRefCode");

  const redirectToDashboard = () => {
  const isSeller = customerRefCode?.startsWith("S");
  const currentPath = window.location.pathname;
  const targetPath = isSeller ? "/seller-Dashboard" : "/customer-dashboard";

  if (currentPath !== targetPath) {
    window.location.href = targetPath;
  }
};

  useEffect(() => {
  if (userId) redirectToDashboard();
}, [userId]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginCustomer(credentials);

      // Save auth data
      saveCustomerAuth(response);

      // Update context
      login(response);

      // Navigate to customer dashboard
      redirectToDashboard();
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  const navigatetopage = (path) => {
    navigate(path);
  };
  return (
    <LoginContainer>
      <LoginCard>
        <TabContainer>
          <Tab
            onClick={() =>
              navigatetopage(
                pathname == "/seller-login"
                  ? "/customer-login"
                  : "/seller-login"
              )
            }
          >
            {pathname == "/seller-login"
              ? "👤 Login as Customer"
              : "👥 Login as Seller"}
          </Tab>
          <Tab onClick={() => navigatetopage("/login")}>🙏 Login as Admin</Tab>
        </TabContainer>
        <Logo></Logo>
        <Logo>
          <div className="title">Welcome Back</div>
          {/* <div className="subtitle">Continue your spiritual journey</div> */}
        </Logo>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {error}
            </ErrorMessage>
          )}

          <FormGroup>
            <Label htmlFor="mobile_number">
              <FiPhone className="icon" />
              Mobile Number
            </Label>
            <Input
              type="tel"
              id="mobile_number"
              name="mobile_number"
              value={credentials.mobile_number}
              onChange={handleChange}
              required
              placeholder="Enter your mobile number"
              pattern="[0-9]{10}"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="pin">
              <FiLock className="icon" />
              PIN
            </Label>
            <InputContainer>
              <Input
                type={showPin ? "text" : "password"}
                id="pin"
                name="pin"
                value={credentials.pin}
                onChange={handleChange}
                required
                placeholder="Enter your PIN"
                maxLength="6"
              />
              <ToggleButton type="button" onClick={() => setShowPin(!showPin)}>
                {showPin ? <FiEyeOff /> : <FiEye />}
              </ToggleButton>
            </InputContainer>
          </FormGroup>

          <LoginButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Signing In...
              </>
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </LoginButton>
        </Form>

        <LinkContainer>
          {pathname === "/seller-login" ? (
            <>
              <Link to="/sellerforgot-pin">Forgot PIN?</Link>
              <Link to="/seller-register">Create Account</Link>
            </>
          ) : (
            <>
              <Link to="/forgot-pin">Forgot PIN?</Link>
              <Link to="/customer-register">Create Account</Link>
            </>
          )}
        </LinkContainer>
      </LoginCard>
    </LoginContainer>
  );
};

export default CustomerLogin;
