jest.mock("axios");

const ORIGINAL_BASE_URL = process.env.REACT_APP_BASE_API_URL;
const ORIGINAL_APP_CONFIG = window.__APP_CONFIG__;

const loadFetchApiModule = (...args) => {
  const baseUrl = args.length === 0 ? "https://api.example.com" : args[0];
  const runtimeConfig = args[1];
  jest.resetModules();
  window.__APP_CONFIG__ = runtimeConfig;

  if (typeof baseUrl === "undefined") {
    delete process.env.REACT_APP_BASE_API_URL;
  } else {
    process.env.REACT_APP_BASE_API_URL = baseUrl;
  }

  const axios = require("axios");
  axios.mockReset();

  return {
    axios,
    ...require("../../helpers/FecthApi.jsx"),
  };
};

describe("FecthApi", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    delete window.__APP_CONFIG__;
  });

  afterAll(() => {
    window.__APP_CONFIG__ = ORIGINAL_APP_CONFIG;

    if (typeof ORIGINAL_BASE_URL === "undefined") {
      delete process.env.REACT_APP_BASE_API_URL;
      return;
    }

    process.env.REACT_APP_BASE_API_URL = ORIGINAL_BASE_URL;
  });

  test("throws when the base API url is missing", async () => {
    const { axios, fetchApi } = loadFetchApiModule(undefined);

    await expect(fetchApi("questions")).rejects.toThrow(
      "REACT_APP_BASE_API_URL is not defined in environment variables",
    );
    expect(axios).not.toHaveBeenCalled();
  });

  test("adds auth and institution headers for authenticated requests", async () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 3, institution_id: 8 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 5, name: "UBA" }));
    localStorage.setItem("token", "token-123");

    const { axios, get } = loadFetchApiModule("https://api.example.com/");
    axios.mockResolvedValue({ data: { ok: true } });

    await expect(get("/questions")).resolves.toEqual({ ok: true });
    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: "https://api.example.com/questions",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-123",
        "x-institution-id": 5,
      },
    });
  });

  test("uses runtime config when the build-time env is unavailable", async () => {
    const { axios, get } = loadFetchApiModule(undefined, {
      REACT_APP_BASE_API_URL: "https://runtime.example.com/",
    });
    axios.mockResolvedValue({ data: { ok: true } });

    await expect(get("/questions")).resolves.toEqual({ ok: true });
    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: "https://runtime.example.com/questions",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  test("omits auth headers on login and sends request body for write methods", async () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 3, institution_id: 8 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 5, name: "UBA" }));
    localStorage.setItem("token", "token-123");

    const { axios, post } = loadFetchApiModule();
    axios.mockResolvedValue({ data: { token: "abc" } });

    await expect(post("login", { nickname: "pedro", password: "secret" })).resolves.toEqual({
      token: "abc",
    });
    expect(axios).toHaveBeenCalledWith({
      method: "POST",
      url: "https://api.example.com/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        nickname: "pedro",
        password: "secret",
      },
    });
  });

  test("omits auth headers on public recovery endpoints", async () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 3, institution_id: 8 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 5, name: "UBA" }));
    localStorage.setItem("token", "token-123");

    const { axios, post } = loadFetchApiModule();
    axios.mockResolvedValue({ data: { message: "ok" } });

    await post("forgot-password", { email: "pedro@example.com" });
    await post("forgot-nickname", { email: "pedro@example.com" });
    await post("reset-password", {
      token: "reset-token",
      new_password: "NovaSenha123!",
    });
    await post("recover-nickname", {
      token: "recovery-token",
    });

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "POST",
      url: "https://api.example.com/forgot-password",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: "pedro@example.com",
      },
    });
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "POST",
      url: "https://api.example.com/forgot-nickname",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: "pedro@example.com",
      },
    });
    expect(axios).toHaveBeenNthCalledWith(3, {
      method: "POST",
      url: "https://api.example.com/reset-password",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        token: "reset-token",
        new_password: "NovaSenha123!",
      },
    });
    expect(axios).toHaveBeenNthCalledWith(4, {
      method: "POST",
      url: "https://api.example.com/recover-nickname",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        token: "recovery-token",
      },
    });
  });

  test("clears malformed auth storage before calling the API", async () => {
    localStorage.setItem("auth_user", "{invalid-json");
    localStorage.setItem("token", "token-123");

    const { axios, get } = loadFetchApiModule();
    axios.mockResolvedValue({ data: { ok: true } });

    await get("institutions");

    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: "https://api.example.com/institutions",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-123",
      },
    });
  });

  test("clears malformed institution and token storage before calling the API", async () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      if (key === "selected_institution") {
        return "{invalid-json";
      }

      if (key === "token") {
        throw new Error("storage blocked");
      }

      if (key === "auth_user") {
        return JSON.stringify({ institution: { id: 9 } });
      }

      return null;
    });

    const { axios, get } = loadFetchApiModule();
    axios.mockResolvedValue({ data: { ok: true } });

    await get("questions");

    expect(removeItemSpy).toHaveBeenCalledWith("selected_institution");
    expect(removeItemSpy).toHaveBeenCalledWith("token");
    expect(axios).toHaveBeenCalledWith({
      method: "GET",
      url: "https://api.example.com/questions",
      headers: {
        "Content-Type": "application/json",
        "x-institution-id": 9,
      },
    });
  });

  test("supports patch put and delete convenience helpers", async () => {
    const { axios, patch, put, del } = loadFetchApiModule();
    axios.mockResolvedValue({ data: { ok: true } });

    await patch("users/1", { active: true });
    await put("users/1", { active: false });
    await del("users/1");

    expect(axios).toHaveBeenNthCalledWith(1, {
      method: "PATCH",
      url: "https://api.example.com/users/1",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        active: true,
      },
    });
    expect(axios).toHaveBeenNthCalledWith(2, {
      method: "PUT",
      url: "https://api.example.com/users/1",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        active: false,
      },
    });
    expect(axios).toHaveBeenNthCalledWith(3, {
      method: "DELETE",
      url: "https://api.example.com/users/1",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  test("clears persisted auth and dispatches logout when the API returns 401", async () => {
    const error = { response: { status: 401 } };
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    localStorage.setItem("auth_user", JSON.stringify({ id: 3 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 5, name: "UBA" }));
    localStorage.setItem("token", "token-123");

    const { axios, get } = loadFetchApiModule();
    axios.mockRejectedValue(error);

    await expect(get("questions")).rejects.toBe(error);
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(localStorage.getItem("selected_institution")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.mock.calls[0][0].type).toBe("auth:logout");
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("does not clear auth when a login request returns 401", async () => {
    const error = { response: { status: 401 } };
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    localStorage.setItem("auth_user", JSON.stringify({ id: 3 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 5, name: "UBA" }));
    localStorage.setItem("token", "token-123");

    const { axios, post } = loadFetchApiModule();
    axios.mockRejectedValue(error);

    await expect(post("login", { nickname: "pedro", password: "secret" })).rejects.toBe(error);
    expect(localStorage.getItem("auth_user")).not.toBeNull();
    expect(localStorage.getItem("selected_institution")).not.toBeNull();
    expect(localStorage.getItem("token")).toBe("token-123");
    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
  });

  test("does not clear auth when a public password recovery request returns 401", async () => {
    const error = { response: { status: 401 } };
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    localStorage.setItem("auth_user", JSON.stringify({ id: 3 }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 5, name: "UBA" }));
    localStorage.setItem("token", "token-123");

    const { axios, post } = loadFetchApiModule();
    axios.mockRejectedValue(error);

    await expect(post("reset-password", { token: "x", new_password: "y" })).rejects.toBe(error);
    expect(localStorage.getItem("auth_user")).not.toBeNull();
    expect(localStorage.getItem("selected_institution")).not.toBeNull();
    expect(localStorage.getItem("token")).toBe("token-123");
    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
