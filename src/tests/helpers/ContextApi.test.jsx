import { useState } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AppProvider,
  getUserCbu,
  isQuestionPackageExhausted,
  mergeAuthUserProfile,
  resolveLanguage,
  resolveLocale,
  userRequiresCbuUpdate,
  useAppContext,
} from "../../helpers/ContextApi";
import { get } from "../../helpers/FecthApi.jsx";
import { translations } from "../../helpers/translations";

jest.mock("../../helpers/FecthApi.jsx", () => ({
  get: jest.fn(),
}));

const ContextHarness = () => {
  const context = useAppContext();
  const [refreshStatus, setRefreshStatus] = useState("idle");

  return (
    <>
      <div data-testid="language">{context.language}</div>
      <div data-testid="is-authenticated">{String(context.isAuthenticated)}</div>
      <div data-testid="has-access">{String(context.hasSubscriptionAccess)}</div>
      <div data-testid="requires-cbu-update">{String(context.requiresCbuUpdate)}</div>
      <div data-testid="has-package">{String(context.hasQuestionPackageAvailable)}</div>
      <div data-testid="institution">{context.selectedInstitution?.name ?? "-"}</div>
      <div data-testid="user-id">{String(context.getCurrentUserId() ?? "")}</div>
      <div data-testid="usage">{JSON.stringify(context.questionGenerationUsage)}</div>
      <div data-testid="translated">
        {context.t("header.usageResetDate", { date: "10/05/2026" })}
      </div>
      <div data-testid="missing-key">{context.t("missing.key")}</div>
      <div data-testid="formatted-date">{context.formatDate("2026-05-10T12:00:00Z") ?? ""}</div>
      <div data-testid="formatted-date-empty">{String(context.formatDate(null))}</div>
      <div data-testid="formatted-datetime">
        {context.formatDateTime("2026-05-10T12:00:00Z")}
      </div>
      <div data-testid="formatted-datetime-empty">{context.formatDateTime(null)}</div>
      <div data-testid="question-data">{context.questionData ? "set" : "unset"}</div>
      <div data-testid="selected-answer">{context.selectedAnswer ?? "-"}</div>
      <div data-testid="show-result">{String(context.showResult)}</div>
      <div data-testid="refresh-status">{refreshStatus}</div>

      <button type="button" onClick={() => context.setLanguage("pt")}>
        set-language
      </button>
      <button type="button" onClick={() => context.setLanguage("fr")}>
        set-invalid-language
      </button>
      <button
        type="button"
        onClick={() =>
          context.login(
            {
              id: 7,
              institution_id: 11,
              nickname: "pedro",
              cbu: "0070010800000001234565",
            },
            "token-123",
            {
              questions_used: 2,
              questions_limit: 10,
              questions_remaining: 1,
              cycle_end: "2026-05-10T12:00:00Z",
            },
          )
        }
      >
        login
      </button>
      <button
        type="button"
        onClick={() => {
          context.setQuestionData({ id: 10 });
          context.setSelectedAnswer("B");
          context.setShowResult(true);
        }}
      >
        prime-question-state
      </button>
      <button type="button" onClick={() => context.incrementQuestionGenerationUsage()}>
        increment-usage
      </button>
      <button
        type="button"
        onClick={() =>
          context.setQuestionGenerationUsage({
            questions_used: undefined,
            questions_remaining: null,
          })
        }
      >
        set-partial-usage
      </button>
      <button type="button" onClick={() => context.setSelectedInstitution(null)}>
        clear-institution
      </button>
      <button type="button" onClick={() => context.setQuestionGenerationUsage(null)}>
        clear-usage
      </button>
      <button type="button" onClick={() => context.resetQuestionState()}>
        reset-question-state
      </button>
      <button type="button" onClick={() => context.resetQuestionData()}>
        reset-question-data
      </button>
      <button type="button" onClick={() => context.logout()}>
        logout
      </button>
      <button
        type="button"
        onClick={() => context.login({ id: 8, nickname: "pedro-no-token" }, null, null)}
      >
        login-no-token
      </button>
      <button
        type="button"
        onClick={() =>
          context.updateAuthUserProfile({
            name: "Pedro Vieira",
            email: "pedro@example.com",
            nickname: "pedrov-updated",
            cbu: "0070010800000001234565",
          })
        }
      >
        update-auth-user
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            const result = await context.refreshSubscriptionAccess();
            setRefreshStatus(String(result));
          } catch (error) {
            setRefreshStatus(`error:${error.message}`);
          }
        }}
      >
        refresh-access
      </button>
    </>
  );
};

const renderHarness = () =>
  render(
    <AppProvider>
      <ContextHarness />
    </AppProvider>,
  );

describe("AppProvider", () => {
  const usageResetDateEs = translations.es["header.usageResetDate"].replace(
    "{date}",
    "10/05/2026",
  );
  const usageResetDatePt = translations.pt["header.usageResetDate"].replace(
    "{date}",
    "10/05/2026",
  );

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("loads the default language, translates keys and persists language changes", async () => {
    localStorage.setItem("language", "fr");

    renderHarness();

    expect(screen.getByTestId("language")).toHaveTextContent("es");
    expect(screen.getByTestId("translated")).toHaveTextContent(usageResetDateEs);
    expect(screen.getByTestId("missing-key")).toHaveTextContent("missing.key");
    expect(screen.getByTestId("formatted-date")).toHaveTextContent("10/05/2026");
    expect(screen.getByTestId("formatted-date-empty")).toHaveTextContent("null");
    expect(screen.getByTestId("formatted-datetime")).toHaveTextContent("2026");
    expect(screen.getByTestId("formatted-datetime-empty")).toHaveTextContent("-");

    await userEvent.click(screen.getByRole("button", { name: "set-language" }));

    expect(screen.getByTestId("language")).toHaveTextContent("pt");
    expect(localStorage.getItem("language")).toBe("pt");
    expect(screen.getByTestId("translated")).toHaveTextContent(usageResetDatePt);
  });

  test("initializes with a supported persisted language", () => {
    localStorage.setItem("language", "en");

    renderHarness();

    expect(screen.getByTestId("language")).toHaveTextContent("en");
  });

  test("falls back cleanly when persisted storage contains invalid json", () => {
    localStorage.setItem("auth_user", "{invalid");
    localStorage.setItem("selected_institution", "{invalid");
    localStorage.setItem("question_generation_usage", "{invalid");

    renderHarness();

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("institution")).toHaveTextContent("-");
    expect(screen.getByTestId("usage")).toHaveTextContent("null");
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(localStorage.getItem("selected_institution")).toBeNull();
    expect(localStorage.getItem("question_generation_usage")).toBeNull();
  });

  test("falls back to the default language when reading language from storage throws", () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

    getItemSpy.mockImplementation((key) => {
      if (key === "language") {
        throw new Error("storage blocked");
      }

      return null;
    });

    renderHarness();

    expect(screen.getByTestId("language")).toHaveTextContent("es");
    expect(removeItemSpy).toHaveBeenCalledWith("language");
  });

  test("falls back to the default language when setting an unsupported language", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "set-invalid-language" }));

    expect(screen.getByTestId("language")).toHaveTextContent("es");
    expect(localStorage.getItem("language")).toBe("es");
  });

  test("persists login data and fully resets the app state on logout", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "login" }));

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("has-access")).toHaveTextContent("true");
    expect(screen.getByTestId("requires-cbu-update")).toHaveTextContent("false");
    expect(screen.getByTestId("has-package")).toHaveTextContent("true");
    expect(screen.getByTestId("user-id")).toHaveTextContent("7");
    expect(localStorage.getItem("token")).toBe("token-123");
    expect(JSON.parse(localStorage.getItem("auth_user"))).toMatchObject({
      id: 7,
      nickname: "pedro",
    });

    await userEvent.click(screen.getByRole("button", { name: "prime-question-state" }));
    expect(screen.getByTestId("question-data")).toHaveTextContent("set");
    expect(screen.getByTestId("selected-answer")).toHaveTextContent("B");
    expect(screen.getByTestId("show-result")).toHaveTextContent("true");

    await userEvent.click(screen.getByRole("button", { name: "logout" }));

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("has-access")).toHaveTextContent("false");
    expect(screen.getByTestId("question-data")).toHaveTextContent("unset");
    expect(screen.getByTestId("selected-answer")).toHaveTextContent("-");
    expect(screen.getByTestId("show-result")).toHaveTextContent("false");
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(localStorage.getItem("selected_institution")).toBeNull();
    expect(localStorage.getItem("question_generation_usage")).toBeNull();
  });

  test("does not persist a token when login is called without one", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "login-no-token" }));

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
    expect(localStorage.getItem("token")).toBeNull();
  });

  test("increments question usage and never lets remaining usage go below zero", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "login" }));
    await userEvent.click(screen.getByRole("button", { name: "increment-usage" }));

    expect(screen.getByTestId("usage")).toHaveTextContent('"questions_used":3');
    expect(screen.getByTestId("usage")).toHaveTextContent('"questions_remaining":0');
    expect(screen.getByTestId("has-package")).toHaveTextContent("false");
    expect(JSON.parse(localStorage.getItem("question_generation_usage"))).toMatchObject({
      questions_used: 3,
      questions_remaining: 0,
    });
  });

  test("updates the stored auth user profile and clears the cbu pending flag", async () => {
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: 7,
        nickname: "pedro",
        cbu: "0000000000000000000000",
      }),
    );

    renderHarness();

    expect(screen.getByTestId("requires-cbu-update")).toHaveTextContent("true");
    await userEvent.click(screen.getByRole("button", { name: "update-auth-user" }));

    expect(screen.getByTestId("requires-cbu-update")).toHaveTextContent("false");
    expect(JSON.parse(localStorage.getItem("auth_user"))).toMatchObject({
      nickname: "pedrov-updated",
      cbu: "0070010800000001234565",
    });
  });

  test("creates an initial usage object when incrementing without prior usage", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "increment-usage" }));

    expect(screen.getByTestId("usage")).toHaveTextContent('"questions_used":1');
    expect(screen.getByTestId("usage")).toHaveTextContent('"questions_remaining":null');
  });

  test("increments partial usage objects using fallback values", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "set-partial-usage" }));
    await userEvent.click(screen.getByRole("button", { name: "increment-usage" }));

    expect(screen.getByTestId("usage")).toHaveTextContent('"questions_used":1');
    expect(screen.getByTestId("usage")).toHaveTextContent('"questions_remaining":null');
  });

  test("clears institution and usage through their setter helpers", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "login" }));
    await userEvent.click(screen.getByRole("button", { name: "clear-institution" }));
    await userEvent.click(screen.getByRole("button", { name: "clear-usage" }));

    expect(localStorage.getItem("selected_institution")).toBeNull();
    expect(localStorage.getItem("question_generation_usage")).toBeNull();
  });

  test("resets question state and question data helpers", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "prime-question-state" }));
    await userEvent.click(screen.getByRole("button", { name: "reset-question-state" }));

    expect(screen.getByTestId("selected-answer")).toHaveTextContent("-");
    expect(screen.getByTestId("show-result")).toHaveTextContent("false");

    await userEvent.click(screen.getByRole("button", { name: "prime-question-state" }));
    await userEvent.click(screen.getByRole("button", { name: "reset-question-data" }));

    expect(screen.getByTestId("question-data")).toHaveTextContent("unset");
    expect(screen.getByTestId("selected-answer")).toHaveTextContent("-");
    expect(screen.getByTestId("show-result")).toHaveTextContent("false");
  });

  test("returns access immediately for admin users without calling the API", async () => {
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: 1, global_role: "Admin", nickname: "admin" }),
    );

    renderHarness();

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "refresh-access" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("has-access")).toHaveTextContent("true");
      expect(screen.getByTestId("refresh-status")).toHaveTextContent("true");
    });
    expect(get).not.toHaveBeenCalled();
  });

  test("returns false when subscription access is refreshed without an authenticated user", async () => {
    renderHarness();

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "refresh-access" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("has-access")).toHaveTextContent("false");
      expect(screen.getByTestId("refresh-status")).toHaveTextContent("false");
    });
    expect(get).not.toHaveBeenCalled();
  });

  test("refreshes subscription access by selecting the default institution", async () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 9, nickname: "pedro" }));
    get
      .mockResolvedValueOnce({ data: [{ id: 1, name: "UBA" }] })
      .mockResolvedValueOnce({ data: [] });

    renderHarness();

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "refresh-access" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("institution")).toHaveTextContent("UBA");
      expect(screen.getByTestId("refresh-status")).toHaveTextContent("true");
    });
    expect(get).toHaveBeenNthCalledWith(1, "institutions");
    expect(get).toHaveBeenNthCalledWith(2, "questions");
    expect(screen.getByTestId("has-access")).toHaveTextContent("true");
    expect(JSON.parse(localStorage.getItem("selected_institution"))).toMatchObject({
      id: 1,
      name: "UBA",
    });
  });

  test("turns off subscription access when the API returns forbidden", async () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 9, nickname: "pedro" }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 1, name: "UBA" }));
    get.mockRejectedValueOnce({ response: { status: 403 } });

    renderHarness();

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "refresh-access" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("has-access")).toHaveTextContent("false");
      expect(screen.getByTestId("refresh-status")).toHaveTextContent("false");
    });
  });

  test("returns false when the default institution cannot be found", async () => {
    localStorage.setItem("auth_user", JSON.stringify({ id: 9, nickname: "pedro" }));
    get.mockResolvedValueOnce({ data: [{ id: 2, name: "Other" }] });

    renderHarness();

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "refresh-access" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("has-access")).toHaveTextContent("false");
      expect(screen.getByTestId("refresh-status")).toHaveTextContent("false");
    });
  });

  test("rethrows unexpected refresh errors", async () => {
    const thrownError = new Error("network down");
    localStorage.setItem("auth_user", JSON.stringify({ id: 9, nickname: "pedro" }));
    localStorage.setItem("selected_institution", JSON.stringify({ id: 1, name: "UBA" }));
    get.mockRejectedValueOnce(thrownError);

    renderHarness();

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "refresh-access" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("refresh-status")).toHaveTextContent("error:network down");
    });
  });

  test("reacts to the auth:logout window event", async () => {
    renderHarness();

    await userEvent.click(screen.getByRole("button", { name: "login" }));
    await act(async () => {
      window.dispatchEvent(new Event("auth:logout"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    });
  });

  test("throws when useAppContext is used outside the provider", () => {
    const OutsideConsumer = () => {
      useAppContext();
      return null;
    };

    expect(() => render(<OutsideConsumer />)).toThrow(
      "useAppContext must be used within AppProvider",
    );
  });

  test("exposes pure language and locale resolvers for fallback branches", () => {
    expect(resolveLanguage("pt")).toBe("pt");
    expect(resolveLanguage("fr")).toBe("es");
    expect(resolveLocale("pt")).toBe("pt-BR");
    expect(resolveLocale("fr")).toBe("en-US");
  });

  test("detects placeholder cbu values from direct and nested auth users", () => {
    expect(getUserCbu({ cbu: "0000000000000000000000" })).toBe(
      "0000000000000000000000",
    );
    expect(
      getUserCbu({ user: { cbu: "0000000000000000000000" } }),
    ).toBe("0000000000000000000000");
    expect(userRequiresCbuUpdate({ cbu: "0000000000000000000000" })).toBe(true);
    expect(userRequiresCbuUpdate({ cbu: "0070010800000001234565" })).toBe(false);
  });

  test("merges profile data for flat and nested auth users", () => {
    expect(
      mergeAuthUserProfile(
        { id: 1, nickname: "pedrov", cbu: "0000000000000000000000" },
        { nickname: "pedrov-updated", cbu: "0070010800000001234565" },
      ),
    ).toMatchObject({
      id: 1,
      nickname: "pedrov-updated",
      cbu: "0070010800000001234565",
    });

    expect(
      mergeAuthUserProfile(
        {
          institution_id: 4,
          user: { id: 1, nickname: "pedrov", cbu: "0000000000000000000000" },
        },
        { nickname: "pedrov-updated", cbu: "0070010800000001234565" },
      ),
    ).toMatchObject({
      institution_id: 4,
      user: {
        id: 1,
        nickname: "pedrov-updated",
        cbu: "0070010800000001234565",
      },
    });
  });

  test("detects when a question package is exhausted", () => {
    expect(isQuestionPackageExhausted(null)).toBe(false);
    expect(
      isQuestionPackageExhausted({
        questions_used: 9,
        questions_limit: 10,
        questions_remaining: 1,
      }),
    ).toBe(false);
    expect(
      isQuestionPackageExhausted({
        questions_used: 10,
        questions_limit: 10,
      }),
    ).toBe(true);
    expect(
      isQuestionPackageExhausted({
        questions_remaining: 0,
      }),
    ).toBe(true);
  });
});
