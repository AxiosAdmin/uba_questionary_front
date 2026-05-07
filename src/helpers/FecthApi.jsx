import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_API_URL
  ? process.env.REACT_APP_BASE_API_URL.replace(/\/$/, "")
  : "";

const buildUrl = (endpoint) => {
  const normalizedEndpoint = endpoint.replace(/^\//, "");
  return `${BASE_URL}/${normalizedEndpoint}`;
};

const getStoredAuthUser = () => {
  try {
    const storedUser = localStorage.getItem("auth_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("auth_user");
    return null;
  }
};

const getStoredSelectedInstitution = () => {
  try {
    const storedInstitution = localStorage.getItem("selected_institution");
    return storedInstitution ? JSON.parse(storedInstitution) : null;
  } catch {
    localStorage.removeItem("selected_institution");
    return null;
  }
};

const getToken = () => {
  try {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

const getInstitutionId = (authUser, selectedInstitution) => {
  return (
    selectedInstitution?.id ||
    authUser?.institution?.id ||
    authUser?.institution_id ||
    null
  );
};

export const fetchApi = async (endpoint, body = null, method = "GET") => {
  if (!BASE_URL) {
    throw new Error(
      "REACT_APP_BASE_API_URL is not defined in environment variables",
    );
  }

  const authUser = getStoredAuthUser();
  const selectedInstitution = getStoredSelectedInstitution();
  const institutionId = getInstitutionId(authUser, selectedInstitution);
  const token = getToken();
  const isLoginRequest = endpoint === "login";

  try {
    const config = {
      method,
      url: buildUrl(endpoint),
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token && !isLoginRequest) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (institutionId && !isLoginRequest) {
      config.headers["x-institution-id"] = institutionId;
    }

    if (body && (method === "POST" || method === "PATCH" || method === "PUT")) {
      config.data = body;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("selected_institution");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:logout"));
    }
    console.error(`Error on ${method} request to ${endpoint}:`, error);
    throw error;
  }
};

export const logoutRequest = async () => {
  if (!BASE_URL) {
    throw new Error(
      "REACT_APP_BASE_API_URL is not defined in environment variables",
    );
  }

  const token = getToken();
  const response = await axios({
    method: "POST",
    url: buildUrl("logout"),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return response.data;
};

// Convenience methods
export const get = (endpoint) => fetchApi(endpoint, null, "GET");
export const post = (endpoint, body) => fetchApi(endpoint, body, "POST");
export const patch = (endpoint, body) => fetchApi(endpoint, body, "PATCH");
export const put = (endpoint, body) => fetchApi(endpoint, body, "PUT");
export const del = (endpoint) => fetchApi(endpoint, null, "DELETE");
