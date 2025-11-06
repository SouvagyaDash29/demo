import axios from "axios";

const BASE_URL = "https://agamandira.com/customer/api";
const PRODUCT_BASE_URL = "https://agamandira.com/product/api"

// Customer Registration
export const registerCustomer = async (customerData, pathName) => {
  try {
    const apiEndpoint =
      pathName === "/seller-register"
        ? `${BASE_URL}/seller_registration/`
        : `${BASE_URL}/customer_registration/`;
    const response = await axios.post(apiEndpoint, customerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Customer Login
export const loginCustomer = async (credentials) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customer_pin_login/`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Set New PIN
export const setNewPin = async (pinData) => {
  const token = localStorage.getItem("customerToken");
  const data = {
    u_id: pinData.u_id,
    o_pin: pinData.o_pin,
    n_pin: pinData.n_pin,
  };
  try {
    const response = await axios.post(`${BASE_URL}/customer_reset_pin/`, data, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Forgot PIN
export const forgotPin = async (mobileNumber) => {
  try {
    const response = await axios.post(`${BASE_URL}/customer_forget_pin/`, {
      mobile_number: mobileNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Process Booking
export const processBooking = async (bookingData) => {
  const token = localStorage.getItem("customerToken");
  const Admintoken = localStorage.getItem("userToken");
  try {
    const response = await axios.post(
      `${BASE_URL}/process_booking_data/`,
      bookingData,
      {
        headers: {
          Authorization: `Token ${token ? token : Admintoken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Booking List
export const getBookingList = async (startDate = null, endDate = null) => {
  const custRefCode = localStorage.getItem("customerRefCode");
  const token = localStorage.getItem("customerToken");
  const tokens = localStorage.getItem("userToken");

  try {
    let url = `${BASE_URL}/get_booking_list/`;

    // Add date parameters if provided
    if (startDate && endDate) {
      url += `?from_date=${startDate}&to_date=${endDate}`;
      // or use whatever parameter names your API expects
      // url += `&booking_start_date=${startDate}&booking_end_date=${endDate}`;
    } else {
      url += `?cust_ref_code=${custRefCode}`;
    }

    const response = await axios.get(url, {
        headers: {
        Authorization: `Token ${token ? token : tokens}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch Bookings by Service ID
export const getServiceBookings = async (id, name) => {
  // console.log(serviceId, "serviceId");
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  try {
    const urladmin = `${BASE_URL}/get_booking_list/?temple_id=${id}`;
    const urlcustomer = `${BASE_URL}/get_booking_list/?cust_ref_code=${id}`;
    const urluser = `${BASE_URL}/get_booking_list/`;
    const config = {};
    if (token) {
      config.headers = { Authorization: `Token ${token}` };
    }
    const response = await axios.get(
      name == "admin" ? urladmin : name == "user" ? urluser : urlcustomer,
      config
    );
    return response.data;
  } catch (error) {
    console.log(
      "getServiceBookings failed:",
      error?.response?.data || error?.message
    );
    return [];
  }
};

// Seller Temple List (for approvals)
export const getSellerTempleList = async () => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  try {
    const url = `${BASE_URL}/get_seller_temple_list/`;
    const config = {};
    if (token) {
      config.headers = { Authorization: `Token ${token}` };
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update seller status (APPROVE | INACTIVE)
export const updateSellerStatus = async ({
  temple_id,
  call_mode,
  seller_ref_code,
  remark
}) => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  try {
    const url = `${BASE_URL}/seller_update/`;
    // Use FormData to mirror Postman form-data/x-www-form-urlencoded behavior
    const form = new FormData();
    form.append("temple_id", temple_id);
    form.append("call_mode", call_mode);
    form.append("seller_ref_code", seller_ref_code);
    form.append("remarks", remark);
    // if (approval_remarks) {
    //   form.append("approval_remarks", approval_remarks);
    // }
    // if (cancel_remarks) {
    //   form.append("cancel_remarks", cancel_remarks);
    // }
    const response = await axios.post(url, form, {
      headers: {
        Authorization: `Token ${token}`,
        // Let the browser set the correct multipart boundary
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Local Storage Helpers
export const saveCustomerAuth = (authData) => {
  localStorage.setItem("customerToken", authData.token);
  localStorage.setItem("customerRefCode", authData.cust_ref_code);
  localStorage.setItem("customerId", authData.customer_id.toString());
};

export const getCustomerAuth = () => {
  return {
    token: localStorage.getItem("customerToken"),
    custRefCode: localStorage.getItem("customerRefCode"),
    customerId: localStorage.getItem("customerId"),
  };
};

export const clearCustomerAuth = () => {
  localStorage.removeItem("customerToken");
  localStorage.removeItem("customerRefCode");
  localStorage.removeItem("customerId");
};

export const isCustomerAuthenticated = () => {
  return !!localStorage.getItem("customerToken");
};

// Helper to transform bookings into a set of disabled date keys (YYYY-MM-DD)
export const toDateKey = (d) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return null;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const extractDisabledDatesFromBookings = (
  bookings,
  start_time,
  end_time
) => {
  function toDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Helper to convert "HH:mm:ss" → minutes since midnight
  function timeToMinutes(timeStr) {
    if (!timeStr) return null;
    const [h, m, s] = timeStr.split(":").map((n) => parseInt(n, 10));
    return h * 60 + m + (s ? s / 60 : 0);
  }

  const requestedStart = timeToMinutes(start_time);
  const requestedEnd = timeToMinutes(end_time);

  const keySet = new Set();

  (bookings || []).forEach((b) => {
    const rawDate =
      b.booking_date ||
      b.book_date ||
      b.date ||
      (b.booking_data && b.booking_data.booking_date);

    if (!rawDate) return;

    // Parse DD-MM-YYYY (e.g., "16-08-2025")
    const dateParts = String(rawDate).split("-");
    if (dateParts.length !== 3) return;

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return;

    const date = new Date(year, month, day);
    if (
      isNaN(date.getTime()) ||
      date.getDate() !== day ||
      date.getMonth() !== month ||
      date.getFullYear() !== year
    ) {
      return;
    }

    const bookingStart = timeToMinutes(b.start_time);
    const bookingEnd = timeToMinutes(b.end_time);

    let conflict = false;
    if (
      requestedStart !== null &&
      requestedEnd !== null &&
      bookingStart !== null &&
      bookingEnd !== null
    ) {
      // Check if time overlaps
      conflict = requestedStart < bookingEnd && requestedEnd > bookingStart;
    }

    // Only disable the date if there’s a conflict
    if (conflict) {
      const key = toDateKey(date);
      keySet.add(key);
    }
  });

  return keySet;
};

// Helper function to convert Date object to YYYY-MM-DD format

export const getmyApplication = async () => {
  const custRefCode = localStorage.getItem("customerRefCode");
  const token = localStorage.getItem("customerToken");
  try {
    const response = await axios.get(
      `${BASE_URL}/get_seller_temple_list/?seller_ref_code=${custRefCode}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const processSellerApplication = async (bookingData) => {
  const token = localStorage.getItem("customerToken");
  try {
    const response = await axios.post(
      `${BASE_URL}/seller_update/`,
      bookingData,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const processpayment = async (bookingData) => {
  const token = localStorage.getItem("customerToken");
  try {
    const response = await axios.post(
      `${BASE_URL}/process_booking_payment/`,
      bookingData,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const processProductData = async (Product_Data) => {
  const token = localStorage.getItem("customerToken");
  try {
    const response = await axios.post(
      `${PRODUCT_BASE_URL}/process_product_data/`,
      Product_Data,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSellerProductList = async () => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  try {
    const url = `${PRODUCT_BASE_URL}/get_product_list/`;
    const config = {};
    if (token) {
      config.headers = { Authorization: `Token ${token}` };
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductDetailList = async (key, value) => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  try {
    const url = `${PRODUCT_BASE_URL}/get_product_detail_list/?${key}=${value}`;
    const config = {};
    if (token) {
      config.headers = { Authorization: `Token ${token}` };
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const processCategoryData = async (Category_Data) => {
  const token = localStorage.getItem("customerToken");
  try {
    const response = await axios.post(
      `${PRODUCT_BASE_URL}/process_product_category_data/`,
      Category_Data,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSellerCategory = async () => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  try {
    const url = `${PRODUCT_BASE_URL}/get_product_category_list/`;
    const config = {};
    if (token) {
      config.headers = { Authorization: `Token ${token}` };
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSellerAllList = async () => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  try {
    const url = `${BASE_URL}/get_seller_list/`;
    const config = {};
    if (token) {
      config.headers = { Authorization: `Token ${token}` };
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVariationList = async () => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("customerToken");
  try {
    const url = `${PRODUCT_BASE_URL}/variation_name_list/`;
    const config = {};
    if (token) {
      config.headers = { Authorization: `Token ${token}` };
    }
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const processProductVariations = async (payload) => {
  const token = localStorage.getItem("customerToken");
  try {
    const response = await axios.post(
      `${PRODUCT_BASE_URL}/process_product_variations/`,
      payload,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const ProcessProductImages = async (imageFile) => {
  const token = localStorage.getItem("customerToken");
  try {
    const response = await axios.post(
      `${PRODUCT_BASE_URL}/process_product_variation_images/`,
      imageFile,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
